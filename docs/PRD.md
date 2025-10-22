# Product Requirements Document (PRD)
## 배리어프리 경기 - 시민 참여형 접근성 데이터 생태계

---

## 1. 프로젝트 개요

### 1.1 프로젝트 정보
- **프로젝트명**: 배리어프리 경기 (Living Barrier-Free City)
- **목적**: 2025 경기도 장애인 인권정책 공모전 제출
- **비전**: 시민의 집단지성으로 경기도 전역의 물리적, 제도적 장벽을 실시간으로 파악하고 개선하여, 누구나 차별 없이 이동하고 생활할 수 있는 '살아있는 무장애 도시' 구현

### 1.2 핵심 목표
- **데이터 확보**: 1년 내 경기도 내 주요 공공시설 및 다중이용시설의 접근성 데이터 70% 이상 확보
- **시민 참여**: 월간 활성 사용자(MAU) 1만 명 달성
- **행정 효율화**: 접근성 민원 평균 처리 기간 30% 단축
- **정책 연계**: 연 2회 이상 '접근성 개선 우선순위 지역' 선정 및 예산 편성 근거 자료 제공

---

## 2. 기술 스택

### 2.1 Frontend
- **Framework**: Next.js 15.x (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **State Management**: Zustand / React Query
- **UI Components**: shadcn/ui, Radix UI
- **Maps**: Naver Maps API v3
- **Image Optimization**: Next.js Image Component
- **PWA**: next-pwa (오프라인 지원, 설치 가능한 앱)

### 2.2 Backend & API
- **Runtime**: Next.js API Routes (Serverless Functions)
- **AI Integration**: Anthropic Claude Sonnet 4.0 API
  - 이미지 분석 (장벽 자동 분류)
  - 텍스트 분석 (민원 카테고리 자동 분류)
  - 리포트 품질 검증
- **Authentication**: NextAuth.js v5
  - Google OAuth
  - Kakao OAuth
  - Naver OAuth
- **File Upload**: Vercel Blob Storage

### 2.3 Database & Storage
- **Primary Database**: Google Sheets API v4
  - 리포트 데이터
  - 사용자 프로필
  - 포인트/레벨 시스템
  - 퀘스트 진행 상황
- **File Storage**:
  - Vercel Blob (이미지/동영상)
  - Google Drive (백업)

### 2.4 Deployment & Infrastructure
- **Hosting**: Vercel
- **Repository**: GitHub
- **CI/CD**: GitHub Actions + Vercel Auto Deploy
- **Domain**: Custom Domain (배리어프리경기.kr 권장)
- **Analytics**: Vercel Analytics, Google Analytics 4

### 2.5 Additional APIs & Services
- **Naver Maps API**: 지도 표시, 경로 안내
- **Naver Geocoding API**: 주소 ↔ 좌표 변환
- **Web Push API**: 푸시 알림 (PWA)
- **Google Sheets API**: 데이터 CRUD
- **Google Drive API**: 파일 백업
- **SendGrid / Resend**: 이메일 알림 (선택)

---

## 3. 시스템 아키텍처

### 3.1 전체 구조
```
[사용자] ←→ [Next.js Frontend (Vercel)]
              ↓
         [API Routes]
              ↓
    ┌────────┼────────┐
    ↓        ↓        ↓
[Claude API][Naver Maps][Google Sheets API]
    ↓                      ↓
[AI 분석]            [데이터 저장]
              ↓
         [Vercel Blob]
              ↓
         [이미지 저장]
```

### 3.2 데이터 플로우

#### 리포트 제출 플로우
1. 사용자가 사진/영상 촬영 + 위치 정보 자동 수집
2. Frontend에서 Vercel Blob에 파일 업로드
3. API Route로 메타데이터 전송
4. Claude API로 이미지 분석 (카테고리 자동 분류)
5. Google Sheets에 리포트 저장
6. 사용자에게 포인트 지급 및 레벨 업데이트
7. 지도에 실시간 반영

#### 리포트 검증 플로우
1. 사용자가 다른 리포트 확인
2. "나도 봤어요!" 또는 "해결됐어요!" 선택
3. Google Sheets에서 해당 리포트의 신뢰도 점수 업데이트
4. 검증자에게 포인트 지급
5. 신뢰도 임계값 도달 시 행정 시스템에 자동 전달

---

## 4. 기능 요구사항

### 4.1 사용자 기능

#### 4.1.1 온보딩
- [ ] 소셜 로그인 (Google, Kakao, Naver)
- [ ] 아바타 생성 및 커스터마이징
- [ ] 접근성 프로필 설정 (선택)
  - 이동 방식: 수동 휠체어, 전동 휠체어, 유모차, 시각장애인용 지팡이, 보행 보조기구 등
- [ ] 튜토리얼 (첫 리포트 작성 가이드)

#### 4.1.2 리포트 작성
**장벽 리포트**
- [ ] 카메라 촬영 (사진/짧은 영상 10초 이내)
- [ ] GPS 위치 자동 기록
- [ ] 카테고리 선택 (아이콘 기반)
  - 인도 막힘 (불법 주차, 적치물)
  - 경사로 없음/파손
  - 점자블록 파손/누락
  - 장애인 화장실 고장/부족
  - 높은 문턱
  - 엘리베이터 고장
  - 안내 표지판 부족
  - 키오스크 접근성 불량
  - 기타
- [ ] 간단한 설명 입력 (선택, 100자 이내)
- [ ] AI 자동 분류 (Claude API)
- [ ] 제출 후 즉시 포인트 지급 (+10 XP)

**칭찬 리포트**
- [ ] 사진 촬영
- [ ] GPS 위치 자동 기록
- [ ] 칭찬 카테고리 선택
  - 경사로 우수
  - 장애인 화장실 청결/작동 양호
  - 친절한 직원
  - 음성 안내 우수
  - 넓은 통로
  - 기타
- [ ] 간단한 설명 입력
- [ ] 제출 후 포인트 지급 (+15 XP)

#### 4.1.3 리포트 검증
- [ ] 주변 리포트 알림 (위치 기반)
- [ ] "나도 봤어요!" 확인 (+5 XP)
- [ ] "해결됐어요!" 해결 리포트 작성 (+25 XP)
  - 해결된 모습 사진 첨부 필수
  - 원본 리포트 상태 업데이트
  - 원본 작성자에게 알림 + 보너스 포인트 (+50 XP)

#### 4.1.4 살아있는 접근성 지도 (리빙 맵)
- [ ] Naver Maps 기반 지도 표시
- [ ] 리포트 실시간 시각화
  - 장벽: 붉은 마커
  - 칭찬: 푸른 마커
  - 해결됨: 녹색 마커
- [ ] 맞춤형 필터
  - 내 접근성 프로필 기반 필터링
  - 카테고리별 필터 (경사로, 화장실 등)
  - 해결/미해결 필터
  - 시간대 필터 (최근 7일, 30일 등)
- [ ] 마커 클릭 시 상세 정보 표시
  - 사진/영상
  - 작성자 닉네임
  - 신뢰도 점수
  - 확인 횟수
  - 작성일
  - "나도 봤어요!" 버튼
  - "해결됐어요!" 버튼

#### 4.1.5 개인 맞춤형 길찾기
- [ ] 출발지/도착지 입력
- [ ] 접근성 프로필 기반 경로 추천
  - 휠체어: 경사로, 엘리베이터 우선
  - 시각장애: 점자블록, 음성 안내 있는 경로
  - 유모차: 넓은 통로, 경사 완만한 경로
- [ ] 경로 상의 장벽/칭찬 마커 표시
- [ ] 예상 소요 시간 및 난이도 표시

#### 4.1.6 게임화 요소
**포인트 & 레벨**
- [ ] XP 시스템
- [ ] 레벨업 시스템 (Lv.1 ~ Lv.10)
  - Lv.1: 시민 탐사대원
  - Lv.3: 배리어프리 정찰병
  - Lv.5: 접근성 전문가
  - Lv.7: 무장애 수호자
  - Lv.10: 배리어프리 마스터
- [ ] 레벨별 아바타 아이템 잠금 해제
- [ ] 특별 칭호 획득

**퀘스트**
- [ ] 일일 퀘스트 (매일 자정 리셋)
  - 예: "점자블록 사진 1회 찍기"
  - 예: "지하철역 엘리베이터 1곳 칭찬하기"
- [ ] 주간 챌린지 (매주 월요일 리셋)
  - 예: "우리 동네 공원 3곳 접근성 분석하기"
  - 예: "장벽 리포트 10개 작성하기"
- [ ] 특별 이벤트 (캠페인)
  - 예: "경기도 지하철역 완전정복"
  - 예: "장벽 제로 식당 찾기"

**랭킹 & 리더보드**
- [ ] 개인 랭킹 (전체)
- [ ] 지역별 랭킹 (시/군/구 대항전)
- [ ] 주간/월간/연간 랭킹
- [ ] 팀(길드) 랭킹
- [ ] 명예의 전당 (월간 Top 10)

**팀(길드) 기능**
- [ ] 팀 생성/가입
- [ ] 팀 채팅
- [ ] 팀 퀘스트
- [ ] 팀 대항전

#### 4.1.7 마이페이지
- [ ] 프로필 정보 (아바타, 닉네임, 레벨)
- [ ] 통계
  - 총 리포트 수 (장벽/칭찬)
  - 총 검증 수
  - 해결 기여 수
  - 총 획득 XP
  - 달성한 퀘스트 수
- [ ] 활동 내역
  - 내가 작성한 리포트
  - 내가 검증한 리포트
  - 내가 해결한 리포트
- [ ] 획득한 칭호 & 아이템
- [ ] 설정
  - 알림 설정
  - 접근성 프로필 수정
  - 로그아웃

### 4.2 관리자 (공무원) 기능

#### 4.2.1 대시보드
- [ ] 관할 구역별 접근성 현황 한눈에 보기
- [ ] 신규 리포트 알림
- [ ] 민원 처리 현황 (접수/처리 중/완료)
- [ ] 통계
  - 일별/주별/월별 리포트 수
  - 카테고리별 장벽 발생 빈도
  - 평균 민원 처리 시간
  - 해결률

#### 4.2.2 리포트 관리
- [ ] 리포트 목록 (필터링/검색)
- [ ] 리포트 상세 보기
- [ ] 민원 상태 변경 (접수 → 처리 중 → 완료)
- [ ] 담당 부서 지정
- [ ] 내부 메모 작성
- [ ] 처리 완료 시 시민에게 자동 알림

#### 4.2.3 핫스팟 분석
- [ ] 지도 기반 핫스팟 히트맵
- [ ] 반복 발생 문제 유형 분석
- [ ] 지역별 비교 분석
- [ ] 개선 우선순위 지역 추천 (AI 기반)

#### 4.2.4 정책 결정 지원
- [ ] 데이터 기반 보고서 자동 생성
  - 월간/분기별/연간 접근성 현황 리포트
  - 예산 편성 근거 자료
  - 개선 우선순위 제안
- [ ] CSV/Excel 데이터 내보내기

---

## 5. 데이터 모델 (Google Sheets 스키마)

### 5.1 Users (사용자)
| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| user_id | string | 고유 ID (UUID) |
| email | string | 이메일 |
| name | string | 이름 |
| nickname | string | 닉네임 |
| provider | string | OAuth 제공자 (google, kakao, naver) |
| avatar_items | JSON string | 아바타 아이템 목록 |
| accessibility_profile | JSON string | 접근성 프로필 (이동 방식 등) |
| xp | number | 경험치 |
| level | number | 레벨 |
| titles | JSON string | 획득한 칭호 목록 |
| team_id | string | 소속 팀 ID |
| created_at | datetime | 가입일 |
| last_login | datetime | 마지막 로그인 |

### 5.2 Reports (리포트)
| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| report_id | string | 고유 ID (UUID) |
| user_id | string | 작성자 ID |
| type | string | 리포트 타입 (barrier, praise) |
| category | string | 카테고리 |
| latitude | number | 위도 |
| longitude | number | 경도 |
| address | string | 주소 (Geocoding) |
| city | string | 시/군 |
| district | string | 구/동 |
| description | string | 설명 |
| media_urls | JSON string | 이미지/영상 URL 배열 |
| ai_analysis | JSON string | Claude AI 분석 결과 |
| confidence_score | number | 신뢰도 점수 (0-100) |
| verify_count | number | 검증 횟수 |
| status | string | 상태 (active, resolved, archived) |
| resolved_by | string | 해결 보고자 ID |
| resolved_at | datetime | 해결일 |
| admin_status | string | 행정 처리 상태 (pending, processing, completed) |
| admin_note | string | 관리자 메모 |
| created_at | datetime | 작성일 |
| updated_at | datetime | 수정일 |

### 5.3 Verifications (검증)
| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| verification_id | string | 고유 ID (UUID) |
| report_id | string | 리포트 ID |
| user_id | string | 검증자 ID |
| type | string | 검증 타입 (confirm, resolve) |
| media_urls | JSON string | 검증 사진 URL (해결 시) |
| comment | string | 코멘트 |
| created_at | datetime | 검증일 |

### 5.4 Quests (퀘스트)
| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| quest_id | string | 고유 ID |
| type | string | 퀘스트 타입 (daily, weekly, special) |
| title | string | 제목 |
| description | string | 설명 |
| requirement | JSON string | 달성 조건 |
| reward_xp | number | 보상 XP |
| start_date | date | 시작일 (special용) |
| end_date | date | 종료일 (special용) |
| is_active | boolean | 활성화 여부 |

### 5.5 User_Quests (사용자 퀘스트 진행)
| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| user_quest_id | string | 고유 ID |
| user_id | string | 사용자 ID |
| quest_id | string | 퀘스트 ID |
| progress | JSON string | 진행 상황 |
| is_completed | boolean | 완료 여부 |
| completed_at | datetime | 완료일 |
| claimed_reward | boolean | 보상 수령 여부 |

### 5.6 Teams (팀)
| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| team_id | string | 고유 ID (UUID) |
| name | string | 팀명 |
| description | string | 팀 설명 |
| leader_id | string | 리더 ID |
| members | JSON string | 멤버 ID 배열 |
| total_xp | number | 팀 총 XP |
| created_at | datetime | 생성일 |

### 5.7 Notifications (알림)
| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| notification_id | string | 고유 ID |
| user_id | string | 수신자 ID |
| type | string | 알림 타입 (quest, levelup, report_resolved 등) |
| title | string | 제목 |
| message | string | 내용 |
| link | string | 연결 URL |
| is_read | boolean | 읽음 여부 |
| created_at | datetime | 생성일 |

---

## 6. API 명세

### 6.1 인증 API
- `POST /api/auth/signin` - 로그인
- `POST /api/auth/signout` - 로그아웃
- `GET /api/auth/session` - 세션 정보

### 6.2 사용자 API
- `GET /api/users/me` - 내 프로필 조회
- `PATCH /api/users/me` - 프로필 수정
- `GET /api/users/:id` - 사용자 프로필 조회
- `GET /api/users/ranking` - 랭킹 조회
- `GET /api/users/stats` - 내 통계

### 6.3 리포트 API
- `POST /api/reports` - 리포트 생성
  - 요청: multipart/form-data (이미지 + 메타데이터)
  - Claude API로 이미지 분석
  - Vercel Blob에 이미지 업로드
  - Google Sheets에 저장
- `GET /api/reports` - 리포트 목록 조회 (필터링, 페이지네이션)
- `GET /api/reports/:id` - 리포트 상세 조회
- `POST /api/reports/:id/verify` - 리포트 검증 (확인/해결)
- `PATCH /api/reports/:id` - 리포트 수정 (관리자)
- `DELETE /api/reports/:id` - 리포트 삭제 (작성자/관리자)

### 6.4 지도 API
- `GET /api/map/markers` - 지도 마커 데이터 (bbox 기반)
- `GET /api/map/heatmap` - 핫스팟 히트맵 데이터
- `POST /api/map/route` - 맞춤형 경로 탐색
  - Naver Directions API 활용
  - 접근성 프로필 기반 필터링

### 6.5 게임화 API
- `GET /api/quests` - 퀘스트 목록
- `GET /api/quests/my` - 내 퀘스트 진행 현황
- `POST /api/quests/:id/claim` - 퀘스트 보상 수령
- `GET /api/leaderboard` - 리더보드 조회
- `POST /api/xp/add` - XP 추가 (내부 API)

### 6.6 팀 API
- `POST /api/teams` - 팀 생성
- `GET /api/teams` - 팀 목록
- `GET /api/teams/:id` - 팀 상세
- `POST /api/teams/:id/join` - 팀 가입
- `POST /api/teams/:id/leave` - 팀 탈퇴
- `GET /api/teams/:id/members` - 팀 멤버 목록

### 6.7 관리자 API
- `GET /api/admin/dashboard` - 대시보드 통계
- `GET /api/admin/reports` - 민원 목록 (관리자용)
- `PATCH /api/admin/reports/:id/status` - 민원 상태 변경
- `GET /api/admin/analytics` - 분석 데이터
- `GET /api/admin/export` - 데이터 내보내기 (CSV)

### 6.8 AI API
- `POST /api/ai/analyze-image` - 이미지 분석 (Claude API)
  - 입력: 이미지 URL
  - 출력: 카테고리, 설명, 심각도 등
- `POST /api/ai/suggest-priority` - 우선순위 지역 추천

### 6.9 알림 API
- `GET /api/notifications` - 알림 목록
- `PATCH /api/notifications/:id/read` - 알림 읽음 처리
- `POST /api/notifications/subscribe` - 푸시 알림 구독

---

## 7. UI/UX 설계

### 7.1 화면 구성

#### 메인 페이지 (/)
- 히어로 섹션 (프로젝트 소개)
- 빠른 리포트 작성 버튼
- 최근 리포트 피드
- 랭킹 미리보기
- 진행 중인 이벤트

#### 지도 페이지 (/map)
- 전체 화면 Naver Map
- 상단: 검색바, 필터 버튼
- 하단: 퀵 액션 버튼 (리포트 작성, 내 위치)
- 사이드바: 마커 클릭 시 상세 정보

#### 리포트 작성 페이지 (/report/new)
- 카메라 촬영 인터페이스
- 카테고리 선택 (아이콘 그리드)
- 위치 정보 표시 (지도)
- 설명 입력
- 미리보기 & 제출

#### 리포트 상세 페이지 (/report/:id)
- 이미지/영상
- 작성자 정보
- 위치 정보 (지도)
- 카테고리 & 설명
- 신뢰도 점수
- 검증 목록
- "나도 봤어요!" 버튼
- "해결됐어요!" 버튼

#### 퀘스트 페이지 (/quests)
- 탭: 일일 / 주간 / 특별
- 퀘스트 카드 (진행률 표시)
- 보상 수령 버튼

#### 랭킹 페이지 (/ranking)
- 탭: 개인 / 지역 / 팀
- 리더보드 테이블
- 내 순위 강조

#### 마이페이지 (/profile)
- 프로필 정보 (아바타, 레벨)
- 통계 카드
- 활동 내역 목록
- 설정

#### 관리자 대시보드 (/admin)
- 통계 카드 (총 리포트, 미처리 민원 등)
- 지도 기반 민원 현황
- 최근 리포트 목록
- 핫스팟 분석

### 7.2 디자인 시스템
- **컬러 팔레트**
  - Primary: 경기도 청색 (#0066CC)
  - Secondary: 따뜻한 주황 (#FF9500)
  - Danger: 빨강 (#DC3545) - 장벽
  - Success: 녹색 (#28A745) - 해결됨
  - Info: 파랑 (#17A2B8) - 칭찬
- **Typography**: Pretendard (한글), Inter (영문)
- **Accessibility**: WCAG 2.1 AA 준수

### 7.3 반응형 디자인
- Mobile First 접근
- Breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)

### 7.4 Progressive Web App (PWA)
- 오프라인 지원 (Service Worker)
- 홈 화면에 추가 가능
- 푸시 알림

---

## 8. 개발 로드맵

### Phase 1: MVP (4주)
**Week 1-2: 기본 인프라 구축**
- [ ] Next.js 프로젝트 초기화
- [ ] GitHub 저장소 생성 및 Vercel 연동
- [ ] Google Sheets API 연동
- [ ] Naver Maps API 연동
- [ ] NextAuth.js 소셜 로그인 구현
- [ ] 기본 UI 컴포넌트 라이브러리 구축

**Week 3-4: 핵심 기능 개발**
- [ ] 리포트 작성 기능 (장벽/칭찬)
- [ ] 지도 마커 표시
- [ ] 리포트 목록/상세 페이지
- [ ] Claude API 이미지 분석 연동
- [ ] 기본 포인트 시스템
- [ ] 사용자 프로필

### Phase 2: 게임화 & 검증 (3주)
**Week 5-6: 게임화 요소**
- [ ] 레벨 시스템
- [ ] 일일/주간 퀘스트
- [ ] 랭킹 시스템
- [ ] 아바타 커스터마이징
- [ ] 칭호 시스템

**Week 7: 검증 시스템**
- [ ] "나도 봤어요!" 기능
- [ ] "해결됐어요!" 기능
- [ ] 신뢰도 점수 계산
- [ ] 알림 시스템

### Phase 3: 고급 기능 (3주)
**Week 8-9: 맞춤형 기능**
- [ ] 접근성 프로필 설정
- [ ] 맞춤형 지도 필터링
- [ ] 맞춤형 경로 탐색
- [ ] 팀(길드) 기능

**Week 10: 관리자 기능**
- [ ] 관리자 대시보드
- [ ] 민원 관리 시스템
- [ ] 핫스팟 분석
- [ ] 데이터 내보내기

### Phase 4: 최적화 & 배포 (2주)
**Week 11: 최적화**
- [ ] 성능 최적화 (이미지, 번들 크기)
- [ ] SEO 최적화
- [ ] PWA 구현
- [ ] 접근성 테스트 (WCAG 2.1 AA)

**Week 12: 테스트 & 배포**
- [ ] E2E 테스트
- [ ] 사용자 테스트
- [ ] 버그 수정
- [ ] 프로덕션 배포
- [ ] 문서 작성

---

## 9. 배포 전략

### 9.1 GitHub Workflow
```
main (프로덕션)
  ↑
develop (개발)
  ↑
feature/* (기능 개발)
```

### 9.2 Vercel 배포
- **main 브랜치**: 프로덕션 자동 배포
- **develop 브랜치**: 스테이징 자동 배포
- **feature 브랜치**: 프리뷰 배포
- **환경 변수 관리**: Vercel Dashboard

### 9.3 환경 변수
```env
# Database
GOOGLE_SHEETS_PRIVATE_KEY=
GOOGLE_SHEETS_CLIENT_EMAIL=
GOOGLE_SHEETS_SPREADSHEET_ID=

# Authentication
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=

# AI
ANTHROPIC_API_KEY=

# Maps
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=
NAVER_MAP_CLIENT_SECRET=

# Storage
BLOB_READ_WRITE_TOKEN=

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=
```

---

## 10. 성능 및 보안

### 10.1 성능 최적화
- **이미지 최적화**
  - Next.js Image Component 사용
  - WebP 포맷 변환
  - Lazy Loading
- **코드 스플리팅**
  - Dynamic Import
  - Route-based Code Splitting
- **캐싱 전략**
  - Static Generation (SSG) for 정적 페이지
  - Incremental Static Regeneration (ISR) for 동적 데이터
  - Client-side Caching (React Query)
- **번들 크기 최적화**
  - Tree Shaking
  - 불필요한 의존성 제거
  - Barrel Export 주의

### 10.2 보안
- **인증 & 권한**
  - NextAuth.js 기반 OAuth 2.0
  - JWT 토큰 사용
  - RBAC (Role-Based Access Control)
- **데이터 보호**
  - HTTPS 강제
  - CORS 정책
  - Rate Limiting (Vercel Edge Config)
  - Input Validation & Sanitization
- **API 보안**
  - API Key 환경 변수 관리
  - Server-side API 호출 (API Routes)
  - CSRF 방지

### 10.3 접근성 (Accessibility)
- **WCAG 2.1 AA 준수**
  - 시맨틱 HTML
  - ARIA 레이블
  - 키보드 네비게이션 지원
  - 색상 대비 4.5:1 이상
- **스크린 리더 호환**
- **다국어 지원** (향후 확장)

---

## 11. 예산 및 리소스

### 11.1 인력
- **Frontend Developer**: 1명 (Full-time, 12주)
- **Backend Developer**: 1명 (Part-time, 8주)
- **UI/UX Designer**: 1명 (Part-time, 4주)
- **QA Tester**: 1명 (Part-time, 2주)

### 11.2 비용 (월간 추정)
| 항목 | 비용 (월) | 비고 |
|------|----------|------|
| Vercel Pro | $20 | 무료 플랜으로 시작 가능 |
| Vercel Blob Storage | ~$5 | 사용량 기반 |
| Claude API | ~$50-200 | 사용량 기반 (Sonnet 4.0) |
| Naver Maps API | 무료 | 일 10만건 이하 무료 |
| Google Sheets API | 무료 | 할당량 내 무료 |
| Domain | ~$15/년 | .kr 도메인 |
| **총계** | **~$75-225** | 초기 단계 |

### 11.3 확장 시 고려사항
- **사용자 1만명 이상 시**
  - Google Sheets → PostgreSQL (Vercel Postgres) 또는 Supabase 이관 검토
  - CDN 강화
  - Rate Limiting 강화
- **이미지 트래픽 증가 시**
  - Vercel Blob → Cloudflare R2 이관 검토

---

## 12. 추가 API 제안

### 12.1 필수 API
1. **Naver Maps API v3** ✅
   - 지도 표시, 마커, 경로 탐색

2. **Naver Geocoding API** ✅
   - 좌표 → 주소 변환 (리포트 자동 주소 기록)

3. **Claude Sonnet 4.0 API** ✅
   - 이미지 분석 및 자동 카테고리 분류

4. **Google Sheets API v4** ✅
   - 데이터베이스

### 12.2 권장 API
1. **Web Push API** (브라우저 내장)
   - 푸시 알림 (PWA)

2. **Kakao Share API**
   - 카카오톡 공유하기 (바이럴 마케팅)

3. **OpenGraph Protocol**
   - 소셜 미디어 공유 최적화

### 12.3 선택 API (Phase 2 이후)
1. **SendGrid / Resend**
   - 이메일 알림 (주간 리포트, 퀘스트 완료 등)

2. **Twilio**
   - SMS 알림 (긴급 장벽 해결 알림)

3. **Google Places API**
   - 시설 정보 자동 입력 (식당, 관공서 등)

4. **공공데이터포털 API**
   - 경기도 장애인 편의시설 정보 연동
   - 지하철역 엘리베이터 정보 등

5. **기상청 API**
   - 날씨 기반 알림 (비 오는 날 점자블록 위험 알림 등)

---

## 13. 성공 지표 (KPI)

### 13.1 사용자 지표
- **DAU (Daily Active Users)**: 1,000명 (3개월 후)
- **MAU (Monthly Active Users)**: 10,000명 (1년 후)
- **평균 세션 시간**: 5분 이상
- **리포트 작성률**: 가입자의 30% 이상
- **재방문율**: 주간 30% 이상

### 13.2 데이터 지표
- **총 리포트 수**: 10,000개 (1년 후)
- **경기도 주요 시설 커버리지**: 70% (1년 후)
- **리포트 신뢰도 평균**: 80점 이상
- **해결률**: 리포트의 40% 이상 해결

### 13.3 행정 지표
- **민원 처리 시간 단축**: 기존 대비 30%
- **지자체 데이터 활용률**: 31개 시군 중 20개 이상 활용

### 13.4 게임화 지표
- **일일 퀘스트 완료율**: 40% 이상
- **월간 랭킹 참여율**: 20% 이상
- **팀 가입률**: 사용자의 50% 이상

---

## 14. 리스크 관리

### 14.1 기술적 리스크
| 리스크 | 확률 | 영향 | 대응 방안 |
|--------|------|------|-----------|
| Google Sheets 성능 저하 | 중 | 고 | PostgreSQL 이관 준비 |
| Claude API 비용 초과 | 중 | 중 | 캐싱 전략, 사용량 모니터링 |
| Naver Maps API 할당량 초과 | 저 | 중 | 유료 플랜 전환 |
| 대용량 이미지 트래픽 | 중 | 중 | 이미지 압축, CDN 최적화 |

### 14.2 사용자 리스크
| 리스크 | 확률 | 영향 | 대응 방안 |
|--------|------|------|-----------|
| 허위 리포트 | 중 | 고 | 신뢰도 시스템, AI 검증 강화 |
| 사용자 참여 부족 | 중 | 고 | 게임화 강화, 인센티브 확대 |
| 민원 폭주 | 저 | 중 | 관리자 알림 시스템, 우선순위 자동 분류 |

### 14.3 법적 리스크
| 리스크 | 확률 | 영향 | 대응 방안 |
|--------|------|------|-----------|
| 개인정보 유출 | 저 | 고 | 보안 강화, GDPR 준수 |
| 명예훼손 (시설 칭찬/비판) | 중 | 중 | 이용약관 명시, 신고 시스템 |

---

## 15. 공모전 전략

### 15.1 차별화 포인트
1. **게임화를 통한 지속 가능한 시민 참여**
   - 기존 민원 앱과 차별화
   - 재미 + 사회 공헌

2. **실시간 데이터 기반 행정 효율화**
   - 시민이 데이터 수집, 행정이 즉각 대응
   - 예산 편성 근거 자료 제공

3. **AI 활용 자동화**
   - Claude API로 이미지 분석 자동화
   - 우선순위 지역 자동 추천

4. **접근성 프로필 기반 개인화**
   - 장애 유형별 맞춤형 정보 제공

### 15.2 제출 자료
- [x] PRD (본 문서)
- [ ] UI/UX 목업 (Figma)
- [ ] 시스템 아키텍처 다이어그램
- [ ] 데모 영상 (3분)
- [ ] MVP 프로토타입 (가능 시)
- [ ] 예상 효과 보고서

### 15.3 향후 확장 계획
- **단기 (1년)**: 경기도 전역 확산
- **중기 (2-3년)**: 전국 확대
- **장기 (5년)**: 국제 모델 수출 (UN SDGs 연계)

---

## 16. 참고 자료

### 16.1 기술 문서
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Naver Maps API](https://navermaps.github.io/maps.js.ncp/)
- [Google Sheets API](https://developers.google.com/sheets/api)

### 16.2 디자인 참고
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

### 16.3 유사 프로젝트
- **FixMyStreet** (영국)
- **SeeClickFix** (미국)
- **서울시 응답소** (한국)

---

## 17. 문의 및 피드백

- **프로젝트 담당자**: heisenbug0306@gmail.com
- **GitHub Repository**: (TBD)
- **Vercel Preview**: (TBD)

---

**문서 버전**: v1.0
**최종 수정일**: 2025-10-23
**작성자**: Claude Code
