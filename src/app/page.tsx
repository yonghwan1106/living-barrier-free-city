import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Users, Award, TrendingUp, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";

async function getStats() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/reports`, {
      cache: 'no-store',
    });
    if (response.ok) {
      const { data } = await response.json();
      return {
        totalReports: data.length,
        resolvedBarriers: data.filter((r: { status: string }) => r.status === 'resolved').length,
        activeUsers: 3,
        coverage: Math.min(Math.round((data.length / 100) * 100), 100),
      };
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  }

  return {
    totalReports: 0,
    activeUsers: 0,
    resolvedBarriers: 0,
    coverage: 0,
  };
}

export default async function Home() {
  const stats = await getStats();
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="mx-auto max-w-5xl space-y-8 relative z-10 text-white">
          <div className="inline-block mb-4 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold shadow-lg">
            2025 경기도 장애인 인권정책 공모전 출품작
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl leading-tight">
            시민이 만드는
            <br />
            <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              살아있는 무장애 도시
            </span>
          </h1>

          <p className="text-xl font-semibold text-blue-100 mb-2">
            Living Barrier-Free City
          </p>

          <p className="mx-auto max-w-3xl text-xl text-blue-50 leading-relaxed">
            경기도 전역의 물리적 장벽을 실시간으로 파악하고 개선하는
            <br className="hidden sm:block" />
            시민 참여형 접근성 데이터 생태계
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center pt-4">
            <Button
              size="lg"
              asChild
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-2xl hover:shadow-3xl transition-all text-lg px-8 py-6 hover:scale-105"
            >
              <Link href="/auth/signin">
                <MapPin className="mr-2 h-5 w-5" />
                지금 시작하기
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600 transition-all text-lg px-8 py-6 hover:scale-105"
            >
              <Link href="/map">지도 둘러보기</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-purple-600 transition-all text-lg px-8 py-6 hover:scale-105"
            >
              <Link href="/about">소개 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="container grid gap-6 px-4 md:grid-cols-4">
          <Card className="text-center p-6 hover:shadow-lg transition-all hover:scale-105 bg-white border-2 hover:border-blue-200">
            <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-3 animate-pulse" />
            <div className="text-4xl font-bold text-blue-600 mb-2">{stats.totalReports}+</div>
            <div className="text-sm text-gray-600 font-medium">총 리포트</div>
            <div className="text-xs text-gray-500 mt-1">실시간 데이터</div>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-all hover:scale-105 bg-white border-2 hover:border-green-200">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <div className="text-4xl font-bold text-green-600 mb-2">{stats.activeUsers}</div>
            <div className="text-sm text-gray-600 font-medium">활성 사용자</div>
            <div className="text-xs text-gray-500 mt-1">데모 계정</div>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-all hover:scale-105 bg-white border-2 hover:border-purple-200">
            <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <div className="text-4xl font-bold text-purple-600 mb-2">{stats.coverage}%</div>
            <div className="text-sm text-gray-600 font-medium">경기도 커버리지</div>
            <div className="text-xs text-gray-500 mt-1">12개 도시</div>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-all hover:scale-105 bg-white border-2 hover:border-orange-200">
            <CheckCircle2 className="h-12 w-12 text-orange-600 mx-auto mb-3" />
            <div className="text-4xl font-bold text-orange-600 mb-2">{stats.resolvedBarriers}</div>
            <div className="text-sm text-gray-600 font-medium">해결된 장벽</div>
            <div className="text-xs text-green-600 mt-1 font-semibold">+{Math.round((stats.resolvedBarriers / stats.totalReports) * 100)}% 해결률</div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">핵심 기능</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 hover:border-blue-200">
              <MapPin className="mb-4 h-10 w-10 text-blue-600" />
              <h3 className="mb-2 text-xl font-bold">실시간 장벽 리포트</h3>
              <p className="text-gray-600">
                GPS와 카메라로 주변의 장벽을 10초 안에 신고하고 공유하세요.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 hover:border-green-200">
              <Users className="mb-4 h-10 w-10 text-green-600" />
              <h3 className="mb-2 text-xl font-bold">검증 시스템</h3>
              <p className="text-gray-600">
                다른 사용자의 리포트를 확인하고 신뢰도를 높여보세요.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 hover:border-yellow-200">
              <Award className="mb-4 h-10 w-10 text-yellow-600" />
              <h3 className="mb-2 text-xl font-bold">게임화</h3>
              <p className="text-gray-600">
                퀘스트를 완료하고 포인트를 얻어 레벨업하세요!
              </p>
            </Card>
            <Card className="p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 hover:border-purple-200">
              <TrendingUp className="mb-4 h-10 w-10 text-purple-600" />
              <h3 className="mb-2 text-xl font-bold">데이터 분석</h3>
              <p className="text-gray-600">
                AI가 자동으로 장벽을 분석하고 우선순위를 제안합니다.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 hover:border-indigo-200">
              <MapPin className="mb-4 h-10 w-10 text-indigo-600" />
              <h3 className="mb-2 text-xl font-bold">맞춤형 지도</h3>
              <p className="text-gray-600">
                내 이동 방식에 맞는 경로와 정보를 제공받으세요.
              </p>
            </Card>
            <Card className="p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 hover:border-pink-200">
              <Users className="mb-4 h-10 w-10 text-pink-600" />
              <h3 className="mb-2 text-xl font-bold">팀 활동</h3>
              <p className="text-gray-600">
                팀을 만들어 함께 퀘스트를 수행하고 경쟁하세요.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-24 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container px-4 text-center relative z-10">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            지금 바로 시작하세요
          </h2>
          <p className="mb-8 text-lg text-blue-100 max-w-2xl mx-auto">
            누구나 참여할 수 있습니다. 소셜 로그인으로 10초 만에 가입!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="shadow-xl hover:shadow-2xl transition-shadow">
              <Link href="/auth/signin">무료로 시작하기</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-transparent text-white border-white hover:bg-white hover:text-blue-700 transition-colors">
              <Link href="/map">데모 둘러보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container px-4 text-center text-sm text-gray-600">
          <p>© 2025 배리어프리 경기. All rights reserved.</p>
          <p className="mt-2">2025 경기도 장애인 인권정책 공모전 출품작</p>
        </div>
      </footer>
    </div>
  );
}
