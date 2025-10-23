# 환경 변수 설정 가이드 🔧

## 현재 설정 상태

### ✅ 설정 완료
- `ANTHROPIC_API_KEY` - Claude AI 이미지 분석
- `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` - 네이버 지도 표시
- `NAVER_MAP_CLIENT_SECRET` - 네이버 지도 API
- `NEXTAUTH_URL` - 인증 URL (localhost)
- `NEXTAUTH_SECRET` - 인증 비밀키 (임시)

### ⚠️ 설정 필요 (필수)

데이터 저장을 위해 **반드시** 설정해야 합니다:
- `GOOGLE_SHEETS_PRIVATE_KEY`
- `GOOGLE_SHEETS_CLIENT_EMAIL`
- `GOOGLE_SHEETS_SPREADSHEET_ID`

### 📝 설정 필요 (선택)

소셜 로그인을 사용하려면 설정하세요:
- Google, Kakao, Naver OAuth
- Vercel Blob (이미지 저장)
- Google Analytics (분석)

---

## 📋 상세 설정 방법

### 1. Google Sheets API (필수) ⭐

리포트 데이터를 Google Sheets에 저장하기 위해 필요합니다.

#### Step 1: Google Cloud Console 설정

1. **Google Cloud Console 접속**
   ```
   https://console.cloud.google.com/
   ```

2. **새 프로젝트 생성**
   - 프로젝트 이름: `barrier-free-gyeonggi` (자유롭게)
   - 프로젝트 선택

3. **API 활성화**
   - 좌측 메뉴: **API 및 서비스** → **라이브러리**
   - 검색: `Google Sheets API`
   - **사용 설정** 클릭

4. **서비스 계정 생성**
   - **API 및 서비스** → **사용자 인증 정보**
   - **사용자 인증 정보 만들기** → **서비스 계정**
   - 서비스 계정 이름: `sheets-service` (자유롭게)
   - 역할: **편집자** (선택사항)
   - **완료** 클릭

5. **JSON 키 다운로드**
   - 생성된 서비스 계정 클릭
   - **키** 탭
   - **키 추가** → **새 키 만들기**
   - 유형: **JSON**
   - **만들기** 클릭 → JSON 파일 다운로드

#### Step 2: JSON 키에서 정보 추출

다운로드한 JSON 파일을 열어서:

```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "sheets-service@...iam.gserviceaccount.com",
  ...
}
```

#### Step 3: .env.local에 값 입력

```env
# 1. private_key 값을 복사 (따옴표 포함, 개행문자 그대로)
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"

# 2. client_email 값을 복사
GOOGLE_SHEETS_CLIENT_EMAIL=sheets-service@barrier-free-gyeonggi.iam.gserviceaccount.com

# 3. Spreadsheet ID는 아래에서 생성
GOOGLE_SHEETS_SPREADSHEET_ID=
```

⚠️ **주의**: `private_key`는 반드시 큰따옴표로 감싸야 합니다!

#### Step 4: Google Sheets 스프레드시트 생성

1. **Google Sheets 접속**
   ```
   https://sheets.google.com/
   ```

2. **새 스프레드시트 만들기**
   - 이름: `배리어프리경기_데이터` (자유롭게)

3. **서비스 계정과 공유**
   - 우측 상단 **공유** 버튼
   - 위에서 복사한 `client_email` 입력
   - 권한: **편집자**
   - **보내기** 클릭

4. **Spreadsheet ID 복사**
   - URL에서 ID 확인:
   ```
   https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
   ```
   - 예: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

5. **.env.local에 입력**
   ```env
   GOOGLE_SHEETS_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
   ```

#### Step 5: 테스트

개발 서버 재시작 후 리포트 작성 시 자동으로 시트가 생성됩니다!

---

### 2. NextAuth Secret 생성 (권장) 🔐

보안을 위해 임시 secret을 변경하세요.

#### 방법 1: OpenSSL 사용 (Windows Git Bash)
```bash
openssl rand -base64 32
```

#### 방법 2: Node.js 사용
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### 방법 3: 온라인 생성기
```
https://generate-secret.vercel.app/32
```

생성된 값을 복사:
```env
NEXTAUTH_SECRET=xJw8kR3...생성된_값
```

---

### 3. Google OAuth (선택) 🔓

소셜 로그인을 사용하려면 설정하세요.

#### Step 1: Google Cloud Console
1. 위의 Google Sheets 프로젝트 선택
2. **API 및 서비스** → **사용자 인증 정보**
3. **사용자 인증 정보 만들기** → **OAuth 2.0 클라이언트 ID**
4. 애플리케이션 유형: **웹 애플리케이션**
5. 이름: `배리어프리경기_웹`
6. **승인된 리디렉션 URI** 추가:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. **만들기** 클릭

#### Step 2: .env.local에 입력
```env
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123...
```

---

### 4. Kakao OAuth (선택) 🟡

#### Step 1: Kakao Developers
1. **Kakao Developers 접속**
   ```
   https://developers.kakao.com/
   ```
