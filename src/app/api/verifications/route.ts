import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { v4 as uuidv4 } from 'uuid';
import { appendRow, objectToValues, findRows, updateRowById } from '@/lib/google-sheets/operations';
import { SHEET_NAMES } from '@/lib/google-sheets/client';
import { updateQuestProgress } from '@/lib/quests/progress';
import type { Verification } from '@/types';

/**
 * POST /api/verifications
 * Create a new verification (나도 봤어요 or 해결됐어요)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { report_id, type } = body;

    // Validation
    if (!report_id || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: report_id, type' },
        { status: 400 }
      );
    }

    if (type !== 'confirm' && type !== 'resolved') {
      return NextResponse.json(
        { error: 'Invalid verification type. Must be "confirm" or "resolved"' },
        { status: 400 }
      );
    }

    // 같은 사용자가 이미 검증했는지 확인
    const existingVerifications = await findRows(
      SHEET_NAMES.VERIFICATIONS,
      (row) => row.report_id === report_id && row.user_id === session.user.id && row.type === type
    );

    if (existingVerifications.length > 0) {
      return NextResponse.json(
        { error: 'You have already verified this report' },
        { status: 400 }
      );
    }

    // 리포트가 존재하는지 확인
    const reports = await findRows(
      SHEET_NAMES.REPORTS,
      (row) => row.report_id === report_id
    );

    if (reports.length === 0) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    const report = reports[0];

    // 새로운 검증 생성
    const newVerification: Verification = {
      verification_id: uuidv4(),
      report_id,
      user_id: session.user.id,
      type,
      created_at: new Date().toISOString(),
    };

    const values = await objectToValues(SHEET_NAMES.VERIFICATIONS, newVerification as unknown as Record<string, unknown>);
    await appendRow(SHEET_NAMES.VERIFICATIONS, values);

    // 리포트 업데이트
    const updates: Record<string, unknown> = {};

    if (type === 'confirm') {
      // verify_count 증가
      const verifyCount = Number(report.verify_count || 0) + 1;
      updates.verify_count = verifyCount;
      // confidence_score 증가 (간단한 계산: 검증 수 * 10, 최대 100)
      updates.confidence_score = Math.min(100, verifyCount * 10);
    } else if (type === 'resolved') {
      // 상태를 resolved로 변경
      updates.status = 'resolved';
      updates.resolved_at = new Date().toISOString();
      updates.resolved_by = session.user.id;
    }

    await updateRowById(SHEET_NAMES.REPORTS, 'report_id', String(report_id), updates);

    // 검증한 사용자에게 XP 부여 (5 XP)
    const users = await findRows(
      SHEET_NAMES.USERS,
      (row) => row.user_id === session.user.id
    );

    if (users.length > 0) {
      const currentXP = Number(users[0].xp || 0);
      const newXP = currentXP + 5;
      const newLevel = Math.floor(newXP / 100) + 1;

      await updateRowById(SHEET_NAMES.USERS, 'user_id', session.user.id, {
        xp: newXP,
        level: newLevel,
      });
    }

    // 퀘스트 진행도 업데이트
    await updateQuestProgress(
      session.user.id,
      type === 'confirm' ? 'report_verified' : 'barrier_resolved'
    );

    return NextResponse.json({
      success: true,
      data: newVerification,
      message: type === 'confirm' ? 'Verification added' : 'Report marked as resolved',
    });
  } catch (error) {
    console.error('Error creating verification:', error);
    return NextResponse.json(
      { error: 'Failed to create verification' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/verifications?report_id=xxx
 * Get all verifications for a report
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const report_id = searchParams.get('report_id');

    if (!report_id) {
      return NextResponse.json(
        { error: 'Missing report_id parameter' },
        { status: 400 }
      );
    }

    const verifications = await findRows(
      SHEET_NAMES.VERIFICATIONS,
      (row) => row.report_id === report_id
    );

    return NextResponse.json({
      success: true,
      data: verifications,
    });
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verifications' },
      { status: 500 }
    );
  }
}
