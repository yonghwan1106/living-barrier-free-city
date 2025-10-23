import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import {
  Target,
  Sparkles,
  TrendingUp,
  Award,
  Heart,
  Lightbulb,
  Zap
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="text-sm font-bold">2025 경기도 장애인 인권정책 공모전 출품작</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              살아있는 무장애 도시
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-blue-100">
              Living Barrier-Free City
            </p>
            <p className="text-lg text-blue-50 max-w-3xl mx-auto">
              경기도 전역의 물리적 장벽을 실시간으로 파악하고 개선하는
              <br />
              시민 참여형 접근성 데이터 생태계
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <Target className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-4xl font-bold mb-4">우리의 비전</h2>
              <p className="text-xl text-gray-600">
                모든 시민이 자유롭게 이동할 수 있는 경기도를 만듭니다
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 hover:shadow-xl transition-shadow border-2 hover:border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Heart className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">시민 중심</h3>
                    <p className="text-gray-600">
                      시민들이 직접 참여하여 만드는 접근성 데이터로,
                      실제 사용자의 관점을 반영합니다.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-shadow border-2 hover:border-purple-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Zap className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">실시간 데이터</h3>
                    <p className="text-gray-600">
                      GPS와 AI를 활용한 실시간 장벽 리포팅으로
                      항상 최신의 정보를 제공합니다.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-shadow border-2 hover:border-green-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Lightbulb className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">데이터 기반 정책</h3>
                    <p className="text-gray-600">
                      수집된 데이터를 분석하여 우선순위를 정하고,
                      효과적인 개선 정책을 수립합니다.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-shadow border-2 hover:border-yellow-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">게임화 시스템</h3>
                    <p className="text-gray-600">
                      퀘스트와 포인트 시스템으로 시민 참여를 유도하고,
                      지속 가능한 생태계를 만듭니다.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
                <Sparkles className="h-12 w-12 text-purple-600" />
              </div>
              <h2 className="text-4xl font-bold mb-4">작동 방식</h2>
              <p className="text-xl text-gray-600">
                간단한 3단계로 참여할 수 있습니다
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">장벽 발견 및 리포트</h3>
                  <p className="text-gray-600 text-lg">
                    일상에서 발견한 물리적 장벽을 스마트폰으로 촬영하고 위치와 함께 리포트합니다.
                    AI가 자동으로 장벽 유형을 분석하여 분류합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">커뮤니티 검증</h3>
                  <p className="text-gray-600 text-lg">
                    다른 시민들이 리포트를 확인하고 검증합니다. &quot;나도 봤어요!&quot; 기능으로
                    신뢰도를 높이고, 해결 여부도 함께 확인합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">데이터 분석 및 개선</h3>
                  <p className="text-gray-600 text-lg">
                    수집된 데이터를 분석하여 우선순위가 높은 장벽을 파악하고,
                    지자체와 협력하여 실질적인 개선 작업을 진행합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <TrendingUp className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-4xl font-bold mb-4">기대 효과</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center hover:shadow-xl transition-shadow">
                <div className="text-5xl font-bold text-blue-600 mb-2">70%</div>
                <p className="text-sm text-gray-600">주요 시설 접근성 개선</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-xl transition-shadow">
                <div className="text-5xl font-bold text-purple-600 mb-2">3배</div>
                <p className="text-sm text-gray-600">시민 참여율 증가</p>
              </Card>
              <Card className="p-6 text-center hover:shadow-xl transition-shadow">
                <div className="text-5xl font-bold text-green-600 mb-2">50%</div>
                <p className="text-sm text-gray-600">장벽 해결 속도 향상</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            함께 만드는 무장애 도시
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            당신의 참여가 누군가의 일상을 바꿉니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="shadow-xl">
              <Link href="/auth/signin">지금 시작하기</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-transparent text-white border-white hover:bg-white hover:text-blue-700">
              <Link href="/map">지도 둘러보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-gray-50">
        <div className="container px-4 text-center text-sm text-gray-600">
          <p>© 2025 배리어프리 경기 (Living Barrier-Free City). All rights reserved.</p>
          <p className="mt-2">2025 경기도 장애인 인권정책 공모전 출품작</p>
        </div>
      </footer>
    </div>
  );
}
