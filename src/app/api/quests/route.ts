import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { v4 as uuidv4 } from 'uuid';
import { getAllRows, findRows, appendRow, objectToValues } from '@/lib/google-sheets/operations';
import { SHEET_NAMES } from '@/lib/google-sheets/client';
import type { Quest, UserQuest } from '@/types';

/**
 * GET /api/quests
 * Get all active quests and user's progress
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // 모든 활성 퀘스트 가져오기
    const allQuests = await getAllRows(SHEET_NAMES.QUESTS);
    const activeQuests = allQuests.filter((q) => q.status === 'active');

    // 사용자가 로그인한 경우 진행 상황 추가
    if (session?.user?.id) {
      const userQuests = await findRows(
        SHEET_NAMES.USER_QUESTS,
        (row) => row.user_id === session.user.id
      );

      // 퀘스트에 사용자 진행 상황 매핑
      const questsWithProgress = activeQuests.map((quest) => {
        const userQuest = userQuests.find((uq) => uq.quest_id === quest.quest_id);
        return {
          ...quest,
          user_progress: userQuest?.progress || 0,
          user_completed: userQuest?.is_completed || false,
          user_claimed: userQuest?.claimed_reward || false,
        };
      });

      return NextResponse.json({
        success: true,
        data: questsWithProgress,
      });
    }

    return NextResponse.json({
      success: true,
      data: activeQuests,
    });
  } catch (error) {
    console.error('Error fetching quests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quests' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/quests
 * Create a new quest (admin only for now)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      type,
      target_count,
      xp_reward,
      point_reward,
      start_date,
      end_date,
    } = body;

    // Validation
    if (!title || !description || !type || !target_count) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newQuest: Quest = {
      quest_id: uuidv4(),
      title,
      description,
      type,
      target_count,
      xp_reward: xp_reward || 50,
      point_reward: point_reward || 0,
      start_date: start_date || new Date().toISOString(),
      end_date,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    const values = await objectToValues(SHEET_NAMES.QUESTS, newQuest as unknown as Record<string, unknown>);
    await appendRow(SHEET_NAMES.QUESTS, values);

    return NextResponse.json({
      success: true,
      data: newQuest,
    });
  } catch (error) {
    console.error('Error creating quest:', error);
    return NextResponse.json(
      { error: 'Failed to create quest' },
      { status: 500 }
    );
  }
}
