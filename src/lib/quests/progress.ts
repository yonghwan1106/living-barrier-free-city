import { v4 as uuidv4 } from 'uuid';
import { findRows, appendRow, objectToValues, updateRowById } from '../google-sheets/operations';
import { SHEET_NAMES } from '../google-sheets/client';

/**
 * Update quest progress for a user based on an action
 */
export async function updateQuestProgress(
  userId: string,
  action: 'report_created' | 'report_verified' | 'barrier_resolved' | 'praise_created'
): Promise<void> {
  try {
    // 활성 퀘스트 가져오기
    const allQuests = await findRows(
      SHEET_NAMES.QUESTS,
      (row) => row.status === 'active'
    );

    // 액션에 해당하는 퀘스트 필터링
    const relevantQuests = allQuests.filter((quest: any) => {
      const desc = quest.description.toLowerCase();
      const title = quest.title.toLowerCase();

      switch (action) {
        case 'report_created':
          return desc.includes('리포트') && desc.includes('작성') && !desc.includes('칭찬');
        case 'report_verified':
          return desc.includes('검증');
        case 'barrier_resolved':
          return desc.includes('해결');
        case 'praise_created':
          return desc.includes('칭찬') && desc.includes('리포트');
        default:
          return false;
      }
    });

    // 각 퀘스트에 대해 진행도 업데이트
    for (const quest of relevantQuests) {
      // 사용자 퀘스트 진행 상황 가져오기
      const userQuests = await findRows(
        SHEET_NAMES.USER_QUESTS,
        (row) => row.user_id === userId && row.quest_id === quest.quest_id
      );

      if (userQuests.length === 0) {
        // 새로운 사용자 퀘스트 생성
        const newUserQuest = {
          user_quest_id: uuidv4(),
          user_id: userId,
          quest_id: quest.quest_id,
          progress: 1,
          completed: 1 >= quest.target_count,
          claimed: false,
          started_at: new Date().toISOString(),
        };

        const values = await objectToValues(SHEET_NAMES.USER_QUESTS, newUserQuest);
        await appendRow(SHEET_NAMES.USER_QUESTS, values);
      } else {
        // 기존 퀘스트 진행도 업데이트
        const userQuest = userQuests[0];

        if (!userQuest.completed) {
          const newProgress = (userQuest.progress || 0) + 1;
          const isCompleted = newProgress >= quest.target_count;

          await updateRowById(SHEET_NAMES.USER_QUESTS, 'user_quest_id', userQuest.user_quest_id, {
            progress: newProgress,
            completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : undefined,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error updating quest progress:', error);
    // 에러가 발생해도 메인 작업은 계속 진행
  }
}
