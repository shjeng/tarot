# 회원 인증 구현 가이드 (Supabase + Google + Kakao + Naver)

## 개요

```
사용자
  ↓ 소셜 로그인 클릭
Next.js (Frontend)
  ↓ Supabase Auth SDK
Supabase Auth ←→ Google / Kakao
  ↓ JWT 토큰 발급
Express (Backend)  ←→  Supabase DB (profiles 테이블)
```

- **Google, Kakao**: Supabase Auth 공식 지원 → SDK로 바로 처리
- **Naver**: Supabase 미지원 → 직접 OAuth 구현 후 Supabase에 수동 연동

---

## 1단계: Supabase 설정

### 1-1. profiles 테이블 생성

Supabase 대시보드 → **SQL Editor**에서 아래 SQL 실행:

```sql
CREATE TABLE public.profiles (
  id          uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nickname    text,
  birth_date  date,
  birth_time  time,
  provider    text,  -- 'google' | 'kakao' | 'naver'
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- 회원 가입 시 자동으로 profiles 행 생성하는 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, provider)
  VALUES (
    NEW.id,
    NEW.raw_app_meta_data->>'provider'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 1-2. RLS (Row Level Security) 설정

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 본인 데이터만 조회 가능
CREATE POLICY "본인만 조회" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- 본인 데이터만 수정 가능
CREATE POLICY "본인만 수정" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
```

---

## 2단계: 소셜 로그인 설정

### 2-1. Google

1. [Google Cloud Console](https://console.cloud.google.com) → **새 프로젝트 생성**
2. **API 및 서비스 → 사용자 인증 정보 → OAuth 2.0 클라이언트 ID** 생성
3. 승인된 리디렉션 URI 추가:
   ```
   https://<your-project>.supabase.co/auth/v1/callback
   ```
4. 발급된 **Client ID**, **Client Secret**을 Supabase 대시보드에 입력:
   - **Authentication → Providers → Google** → 활성화 후 값 입력

### 2-2. Kakao

1. [Kakao Developers](https://developers.kakao.com) → **내 애플리케이션 → 애플리케이션 추가**
2. **플랫폼 → Web** → 사이트 도메인 등록:
   ```
   https://<your-project>.supabase.co
   ```
3. **카카오 로그인 → Redirect URI** 등록:
   ```
   https://<your-project>.supabase.co/auth/v1/callback
   ```
4. **카카오 로그인 → 동의항목** → 이메일(필수) 활성화
5. **앱 키 → REST API 키**를 Client ID로 사용
6. **보안 → Client Secret** 생성
7. Supabase 대시보드 → **Authentication → Providers → Kakao** → 활성화 후 값 입력

### 2-3. Naver (직접 OAuth 구현 필요)

Supabase가 공식 지원하지 않으므로 백엔드에서 직접 처리합니다.

1. [Naver Developers](https://developers.naver.com) → **Application 등록**
2. 사용 API: **네이버 로그인** 선택
3. 서비스 URL, Callback URL 등록:
   ```
   서비스 URL:   https://your-domain.com
   Callback URL: https://your-domain.com/api/auth/naver/callback
   ```
4. 발급된 **Client ID**, **Client Secret** 메모

**Naver 로그인 흐름:**
```
1. 프론트 → GET /api/auth/naver/login   → 네이버 로그인 페이지로 리디렉션
2. 네이버  → GET /api/auth/naver/callback?code=xxx  (백엔드로 콜백)
3. 백엔드  → 네이버 API로 액세스 토큰 교환
4. 백엔드  → 네이버 API로 사용자 정보 조회
5. 백엔드  → supabase.auth.admin.createUser() 또는 signInWithPassword()로 Supabase 유저 생성/로그인
6. 백엔드  → 프론트로 Supabase JWT 전달
```

---

## 3단계: 패키지 설치

### Frontend

```bash
cd frontend
npm install @supabase/supabase-js @supabase/ssr
```

### Backend

```bash
cd backend
npm install @supabase/supabase-js
```

---

## 4단계: 환경 변수 설정

### frontend/.env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### backend/.env

```env
GEMINI_API_KEY=...

SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # 관리자용 (Naver 유저 생성 시 필요)

NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
FRONTEND_URL=http://localhost:3000
```

> `SUPABASE_SERVICE_ROLE_KEY`는 Supabase 대시보드 → Settings → API → service_role 키

---

## 5단계: 주요 코드 구조

### Frontend - Supabase 클라이언트 (`frontend/lib/supabase.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Frontend - Google/Kakao 로그인

```typescript
// Google 로그인
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${window.location.origin}/auth/callback` }
})

// Kakao 로그인
await supabase.auth.signInWithOAuth({
  provider: 'kakao',
  options: { redirectTo: `${window.location.origin}/auth/callback` }
})
```

### Frontend - Auth Callback 페이지 (`frontend/app/auth/callback/route.ts`)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { /* cookie handlers */ } }
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}/`)
}
```

### Frontend - 보호된 라우트 미들웨어 (`frontend/middleware.ts`)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/reading/:path*', '/daily/:path*']  // 로그인 필요 페이지
}
```

### Backend - Supabase 클라이언트 (`backend/src/lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js'

// 일반 요청용
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

// 관리자용 (Naver 유저 생성 등)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### Backend - JWT 검증 미들웨어 (`backend/src/middleware/auth.middleware.ts`)

```typescript
import { Request, Response, NextFunction } from 'express'
import { supabase } from '../lib/supabase'

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: '로그인이 필요합니다.' })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return res.status(401).json({ error: '유효하지 않은 토큰입니다.' })

  req.user = user  // 이후 컨트롤러에서 req.user로 접근
  next()
}
```

### Backend - Naver OAuth 라우트 (`backend/src/routes/auth.routes.ts`)

```typescript
// GET /api/auth/naver/login  → 네이버 로그인 페이지로 리디렉션
// GET /api/auth/naver/callback → 네이버 콜백 처리 후 Supabase 유저 생성/로그인
```

---

## 6단계: 닉네임/생년월일 입력 흐름

소셜 로그인은 이메일만 제공하므로, 최초 로그인 후 **프로필 완성 페이지**가 필요합니다.

```
소셜 로그인 완료
      ↓
profiles.nickname이 없으면 → /onboarding 페이지로 이동
      ↓
닉네임 + 생년월일 입력
      ↓
profiles 테이블 UPDATE
      ↓
서비스 이용 가능
```

---

## 구현 순서 추천

1. [ ] Supabase SQL 실행 (profiles 테이블 + 트리거)
2. [ ] Google 로그인 설정 → 프론트 로그인 페이지 구현
3. [ ] Kakao 로그인 설정 → 동일 로그인 페이지에 추가
4. [ ] 프로필 완성 페이지 (닉네임 + 생년월일) 구현
5. [ ] 미들웨어로 `/reading`, `/daily` 보호
6. [ ] 백엔드 JWT 검증 미들웨어 → 타로 API에 적용
7. [ ] Naver 로그인 (별도 OAuth 구현)
