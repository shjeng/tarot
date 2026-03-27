# 로그인/회원가입 화면 설계

**날짜:** 2026-03-27
**범위:** 프론트엔드 인증 UI (로그인 모달, 회원가입 탭, 온보딩 페이지)

---

## 1. 요구사항

- 구글 OAuth 로그인
- 카카오 OAuth 로그인
- 이메일 + 비밀번호 개인 회원가입 / 로그인
- `/daily`, `/reading` 접근 시 미로그인이면 `/login`으로 리디렉션 (로그인 필수)
- 가입 후 닉네임 + 생년월일 + 생시 입력하는 온보딩 페이지
- profiles 테이블 구조 유지 (email은 `auth.users`에서 가져옴, 별도 컬럼 추가 없음)

---

## 2. 화면 구성

### 2-1. `/login` 페이지

- 배경: 기존 앱 테마 (다크 + 신비로운 장식 요소)
- 중앙에 모달이 항상 열린 상태로 렌더링
- 모달 내부 탭 전환: **로그인** / **회원가입**

#### 로그인 탭
1. 구글로 계속하기 (버튼)
2. 카카오로 계속하기 (버튼)
3. 구분선 ("또는 이메일로")
4. 이메일 입력
5. 비밀번호 입력
6. 로그인 버튼

#### 회원가입 탭
1. 구글로 시작하기 (버튼)
2. 카카오로 시작하기 (버튼)
3. 구분선 ("또는 이메일로")
4. 이메일 입력
5. 비밀번호 입력 (8자 이상)
6. 비밀번호 확인 입력
7. 회원가입 버튼

### 2-2. `/auth/callback` (API Route)

- 소셜 OAuth 콜백 처리
- `supabase.auth.exchangeCodeForSession(code)` 호출
- `profiles.nickname` 없으면 → `/onboarding` 리디렉션
- 있으면 → `/` 리디렉션

### 2-3. `/onboarding` 페이지

- 최초 로그인(소셜/이메일 모두) 후에만 진입
- 입력 항목:
  - 닉네임 (필수) — `profiles.nickname`
  - 생년월일 (필수) — `profiles.birth_date`
  - 태어난 시간 (선택) — `profiles.birth_time`
- 완료 시 profiles UPDATE 후 `/` 이동

---

## 3. 기술 구조

### 인증 흐름

```
미로그인 사용자 → /daily or /reading 접근
  → middleware.ts 감지
  → /login 리디렉션

/login 페이지
  → 소셜 로그인: supabase.auth.signInWithOAuth({ provider: 'google' | 'kakao' })
  → 이메일 로그인: supabase.auth.signInWithPassword({ email, password })
  → 이메일 가입: supabase.auth.signUp({ email, password })

소셜 로그인 콜백
  → /auth/callback (Route Handler)
  → profiles.nickname 확인
  → 온보딩 or 메인으로 이동

이메일 가입 완료
  → /onboarding 이동 (클라이언트에서 직접)
```

### 파일 구조

```
frontend/
  app/
    login/
      page.tsx          # /login 페이지 (모달 항상 열림)
    auth/
      callback/
        route.ts        # OAuth 콜백 처리
    onboarding/
      page.tsx          # 프로필 최초 설정
  components/
    auth/
      AuthModal.tsx     # 로그인/회원가입 탭 모달
      LoginTab.tsx      # 로그인 탭 내용
      SignupTab.tsx     # 회원가입 탭 내용
  lib/
    supabase.ts         # Supabase 브라우저 클라이언트
  middleware.ts         # /daily, /reading 보호
```

### middleware.ts 보호 대상

```
matcher: ['/daily/:path*', '/reading/:path*']
```

---

## 4. 데이터 모델

### profiles 테이블 (기존 유지)

```sql
CREATE TABLE public.profiles (
  id          uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nickname    text,
  birth_date  date,
  birth_time  time,
  provider    text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);
```

- `email`은 `auth.users`에서 `supabase.auth.getUser()`로 가져옴
- 기존 트리거(`on_auth_user_created`)가 자동으로 profiles 행 생성
- `profiles.nickname`이 null이면 온보딩 미완료 상태

---

## 5. UI 스타일 가이드

- 기존 앱 테마 그대로: `--primary: #7a9cc0`, `--secondary: #e8d5a3`, `--background: #0f1640`
- 모달: `bg-background/80 backdrop-blur` + border
- 소셜 버튼: 구글(흰 배경), 카카오(#fee500 배경)
- 애니메이션: framer-motion (기존 패턴 유지)
- 폰트: Nanum Gothic (본문), Noto Serif KR (타이틀)
