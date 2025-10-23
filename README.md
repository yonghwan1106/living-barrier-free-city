# 배리어프리 경기 (Living Barrier-Free City)

시민 참여형 접근성 데이터 생태계 플랫폼

## 프로젝트 소개

**배리어프리 경기**는 시민의 집단지성으로 경기도 전역의 물리적, 제도적 장벽을 실시간으로 파악하고 개선하여, 누구나 차별 없이 이동하고 생활할 수 있는 '살아있는 무장애 도시(Living Barrier-Free City)'를 구현하는 플랫폼입니다.

**2025 경기도 장애인 인권정책 공모전** 출품작

## 핵심 기능

- 🗺️ **실시간 장벽 리포트**: GPS와 카메라로 주변의 장벽을 10초 안에 신고
- ✅ **검증 시스템**: 다른 사용자의 리포트를 확인하고 신뢰도 향상
- 🎮 **게임화**: 퀘스트, 레벨, 포인트 시스템으로 지속적인 참여 유도
- 🤖 **AI 분석**: Claude API를 활용한 자동 이미지 분석 및 카테고리 분류
- 🎯 **맞춤형 지도**: 사용자의 이동 방식에 맞는 경로 및 정보 제공
- 👥 **팀 활동**: 팀을 만들어 함께 퀘스트를 수행하고 경쟁

## 기술 스택

