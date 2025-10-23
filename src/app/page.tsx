import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Users, Award, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">배리어프리 경기</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/map" className="text-sm font-medium hover:text-blue-600">
              지도
            </Link>
            <Link href="/reports" className="text-sm font-medium hover:text-blue-600">
              리포트
            </Link>
            <Link href="/quests" className="text-sm font-medium hover:text-blue-600">
              퀘스트
            </Link>
            <Link href="/ranking" className="text-sm font-medium hover:text-blue-600">
              랭킹
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">로그인</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signin">시작하기</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            시민이 만드는
            <br />
            <span className="text-blue-600">살아있는 무장애 도시</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            경기도 전역의 물리적 장벽을 실시간으로 파악하고 개선하는
            <br />
            시민 참여형 접근성 데이터 생태계
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signin">지금 시작하기</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/map">지도 둘러보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-gray-50 py-12">
        <div className="container grid gap-8 px-4 md:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">10,000+</div>
            <div className="text-sm text-gray-600">총 리포트</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">1,000+</div>
            <div className="text-sm text-gray-600">활성 사용자</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">70%</div>
            <div className="text-sm text-gray-600">주요 시설 커버리지</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">500+</div>
            <div className="text-sm text-gray-600">해결된 장벽</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">핵심 기능</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <MapPin className="mb-4 h-10 w-10 text-blue-600" />
              <h3 className="mb-2 text-xl font-bold">실시간 장벽 리포트</h3>
              <p className="text-gray-600">
                GPS와 카메라로 주변의 장벽을 10초 안에 신고하고 공유하세요.
              </p>
            </Card>
            <Card className="p-6">
              <Users className="mb-4 h-10 w-10 text-blue-600" />
              <h3 className="mb-2 text-xl font-bold">검증 시스템</h3>
              <p className="text-gray-600">
                다른 사용자의 리포트를 확인하고 신뢰도를 높여보세요.
              </p>
            </Card>
            <Card className="p-6">
              <Award className="mb-4 h-10 w-10 text-blue-600" />
              <h3 className="mb-2 text-xl font-bold">게임화</h3>
              <p className="text-gray-600">
                퀘스트를 완료하고 포인트를 얻어 레벨업하세요!
              </p>
            </Card>
            <Card className="p-6">
              <TrendingUp className="mb-4 h-10 w-10 text-blue-600" />
              <h3 className="mb-2 text-xl font-bold">데이터 분석</h3>
              <p className="text-gray-600">
                AI가 자동으로 장벽을 분석하고 우선순위를 제안합니다.
              </p>
            </Card>
            <Card className="p-6">
              <MapPin className="mb-4 h-10 w-10 text-blue-600" />
              <h3 className="mb-2 text-xl font-bold">맞춤형 지도</h3>
              <p className="text-gray-600">
                내 이동 방식에 맞는 경로와 정보를 제공받으세요.
              </p>
            </Card>
            <Card className="p-6">
              <Users className="mb-4 h-10 w-10 text-blue-600" />
              <h3 className="mb-2 text-xl font-bold">팀 활동</h3>
              <p className="text-gray-600">
                팀을 만들어 함께 퀘스트를 수행하고 경쟁하세요.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-24 text-white">
        <div className="container px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            지금 바로 시작하세요
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            누구나 참여할 수 있습니다. 소셜 로그인으로 10초 만에 가입!
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/signin">무료로 시작하기</Link>
          </Button>
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
