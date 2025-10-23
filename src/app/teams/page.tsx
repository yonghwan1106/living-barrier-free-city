'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/layout/Header';
import {
  Users,
  Search,
  Plus,
  Trophy,
  TrendingUp,
  Crown,
} from 'lucide-react';
import { redirect } from 'next/navigation';

interface Team {
  team_id: string;
  name: string;
  description: string;
  leader_id: string;
  member_ids: string[];
  total_xp: number;
  level: number;
  is_public: boolean;
  created_at: string;
}

export default function TeamsPage() {
  const { data: session, status } = useSession();
  const [teams, setTeams] = useState<Team[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');

  // 로그인 확인
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin?callbackUrl=/teams');
    }
  }, [status]);

  // 팀 데이터 가져오기
  useEffect(() => {
    if (session) {
      fetchTeams();
      fetchMyTeams();
    }
  }, [session]);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      if (response.ok) {
        const { data } = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyTeams = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/teams?user_id=${session.user.id}`);
      if (response.ok) {
        const { data } = await response.json();
        setMyTeams(data);
      }
    } catch (error) {
      console.error('Error fetching my teams:', error);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTeamName.trim()) {
      alert('팀 이름을 입력하세요.');
      return;
    }

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTeamName,
          description: newTeamDescription,
          is_public: true,
        }),
      });

      if (response.ok) {
        alert('팀이 생성되었습니다!');
        setNewTeamName('');
        setNewTeamDescription('');
        setShowCreateForm(false);
        fetchTeams();
        fetchMyTeams();
      } else {
        const error = await response.json();
        alert(error.error || '팀 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Create team error:', error);
      alert('팀 생성 중 오류가 발생했습니다.');
    }
  };

  const handleJoinTeam = async (team_id: string) => {
    try {
      const response = await fetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id }),
      });

      if (response.ok) {
        alert('팀에 가입했습니다!');
        fetchTeams();
        fetchMyTeams();
      } else {
        const error = await response.json();
        alert(error.error || '팀 가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('Join team error:', error);
      alert('팀 가입 중 오류가 발생했습니다.');
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

  // 검색 필터링
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isTeamMember = (team: Team) => {
    return team.member_ids?.includes(session.user?.id || '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* My Teams */}
        {myTeams.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              내 팀
            </h2>
            <div className="space-y-4">
              {myTeams.map((team) => (
                <Card key={team.team_id} className="p-6 transition-all hover:shadow-xl hover:scale-[1.02] border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-xl text-blue-900">{team.name}</h3>
                        {team.leader_id === session.user?.id && (
                          <div className="px-2 py-1 bg-yellow-100 rounded-full flex items-center gap-1">
                            <Crown className="h-4 w-4 text-yellow-600" />
                            <span className="text-xs font-bold text-yellow-700">리더</span>
                          </div>
                        )}
                      </div>
                      {team.description && (
                        <p className="text-sm text-gray-700 mb-3">{team.description}</p>
                      )}
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold">{team.member_ids?.length || 0}명</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm">
                          <TrendingUp className="h-4 w-4" />
                          <span>레벨 {team.level}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          <span>{team.total_xp} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Create Team Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            새 팀 만들기
          </Button>
        </div>

        {/* Create Team Form */}
        {showCreateForm && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">새 팀 만들기</h3>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <Label htmlFor="team-name">팀 이름 *</Label>
                <Input
                  id="team-name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="예: 수원 접근성 개선단"
                  maxLength={50}
                  required
                />
              </div>
              <div>
                <Label htmlFor="team-description">팀 설명</Label>
                <Input
                  id="team-description"
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  placeholder="팀에 대한 간단한 설명"
                  maxLength={200}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">생성</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  취소
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="팀 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* All Teams */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">모든 팀</h2>
          {filteredTeams.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">팀이 없습니다</h3>
              <p className="text-gray-600">첫 번째 팀을 만들어보세요!</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTeams.map((team) => {
                const isMember = isTeamMember(team);
                return (
                  <Card key={team.team_id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{team.name}</h3>
                        {team.description && (
                          <p className="text-sm text-gray-600 mb-2">{team.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{team.member_ids?.length || 0}명</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>레벨 {team.level}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4" />
                            <span>{team.total_xp} XP</span>
                          </div>
                        </div>
                      </div>
                      {!isMember && (
                        <Button
                          size="sm"
                          onClick={() => handleJoinTeam(team.team_id)}
                        >
                          가입
                        </Button>
                      )}
                      {isMember && (
                        <span className="text-sm text-green-600 font-semibold">가입됨</span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
