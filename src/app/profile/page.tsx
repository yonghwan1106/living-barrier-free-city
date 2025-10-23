'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowLeft,
  Edit,
  Trophy
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Report } from '@/types';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin?callbackUrl=/profile');
    }
  }, [status]);

  // 사용자 리포트 가져오기
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserReports();
    }
  }, [session]);

  const fetchUserReports = async () => {
    try {
      const response = await fetch('/api/reports');
      if (response.ok) {
        const { data } = await response.json();
        // 사용자의 리포트만 필터링
        const filtered = data.filter((r: Report) => r.user_id === session?.user?.id);
        setUserReports(filtered);
      }
    } catch (error) {
      console.error('Error fetching user reports:', error);
    } finally {
      setIsLoading(false);
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

  const user = session.user;
  const level = user.level || 1;
  const xp = user.xp || 0;
  const nextLevelXP = level * 100; // 간단한 레벨 시스템
  const xpProgress = (xp % nextLevelXP) / nextLevelXP * 100;

  // 통계 계산
  const barrierReports = userReports.filter(r => r.type === 'barrier').length;
  const praiseReports = userReports.filter(r => r.type === 'praise').length;
  const resolvedReports = userReports.filter(r => r.status === 'resolved').length;
  const totalVerifications = userReports.reduce((sum, r) => sum + (r.verify_count || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/map">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">프로필</h1>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile/edit">
              <Edit className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* User Info Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.nickname?.[0] || user.name?.[0] || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{user.nickname || user.name}</h2>
              <p className="text-sm text-gray-600 mb-3">{user.email}</p>

              {/* Level & XP */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-semibold">레벨 {level}</span>
                  <span className="text-xs text-gray-500">({xp} XP)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${xpProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  다음 레벨까지 {nextLevelXP - (xp % nextLevelXP)} XP
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{userReports.length}</div>
            <div className="text-xs text-gray-600">총 리포트</div>
          </Card>
          <Card className="p-4 text-center">
            <Award className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{barrierReports}</div>
            <div className="text-xs text-gray-600">장벽 리포트</div>
          </Card>
          <Card className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{resolvedReports}</div>
            <div className="text-xs text-gray-600">해결된 장벽</div>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalVerifications}</div>
            <div className="text-xs text-gray-600">받은 검증</div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            최근 활동
          </h3>
          {userReports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>아직 활동 내역이 없습니다.</p>
              <Button className="mt-4" asChild>
                <Link href="/reports/new">첫 리포트 작성하기</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {userReports.slice(0, 5).map((report) => (
                <div
                  key={report.report_id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    report.type === 'barrier' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{report.category}</div>
                    <div className="text-xs text-gray-500">{report.address || '위치 정보 없음'}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(report.created_at).toLocaleDateString('ko-KR')}
                  </div>
                  {report.status === 'resolved' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              ))}
              {userReports.length > 5 && (
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/reports">모든 활동 보기</Link>
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Achievements (준비중) */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5" />
            업적
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 첫 리포트 작성 */}
            <div className={`p-4 rounded-lg border-2 text-center ${
              userReports.length > 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 opacity-50'
            }`}>
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-xs font-semibold">첫 걸음</div>
              <div className="text-xs text-gray-500">첫 리포트 작성</div>
            </div>

            {/* 10개 리포트 */}
            <div className={`p-4 rounded-lg border-2 text-center ${
              userReports.length >= 10 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 opacity-50'
            }`}>
              <div className="text-3xl mb-2">🌟</div>
              <div className="text-xs font-semibold">열정</div>
              <div className="text-xs text-gray-500">10개 리포트</div>
            </div>

            {/* 장벽 해결 */}
            <div className={`p-4 rounded-lg border-2 text-center ${
              resolvedReports > 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 opacity-50'
            }`}>
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-xs font-semibold">문제 해결사</div>
              <div className="text-xs text-gray-500">장벽 해결</div>
            </div>

            {/* 레벨 5 */}
            <div className={`p-4 rounded-lg border-2 text-center ${
              level >= 5 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 opacity-50'
            }`}>
              <div className="text-3xl mb-2">👑</div>
              <div className="text-xs font-semibold">베테랑</div>
              <div className="text-xs text-gray-500">레벨 5 달성</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
