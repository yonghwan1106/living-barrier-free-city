import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { v4 as uuidv4 } from 'uuid';
import { findRows, appendRow, objectToValues, updateRowById } from '@/lib/google-sheets/operations';
import { SHEET_NAMES } from '@/lib/google-sheets/client';

/**
 * POST /api/quests/claim
 * Claim quest rewards
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
    const { quest_id } = body;

    if (!quest_id) {
      return NextResponse.json(
        { error: 'Missing quest_id' },
        { status: 400 }
      );
    }

    // 퀘스트 정보 가져오기
    const quests = await findRows(
      SHEET_NAMES.QUESTS,
      (row) => row.quest_id === quest_id && row.status === 'active'
    );

    if (quests.length === 0) {
      return NextResponse.json(
        { error: 'Quest not found or inactive' },
        { status: 404 }
      );
    }

    const quest = quests[0];

    // 사용자 퀘스트 진행 상황 가져오기
    const userQuests = await findRows(
      SHEET_NAMES.USER_QUESTS,
      (row) => row.user_id === session.user.id && row.quest_id === quest_id
    );

    let userQuest = userQuests[0];

    // 사용자 퀘스트가 없으면 생성
    if (!userQuest) {
      userQuest = {
        user_quest_id: uuidv4(),
        user_id: session.user.id,
        quest_id,
        progress: 0,
        completed: false,
        claimed: false,
        started_at: new Date().toISOString(),
      };

      const values = await objectToValues(SHEET_NAMES.USER_QUESTS, userQuest);
      await appendRow(SHEET_NAMES.USER_QUESTS, values);
    }

    // 이미 보상을 청구했는지 확인
    if (userQuest.claimed) {
      return NextResponse.json(
        { error: 'Quest rewards already claimed' },
        { status: 400 }
      );
    }

    // 퀘스트 완료 여부 확인
    if (!userQuest.completed || Number(userQuest.progress) < Number(quest.target_count)) {
      return NextResponse.json(
        { error: 'Quest not completed yet' },
        { status: 400 }
      );
    }

    // 보상 지급
    const users = await findRows(
      SHEET_NAMES.USERS,
      (row) => row.user_id === session.user.id
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = users[0];
    const xpReward = Number(quest.xp_reward || 0);
    const pointReward = Number(quest.point_reward || 0);
    const newXP = Number(user.xp || 0) + xpReward;
    const newLevel = Math.floor(newXP / 100) + 1;

    await updateRowById(SHEET_NAMES.USERS, 'user_id', session.user.id, {
      xp: newXP,
      level: newLevel,
    });

    // 사용자 퀘스트 상태 업데이트
    await updateRowById(SHEET_NAMES.USER_QUESTS, 'user_quest_id', String(userQuest.user_quest_id), {
      claimed: true,
      claimed_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Quest rewards claimed successfully',
      rewards: {
        xp: xpReward,
        point: pointReward,
        new_xp: newXP,
        new_level: newLevel,
      },
    });
  } catch (error) {
    console.error('Error claiming quest rewards:', error);
    return NextResponse.json(
      { error: 'Failed to claim quest rewards' },
      { status: 500 }
    );
  }
}