2. **내 애플리케이션** → **애플리케이션 추가하기**
3. 앱 이름: `배리어프리경기`
4. 사업자명: (개인 또는 단체명)

#### Step 2: 플랫폼 설정
1. **앱 설정** → **플랫폼**
2. **Web 플랫폼 등록**
3. 사이트 도메인: `http://localhost:3000`

#### Step 3: Redirect URI 설정
1. **제품 설정** → **카카오 로그인**
2. **활성화 설정** ON
3. **Redirect URI 등록**:
   ```
   http://localhost:3000/api/auth/callback/kakao
   ```

#### Step 4: .env.local에 입력
1. **앱 키** → **REST API 키** 복사
2. **제품 설정** → **카카오 로그인** → **보안** → **Client Secret** 생성 및 복사

```env
KAKAO_CLIENT_ID=abc123...  (REST API 키)
KAKAO_CLIENT_SECRET=def456...
```

---

### 5. Naver OAuth (선택) 🟢

#### Step 1: Naver Developers
1. **Naver Developers 접속**
   ```
   https://developers.naver.com/
   ```
2. **Application** → **애플리케이션 등록**
3. 애플리케이션 이름: `배리어프리경기`
4. 사용 API: **네이버 로그인**

#### Step 2: 서비스 환경 등록
1. **서비스 URL**: `http://localhost:3000`
2. **Callback URL**:
   ```
   http://localhost:3000/api/auth/callback/naver
   ```

#### Step 3: .env.local에 입력
```env
NAVER_CLIENT_ID=abc123...
NAVER_CLIENT_SECRET=def456...
```

---

### 6. Vercel Blob (선택) 💾

프로덕션 환경에서 이미지 저장에 사용합니다. (개발 중에는 선택사항)

#### Step 1: Vercel 프로젝트 생성
1. **Vercel 접속**
   ```
   https://vercel.com/
   ```
2. GitHub 연동 후 프로젝트 배포

#### Step 2: Blob Storage 생성
1. 프로젝트 → **Storage** 탭
2. **Create Database** → **Blob**
3. 이름: `barrier-free-images`
4. **Create**

#### Step 3: 토큰 복사
1. **Settings** → **Environment Variables**
2. `BLOB_READ_WRITE_TOKEN` 값 복사

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_abc123...
```

---

### 7. Google Analytics (선택) 📊

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Google Analytics 4에서 측정 ID를 가져옵니다.

---

## 🚀 설정 확인 방법

### 1. 개발 서버 재시작
```bash
# Ctrl+C로 종료 후
npm run dev
```

### 2. 기능 테스트

#### Google Sheets (필수)
1. `/reports/new` 접속
2. 리포트 작성 및 제출
3. Google Sheets 확인 → 자동으로 시트가 생성되고 데이터 입력됨

#### Naver Maps (설정됨)
1. `/map` 접속
2. 지도가 정상 표시되는지 확인

#### Claude AI (설정됨)
1. 리포트 작성 시 사진 업로드
2. 콘솔에서 AI 분석 결과 확인

#### OAuth (선택)
1. `/auth/signin` 접속
2. 소셜 로그인 버튼 클릭
3. 로그인 성공 확인

---

## ⚠️ 주의사항

### 보안
- `.env.local` 파일은 **절대 Git에 커밋하지 마세요**
- 이미 `.gitignore`에 포함되어 있습니다
- API 키는 외부에 노출되지 않도록 주의

### 프로덕션 배포 시
1. Vercel Dashboard에서 환경 변수 설정
2. `NEXTAUTH_URL`을 프로덕션 도메인으로 변경
3. OAuth Redirect URI를 프로덕션 도메인으로 추가

---

## 📞 문제 해결

### Google Sheets 오류
```
Error: Google Sheets credentials are not configured
```
→ `GOOGLE_SHEETS_PRIVATE_KEY` 설정 확인 (큰따옴표 포함)

### Naver Maps 오류
```
Failed to load Naver Maps API
```
→ `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` 설정 확인

### NextAuth 오류
```
[next-auth][error][NO_SECRET]
```
→ `NEXTAUTH_SECRET` 설정 확인

---

## ✅ 최소 설정 체크리스트

기본 기능 사용을 위한 **필수** 설정:

- [ ] `GOOGLE_SHEETS_PRIVATE_KEY`
- [ ] `GOOGLE_SHEETS_CLIENT_EMAIL`
- [ ] `GOOGLE_SHEETS_SPREADSHEET_ID`
- [ ] `NEXTAUTH_SECRET` (새로 생성)
- [x] `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` (설정됨)
- [x] `ANTHROPIC_API_KEY` (설정됨)

로그인 기능 추가 (선택):
- [ ] Google OAuth
- [ ] Kakao OAuth
- [ ] Naver OAuth

이미지 저장 (선택):
- [ ] Vercel Blob Token

---

**설정 완료 후 서버를 재시작하세요!** 🎉
