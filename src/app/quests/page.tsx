'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import {
  Trophy,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  Zap,
} from 'lucide-react';
import { redirect } from 'next/navigation';

interface QuestWithProgress {
  quest_id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  target_count: number;
  xp_reward: number;
  point_reward?: number;
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'expired';
  user_progress?: number;
  user_completed?: boolean;
  user_claimed?: boolean;
}

export default function QuestsPage() {
  const { data: session, status } = useSession();
  const [quests, setQuests] = useState<QuestWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 로그인 확인
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin?callbackUrl=/quests');
    }
  }, [status]);

  // 퀘스트 데이터 가져오기
  useEffect(() => {
    if (session) {
      fetchQuests();
    }
  }, [session]);

  const fetchQuests = async () => {
    try {
      const response = await fetch('/api/quests');
      if (response.ok) {
        const { data } = await response.json();
        setQuests(data);
      }
    } catch (error) {
      console.error('Error fetching quests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimReward = async (quest_id: string) => {
    try {
      const response = await fetch('/api/quests/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quest_id }),
      });

      if (response.ok) {
        const { rewards } = await response.json();
        alert(`보상 획득! +${rewards.xp} XP${rewards.point > 0 ? `, +${rewards.point} 포인트` : ''}\n현재 레벨: ${rewards.new_level}`);
        fetchQuests(); // 퀘스트 목록 새로고침
      } else {
        const error = await response.json();
        alert(error.error || '보상 청구에 실패했습니다.');
      }
    } catch (error) {
      console.error('Claim error:', error);
      alert('보상 청구 중 오류가 발생했습니다.');
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // 퀘스트 타입별 그룹화
  const dailyQuests = quests.filter(q => q.type === 'daily');
  const weeklyQuests = quests.filter(q => q.type === 'weekly');
  const specialQuests = quests.filter(q => q.type === 'special');

  const getQuestIcon = (type: string) => {
    switch (type) {
      case 'daily':
        return <Calendar className="h-5 w-5" />;
      case 'weekly':
        return <Clock className="h-5 w-5" />;
      case 'special':
        return <Star className="h-5 w-5" />;
      default:
        return <Trophy className="h-5 w-5" />;
    }
  };

  const getQuestColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'bg-blue-500';
      case 'weekly':
        return 'bg-purple-500';
      case 'special':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const renderQuestCard = (quest: QuestWithProgress) => {
    const progress = quest.user_progress || 0;
    const progressPercentage = Math.min((progress / quest.target_count) * 100, 100);
    const isCompleted = quest.user_completed || progress >= quest.target_count;
    const isClaimed = quest.user_claimed || false;

    return (
      <Card
        key={quest.quest_id}
        className={`p-5 transition-all duration-300 hover:shadow-xl ${
          isClaimed
            ? 'opacity-60 bg-gray-50'
            : isCompleted
            ? 'border-2 border-green-500 shadow-lg'
            : 'hover:scale-[1.02] hover:border-blue-200 border-2 border-transparent'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${getQuestColor(quest.type)} text-white shadow-md`}>
            {getQuestIcon(quest.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">{quest.title}</h3>
              {isCompleted && !isClaimed && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full animate-pulse">
                  완료!
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-4">{quest.description}</p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
                <span>진행도</span>
                <span className="text-blue-600">{progress} / {quest.target_count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getQuestColor(quest.type)} ${
                    isCompleted ? 'animate-pulse' : ''
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-right">
                {progressPercentage.toFixed(0)}% 완료
              </div>
            </div>

            {/* Rewards */}
            <div className="flex items-center gap-4 text-sm mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <Zap className="h-5 w-5" />
                <span className="font-bold">+{quest.xp_reward} XP</span>
              </div>
              {quest.point_reward && quest.point_reward > 0 && (
                <div className="flex items-center gap-2 text-yellow-700">
                  <Trophy className="h-5 w-5" />
                  <span className="font-bold">+{quest.point_reward} P</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            {isClaimed ? (
              <div className="flex items-center justify-center gap-2 text-green-600 text-sm py-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <span className="font-bold">보상 획득 완료</span>
              </div>
            ) : isCompleted ? (
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
                onClick={() => handleClaimReward(quest.quest_id)}
              >
                <Trophy className="h-5 w-5 mr-2" />
                보상 받기
              </Button>
            ) : (
              <div className="text-sm text-gray-500 text-center py-2 bg-gray-100 rounded-lg">
                {quest.end_date && (
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4" />
                    마감: {new Date(quest.end_date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* User Info */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="font-bold text-2xl">{session.user?.nickname || session.user?.name}</h2>
                <Trophy className="h-6 w-6 text-yellow-300 animate-pulse" />
              </div>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <p className="text-sm font-bold">레벨 {session.user?.level || 1}</p>
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <p className="text-sm font-bold">{session.user?.xp || 0} XP</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xs mb-1">다음 레벨까지</div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-yellow-400"
                    style={{ width: `${((session.user?.xp || 0) % 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Trophy className="h-12 w-12 text-yellow-300" />
              </div>
            </div>
          </div>
        </Card>

        {quests.length === 0 ? (
          <Card className="p-8 text-center">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">퀘스트가 없습니다</h3>
            <p className="text-gray-600 mb-4">샘플 퀘스트를 생성하시겠습니까?</p>
            <Button
              onClick={async () => {
                try {
                  const response = await fetch('/api/quests/init-sample', {
                    method: 'POST',
                  });
                  if (response.ok) {
                    alert('샘플 퀘스트가 생성되었습니다!');
                    fetchQuests();
                  }
                } catch (error) {
                  console.error('Error creating sample quests:', error);
                }
              }}
            >
              샘플 퀘스트 생성
            </Button>
          </Card>
        ) : (
          <>
            {/* Daily Quests */}
            {dailyQuests.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-bold">일일 퀘스트</h2>
                  <span className="text-sm text-gray-500">({dailyQuests.length})</span>
                </div>
                <div className="space-y-3">
                  {dailyQuests.map(renderQuestCard)}
                </div>
              </div>
            )}

            {/* Weekly Quests */}
            {weeklyQuests.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-bold">주간 퀘스트</h2>
                  <span className="text-sm text-gray-500">({weeklyQuests.length})</span>
                </div>
                <div className="space-y-3">
                  {weeklyQuests.map(renderQuestCard)}
                </div>
              </div>
            )}

            {/* Special Quests */}
            {specialQuests.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <h2 className="text-lg font-bold">특별 퀘스트</h2>
                  <span className="text-sm text-gray-500">({specialQuests.length})</span>
                </div>
                <div className="space-y-3">
                  {specialQuests.map(renderQuestCard)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
