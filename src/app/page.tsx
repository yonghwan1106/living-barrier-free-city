import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Users, Award, TrendingUp } from "lucide-react";
import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 py-24 text-center bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="mx-auto max-w-4xl space-y-6 relative z-10">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            2025 경기도 장애인 인권정책 공모전 출품작
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl animate-fade-in">
            시민이 만드는
            <br />
            <span className="text-blue-600 bg-clip-text">살아있는 무장애 도시</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            경기도 전역의 물리적 장벽을 실시간으로 파악하고 개선하는
            <br />
            시민 참여형 접근성 데이터 생태계
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/auth/signin">지금 시작하기</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="hover:bg-blue-50 transition-colors">
              <Link href="/map">지도 둘러보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="container grid gap-6 px-4 md:grid-cols-4">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white">
            <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
            <div className="text-sm text-gray-600 font-medium">총 리포트</div>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <div className="text-4xl font-bold text-green-600 mb-2">1,000+</div>
            <div className="text-sm text-gray-600 font-medium">활성 사용자</div>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white">
            <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <div className="text-4xl font-bold text-purple-600 mb-2">70%</div>
            <div className="text-sm text-gray-600 font-medium">주요 시설 커버리지</div>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white">
            <Award className="h-12 w-12 text-orange-600 mx-auto mb-3" />
            <div className="text-4xl font-bold text-orange-600 mb-2">500+</div>
            <div className="text-sm text-gray-600 font-medium">해결된 장벽</div>
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
