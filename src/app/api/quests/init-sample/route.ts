import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { appendRow, objectToValues, getAllRows } from '@/lib/google-sheets/operations';
import { SHEET_NAMES } from '@/lib/google-sheets/client';
import type { Quest } from '@/types';

/**
 * POST /api/quests/init-sample
 * Initialize sample quests for testing
 */
export async function POST() {
  try {
    // 기존 퀘스트 확인
    const existingQuests = await getAllRows(SHEET_NAMES.QUESTS);

    if (existingQuests.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Sample quests already exist',
        count: existingQuests.length,
      });
    }

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // 샘플 퀘스트 데이터
    const sampleQuests: Quest[] = [
      // 일일 퀘스트
      {
        quest_id: uuidv4(),
        title: '첫 리포트 작성',
        description: '오늘 첫 번째 장벽 리포트를 작성하세요',
        type: 'daily',
        target_count: 1,
        xp_reward: 20,
        point_reward: 10,
        start_date: now.toISOString(),
        end_date: tomorrow.toISOString(),
        status: 'active',
        created_at: now.toISOString(),
      },
      {
        quest_id: uuidv4(),
        title: '일일 검증왕',
        description: '다른 사용자의 리포트 3개를 검증하세요',
        type: 'daily',
        target_count: 3,
        xp_reward: 30,
        point_reward: 15,
        start_date: now.toISOString(),
        end_date: tomorrow.toISOString(),
        status: 'active',
        created_at: now.toISOString(),
      },
      {
        quest_id: uuidv4(),
        title: '칭찬 전파자',
        description: '칭찬 리포트 1개를 작성하세요',
        type: 'daily',
        target_count: 1,
        xp_reward: 25,
        point_reward: 15,
        start_date: now.toISOString(),
        end_date: tomorrow.toISOString(),
        status: 'active',
        created_at: now.toISOString(),
      },
      // 주간 퀘스트
      {
        quest_id: uuidv4(),
        title: '주간 활동가',
        description: '이번 주에 리포트 10개를 작성하세요',
        type: 'weekly',
        target_count: 10,
        xp_reward: 100,
        point_reward: 50,
        start_date: now.toISOString(),
        end_date: nextWeek.toISOString(),
        status: 'active',
        created_at: now.toISOString(),
      },
      {
        quest_id: uuidv4(),
        title: '주간 검증 마스터',
        description: '이번 주에 20개의 리포트를 검증하세요',
        type: 'weekly',
        target_count: 20,
        xp_reward: 150,
        point_reward: 75,
        start_date: now.toISOString(),
        end_date: nextWeek.toISOString(),
        status: 'active',
        created_at: now.toISOString(),
      },
      {
        quest_id: uuidv4(),
        title: '문제 해결사',
        description: '해결된 장벽 5개를 확인하세요',
        type: 'weekly',
        target_count: 5,
        xp_reward: 200,
        point_reward: 100,
        start_date: now.toISOString(),
        end_date: nextWeek.toISOString(),
        status: 'active',
        created_at: now.toISOString(),
      },
      // 특별 퀘스트
      {
        quest_id: uuidv4(),
        title: '배리어프리 개척자',
        description: '총 50개의 리포트를 작성하세요',
        type: 'special',
        target_count: 50,
        xp_reward: 500,
        point_reward: 300,
        start_date: now.toISOString(),
        status: 'active',
        created_at: now.toISOString(),
      },
      {
        quest_id: uuidv4(),
        title: '전설의 검증자',
        description: '총 100개의 리포트를 검증하세요',
        type: 'special',
        target_count: 100,
        xp_reward: 1000,
        point_reward: 500,
        start_date: now.toISOString(),
        status: 'active',
        created_at: now.toISOString(),
      },
    ];

    // 퀘스트 추가
    for (const quest of sampleQuests) {
      const values = await objectToValues(SHEET_NAMES.QUESTS, quest);
      await appendRow(SHEET_NAMES.QUESTS, values);
    }

    return NextResponse.json({
      success: true,
      message: 'Sample quests created successfully',
      count: sampleQuests.length,
      quests: sampleQuests,
    });
  } catch (error) {
    console.error('Error creating sample quests:', error);
    return NextResponse.json(
      { error: 'Failed to create sample quests' },
      { status: 500 }
    );
  }
}
