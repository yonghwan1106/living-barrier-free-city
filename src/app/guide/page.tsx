import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import {
  MapPin,
  Camera,
  CheckCircle,
  Trophy,
  Users,
  Search,
  Smartphone,
  MessageCircle,
  Flag,
  Award,
  ArrowRight
} from "lucide-react";

export default function GuidePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              사용 가이드
            </h1>
            <p className="text-xl text-blue-100">
              Living Barrier-Free City 사용법을 단계별로 안내합니다
            </p>
          </div>
        </div>
      </section>

      <div className="container px-4 py-12 max-w-6xl mx-auto">
        {/* Quick Start */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">빠른 시작</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-xl transition-all hover:scale-105">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. 회원가입</h3>
              <p className="text-gray-600 mb-4">
                구글, 카카오, 네이버 소셜 로그인으로 10초 만에 가입
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/signin">가입하기 <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all hover:scale-105">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. 장벽 리포트</h3>
              <p className="text-gray-600 mb-4">
                발견한 장벽을 촬영하고 위치와 함께 등록
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/reports/new">리포트 작성 <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all hover:scale-105">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. 보상 획득</h3>
              <p className="text-gray-600 mb-4">
                퀘스트를 완료하고 XP와 포인트를 획득
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/quests">퀘스트 보기 <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
            </Card>
          </div>
        </section>

        {/* Detailed Guide */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">상세 가이드</h2>

          {/* Report Section */}
          <Card className="p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">장벽 리포트 작성하기</h3>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">위치 선택</h4>
                  <p className="text-gray-600">
                    지도에서 장벽이 있는 위치를 선택하거나, 현재 위치를 사용합니다.
                    GPS로 자동으로 주소가 입력됩니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">사진 촬영</h4>
                  <p className="text-gray-600">
                    카메라로 장벽을 촬영합니다. 여러 장을 업로드할 수 있습니다.
                    AI가 자동으로 이미지를 분석하여 장벽 유형을 제안합니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">정보 입력</h4>
                  <p className="text-gray-600">
                    장벽 유형을 선택하고 상세 설명을 작성합니다. AI 분석 결과를 참고하거나
                    직접 수정할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">제출 및 보상</h4>
                  <p className="text-gray-600">
                    리포트를 제출하면 즉시 +10 XP를 획득합니다. 다른 사용자들이 검증하면
                    추가 XP를 받을 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Map Section */}
          <Card className="p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">지도 사용하기</h3>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <Search className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">장소 검색</h4>
                    <p className="text-sm text-gray-600">
                      상단 검색창에 도시명이나 주소를 입력하여 해당 지역의 리포트를 확인
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Flag className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">마커 클릭</h4>
                    <p className="text-sm text-gray-600">
                      지도의 마커를 클릭하면 해당 리포트의 상세 정보를 확인
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">검증하기</h4>
                    <p className="text-sm text-gray-600">
                      &quot;나도 봤어요!&quot; 버튼으로 리포트를 검증하고 +5 XP 획득
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MessageCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">해결 확인</h4>
                    <p className="text-sm text-gray-600">
                      장벽이 해결되었다면 &quot;해결됐어요!&quot; 버튼으로 상태 업데이트
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quest Section */}
          <Card className="p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">퀘스트 시스템</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold inline-block mb-3">
                  일일 퀘스트
                </div>
                <h4 className="font-bold mb-2">매일 리셋</h4>
                <p className="text-sm text-gray-600 mb-3">
                  매일 자정에 새로운 퀘스트가 제공됩니다. 간단한 목표로 매일 참여를 유도합니다.
                </p>
                <p className="text-xs text-gray-500">
                  예: 첫 리포트 작성, 검증 3회 등
                </p>
              </div>

              <div>
                <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-bold inline-block mb-3">
                  주간 퀘스트
                </div>
                <h4 className="font-bold mb-2">일주일 단위</h4>
                <p className="text-sm text-gray-600 mb-3">
                  일주일 동안 달성할 수 있는 목표입니다. 더 큰 보상을 제공합니다.
                </p>
                <p className="text-xs text-gray-500">
                  예: 리포트 10개 작성, 검증 20회 등
                </p>
              </div>

              <div>
                <div className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-bold inline-block mb-3">
                  특별 퀘스트
                </div>
                <h4 className="font-bold mb-2">장기 목표</h4>
                <p className="text-sm text-gray-600 mb-3">
                  기간 제한 없이 달성할 수 있는 장기 목표입니다. 최고의 보상을 제공합니다.
                </p>
                <p className="text-xs text-gray-500">
                  예: 총 50개 리포트, 총 100회 검증 등
                </p>
              </div>
            </div>
          </Card>

          {/* Team Section */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">팀 활동</h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-lg mb-2">팀 생성하기</h4>
                <p className="text-gray-600">
                  팀 페이지에서 &quot;팀 만들기&quot; 버튼을 클릭하여 새 팀을 생성합니다.
                  팀명, 설명, 공개 여부를 설정할 수 있습니다.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-2">팀 가입하기</h4>
                <p className="text-gray-600">
                  공개된 팀 목록에서 원하는 팀을 찾아 가입할 수 있습니다.
                  팀에 가입하면 팀원들과 함께 XP를 쌓고 경쟁할 수 있습니다.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-2">팀 레벨업</h4>
                <p className="text-gray-600">
                  팀원들이 획득한 XP가 합산되어 팀 레벨이 올라갑니다.
                  높은 레벨의 팀은 리더보드에서 상위에 표시됩니다.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Tips */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">유용한 팁</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
              <Award className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-lg mb-2">XP를 빠르게 모으는 법</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 매일 일일 퀘스트 완료하기 (+60 XP)</li>
                <li>• 다른 사용자의 리포트 검증하기 (+5 XP/건)</li>
                <li>• 칭찬 리포트도 함께 작성하기 (+10 XP/건)</li>
                <li>• 팀 활동으로 추가 보너스 받기</li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200">
              <Camera className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-bold text-lg mb-2">좋은 리포트 작성법</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 장벽이 명확히 보이도록 촬영하기</li>
                <li>• 구체적이고 상세한 설명 작성하기</li>
                <li>• 정확한 위치 정보 입력하기</li>
                <li>• 심각도를 올바르게 선택하기</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl font-bold mb-8">자주 묻는 질문</h2>
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Q. 리포트 작성 시 개인정보가 노출되나요?</h3>
              <p className="text-gray-600">
                A. 닉네임과 레벨만 표시되며, 개인정보는 보호됩니다. 원하시면 익명으로도 활동할 수 있습니다.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Q. 잘못된 리포트는 어떻게 처리되나요?</h3>
              <p className="text-gray-600">
                A. 커뮤니티 검증 시스템과 관리자 검토를 통해 부적절한 리포트는 삭제됩니다.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Q. 획득한 포인트는 어디에 사용하나요?</h3>
              <p className="text-gray-600">
                A. 향후 아바타 아이템 구매, 특별 칭호 획득 등 다양한 용도로 사용할 수 있습니다.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-lg mb-2">Q. 데모 계정으로 체험할 수 있나요?</h3>
              <p className="text-gray-600">
                A. 네! 로그인 페이지에서 &quot;데모 계정으로 체험하기&quot;를 선택하시면 즉시 모든 기능을 체험할 수 있습니다.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 text-center">
          <Card className="p-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요!</h2>
            <p className="text-xl text-blue-100 mb-8">
              10초 만에 가입하고 무장애 도시 만들기에 동참하세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/signin">시작하기</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent text-white border-white hover:bg-white hover:text-blue-700">
                <Link href="/about">더 알아보기</Link>
              </Button>
            </div>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 bg-white mt-12">
        <div className="container px-4 text-center text-sm text-gray-600">
          <p>© 2025 배리어프리 경기 (Living Barrier-Free City). All rights reserved.</p>
          <p className="mt-2">2025 경기도 장애인 인권정책 공모전 출품작</p>
        </div>
      </footer>
    </div>
  );
}