### Frontend
- **Framework**: Next.js 15.x (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **State Management**: Zustand, React Query
- **Maps**: Naver Maps API v3

### Backend & API
- **Runtime**: Next.js API Routes (Serverless)
- **Authentication**: NextAuth.js v5 (Google, Kakao, Naver OAuth)
- **AI**: Anthropic Claude Sonnet 4.0 API
- **Database**: Google Sheets API v4
- **File Storage**: Vercel Blob

### Deployment
- **Hosting**: Vercel
- **Repository**: GitHub
- **CI/CD**: Vercel Auto Deploy

## 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install --legacy-peer-deps
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요 (.env.example 참고):

```env
# Database - Google Sheets API
GOOGLE_SHEETS_PRIVATE_KEY=
GOOGLE_SHEETS_CLIENT_EMAIL=
GOOGLE_SHEETS_SPREADSHEET_ID=

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# OAuth Providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=

# AI & Maps
ANTHROPIC_API_KEY=
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=
NAVER_MAP_CLIENT_SECRET=
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## Phase 1 MVP 개발 완료

### 기본 인프라 ✅
- ✅ Next.js 15 프로젝트 초기화 (App Router, TypeScript, Tailwind CSS)
- ✅ shadcn/ui 설정 및 기본 컴포넌트 (Button, Card, Input, Label)
- ✅ 환경 변수 설정 (.env.example, .env.local)
- ✅ Google Sheets API 연동 및 데이터 모델
- ✅ NextAuth.js v5 소셜 로그인 (Google, Kakao, Naver)
- ✅ TypeScript 완전한 타입 정의
- ✅ React Query & SessionProvider 설정

### UI/UX ✅
- ✅ 메인 랜딩 페이지 (히어로, 통계, 기능 소개, CTA)
- ✅ 지도 페이지 (/map) - Naver Maps API 연동
  - 실시간 위치 표시
  - 검색 기능
  - 필터 패널
  - 퀵 액션 버튼
- ✅ 리포트 작성 페이지 (/reports/new)
  - 단계별 폼 (유형 → 카테고리 → 사진 → 세부정보)
  - 이미지 업로드 (Vercel Blob)
  - GPS 위치 자동 수집
  - 카테고리 아이콘 선택

### API Routes ✅
- ✅ `/api/auth/[...nextauth]` - NextAuth.js 인증
- ✅ `/api/upload` - 이미지 업로드 (Vercel Blob)
- ✅ `/api/reports` - 리포트 CRUD (GET, POST)
- ✅ `/api/analyze-image` - Claude AI 이미지 분석

### AI & 데이터 분석 ✅
- ✅ Claude Sonnet 4.0 이미지 분석
  - 자동 카테고리 분류
  - 심각도 평가 (low/medium/high)
  - 설명 생성
  - 태그 추출
- ✅ 실시간 지도 마커 표시
  - 타입별 색상 구분 (빨강: 장벽, 파랑: 칭찬, 녹색: 해결됨)
  - 필터링 (타입, 상태별)
  - 마커 클릭 시 상세 정보 패널
- ✅ 리포트 데이터 Google Sheets 저장

## Phase 1-2 개발 완료 ✅

### 인증 & 사용자 관리 ✅
- ✅ Google/Kakao/Naver 소셜 로그인
- ✅ 커스텀 로그인 페이지 (/auth/signin)
- ✅ 사용자 프로필 페이지 (/profile)
  - 레벨 & XP 진행 바
  - 활동 통계 (리포트, 검증, 해결)
  - 최근 활동 내역
  - 업적 시스템 (4가지 배지)

### 게임화 시스템 ✅
- ✅ XP & 레벨 시스템
  - 리포트 작성: +10 XP (장벽), +15 XP (칭찬)
  - 검증/해결: +5 XP
  - 퀘스트 완료: 퀘스트별 XP 보상
- ✅ 리포트 검증 시스템
  - "나도 봤어요!" 버튼 (검증 수 증가)
  - "해결됐어요!" 버튼 (상태 변경)
  - 중복 검증 방지
- ✅ 퀘스트 시스템 (/quests)
  - 일일 퀘스트 (3개)
  - 주간 퀘스트 (3개)
  - 특별 퀘스트 (2개)
  - 진행도 자동 추적
  - 보상 청구 기능
- ✅ 팀/길드 기능 (/teams)
  - 팀 생성 & 가입
  - 팀 검색
  - 팀 통계 (멤버 수, 레벨, XP)

### 다음 단계 (Phase 2)
- [ ] 랭킹/리더보드 시스템
- [ ] 알림 시스템
- [ ] 관리자 대시보드
- [ ] PWA (Progressive Web App) 지원
- [ ] Vercel 프로덕션 배포

## 프로젝트 구조

```
living-barrier-free-city/
├── docs/
│   ├── PRD.md                      # 상세 기획 문서
│   ├── SETUP_GUIDE.md              # 환경 설정 가이드
│   └── proposal.txt                # 원본 제안서
├── src/
│   ├── app/
│   │   ├── page.tsx               # 메인 랜딩 페이지
│   │   ├── auth/
│   │   │   └── signin/            # 로그인 페이지
│   │   ├── map/
│   │   │   └── page.tsx           # 지도 페이지 (실시간 마커, 검증)
│   │   ├── profile/
│   │   │   └── page.tsx           # 사용자 프로필 페이지
│   │   ├── quests/
│   │   │   └── page.tsx           # 퀘스트 페이지
│   │   ├── teams/
│   │   │   └── page.tsx           # 팀/길드 페이지
│   │   ├── reports/
│   │   │   └── new/
│   │   │       └── page.tsx       # 리포트 작성 페이지
│   │   ├── api/
│   │   │   ├── auth/              # NextAuth.js 인증
│   │   │   ├── upload/            # 이미지 업로드
│   │   │   ├── reports/           # 리포트 CRUD
│   │   │   ├── verifications/     # 검증 시스템
│   │   │   ├── quests/            # 퀘스트 관리
│   │   │   ├── teams/             # 팀 관리
│   │   │   ├── analyze-image/     # AI 이미지 분석
│   │   │   └── init-sheets/       # Google Sheets 초기화
│   │   ├── layout.tsx
│   │   └── providers.tsx          # React Query, SessionProvider
│   ├── components/
│   │   ├── ui/                    # shadcn/ui
│   │   └── map/
│   │       ├── NaverMap.tsx       # 네이버 지도 컴포넌트
│   │       └── ReportMarkers.tsx  # 리포트 마커
│   ├── hooks/
│   │   └── useNaverMaps.ts        # Naver Maps Hook
│   ├── lib/
│   │   ├── google-sheets/
│   │   │   ├── client.ts          # Google Sheets 클라이언트
│   │   │   └── operations.ts      # CRUD 작업
│   │   ├── auth/
│   │   │   └── auth.ts            # NextAuth 설정
│   │   ├── claude/
│   │   │   ├── client.ts          # Claude API 클라이언트
│   │   │   └── analyze.ts         # 이미지 분석
│   │   ├── quests/
│   │   │   └── progress.ts        # 퀘스트 진행도 추적
│   │   └── utils.ts
│   └── types/
│       ├── index.ts               # 모든 타입 정의
│       └── next-auth.d.ts         # NextAuth 타입 확장
├── .env.local                     # 환경 변수
├── .env.example                   # 환경 변수 예제
└── README.md
```

## 문의

프로젝트 관련 문의: heisenbug0306@gmail.com

---

**배리어프리 경기** - 시민이 만드는 살아있는 무장애 도시
