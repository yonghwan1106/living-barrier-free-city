import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { v4 as uuidv4 } from 'uuid';
import { appendRow, objectToValues, findRows, updateRowById } from '@/lib/google-sheets/operations';
import { SHEET_NAMES } from '@/lib/google-sheets/client';
import { updateQuestProgress } from '@/lib/quests/progress';
import type { Report, ReportType, ReportStatus } from '@/types';

export async function POST(request: Request) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      type,
      category,
      latitude,
      longitude,
      address,
      city,
      district,
      description,
      media_urls,
      ai_analysis,
    } = body;

    // 필수 필드 확인
    if (!type || !category || !latitude || !longitude) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const newReport: Report = {
      report_id: uuidv4(),
      user_id: session.user.id,
      type,
      category,
      latitude,
      longitude,
      address: address || '',
      city: city || '',
      district: district || '',
      description: description || '',
      media_urls: media_urls || [],
      ai_analysis: ai_analysis || undefined,
      confidence_score: 100, // 초기 신뢰도
      verify_count: 0,
      status: 'active',
      admin_status: 'pending',
      created_at: now,
      updated_at: now,
    };

    // Google Sheets에 저장
    const values = await objectToValues(SHEET_NAMES.REPORTS, newReport as unknown as Record<string, unknown>);
    await appendRow(SHEET_NAMES.REPORTS, values);

    // XP 지급 (+10 XP for barrier, +15 XP for praise)
    const xpReward = type === 'barrier' ? 10 : 15;
    const users = await findRows(
      SHEET_NAMES.USERS,
      (row) => row.user_id === session.user.id
    );

    if (users.length > 0) {
      const currentXP = Number(users[0].xp || 0);
      const newXP = currentXP + xpReward;
      const newLevel = Math.floor(newXP / 100) + 1;

      await updateRowById(SHEET_NAMES.USERS, 'user_id', session.user.id, {
        xp: newXP,
        level: newLevel,
      });
    }

    // 퀘스트 진행도 업데이트
    await updateQuestProgress(
      session.user.id,
      type === 'praise' ? 'praise_created' : 'report_created'
    );

    return NextResponse.json({
      success: true,
      data: newReport,
      xp_earned: xpReward,
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const bounds = searchParams.get('bounds'); // Format: "lat1,lng1,lat2,lng2"

    // Google Sheets에서 모든 리포트 가져오기
    const { getAllRows } = await import('@/lib/google-sheets/operations');
    const { SHEET_NAMES } = await import('@/lib/google-sheets/client');

    const allReports = await getAllRows(SHEET_NAMES.REPORTS);

    // 필터링
    let filteredReports = allReports;

    if (type) {
      filteredReports = filteredReports.filter((r) => r.type === type as ReportType);
    }

    if (status) {
      filteredReports = filteredReports.filter((r) => r.status === status as ReportStatus);
    }

    // Bounds 필터링 (지도 영역 내 리포트만)
    if (bounds) {
      const [lat1, lng1, lat2, lng2] = bounds.split(',').map(Number);
      const minLat = Math.min(lat1, lat2);
      const maxLat = Math.max(lat1, lat2);
      const minLng = Math.min(lng1, lng2);
      const maxLng = Math.max(lng1, lng2);

      filteredReports = filteredReports.filter((r) => {
        const lat = Number(r.latitude);
        const lng = Number(r.longitude);
        return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
      });
    }

    return NextResponse.json({
      success: true,
      data: filteredReports,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
