# Supabase 회원 인증 구현 플랜

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 이메일/비밀번호 + Google + Kakao 소셜 로그인을 Supabase Auth 기반으로 구현하고, 백엔드 타로 API에 JWT 인증을 적용한다.

**Architecture:** 프론트엔드는 `@supabase/ssr`로 세션을 쿠키에 저장하고 Next.js 미들웨어에서 매 요청마다 토큰을 갱신한다. 백엔드는 Authorization 헤더의 JWT를 Supabase로 검증하는 미들웨어를 추가한다. 소셜 로그인은 Supabase OAuth 리디렉션을 사용하고, 최초 가입 시 닉네임/생년월일을 입력받는 온보딩 페이지로 이동한다.

**Tech Stack:** Next.js 16 (App Router), Express 5, Supabase Auth, @supabase/ssr, @supabase/supabase-js

---

## 파일 구조

**신규 생성:**
```
frontend/
  lib/supabase/
    client.ts         # 브라우저용 Supabase 클라이언트 (싱글톤)
    server.ts         # 서버 컴포넌트/라우트 핸들러용 클라이언트
  middleware.ts       # 세션 갱신 + 보호된 라우트 처리
  app/
    auth/callback/
      route.ts        # OAuth 콜백 코드 → 세션 교환
    login/
      page.tsx        # 이메일 로그인 + Google/Kakao 버튼
    signup/
      page.tsx        # 이메일 회원가입
    onboarding/
      page.tsx        # 최초 로그인 후 닉네임/생년월일 입력
  hooks/
    useUser.ts        # 현재 유저 상태 훅

backend/
  src/
    lib/
      supabase.ts     # Supabase 클라이언트 (일반 + 관리자)
    middleware/
      auth.middleware.ts  # JWT 검증 미들웨어
```

**수정:**
```
frontend/components/layout/Header.tsx   # 로그인/로그아웃 UI 추가
frontend/.env.local                     # Supabase 환경변수 추가
backend/.env                            # Supabase 환경변수 추가
backend/src/routes/tarot.routes.ts      # requireAuth 미들웨어 적용
```

---

## Task 1: Supabase 대시보드 설정 (수동 작업)

> 코드 작업 전 반드시 완료해야 함

**Files:** 없음 (대시보드 작업)

- [ ] **Step 1: Supabase 프로젝트 생성**

  [supabase.com](https://supabase.com) → New Project → 프로젝트 생성
  완료 후 **Settings → API**에서 아래 값 메모:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` 키 → `SUPABASE_SERVICE_ROLE_KEY` (백엔드용)

- [ ] **Step 2: profiles 테이블 + 트리거 생성**

  Supabase 대시보드 → **SQL Editor** → 아래 SQL 실행:

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

  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "본인만 조회" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

  CREATE POLICY "본인만 수정" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
  ```

- [ ] **Step 3: Google OAuth 설정**

  1. [Google Cloud Console](https://console.cloud.google.com) → 새 프로젝트 → OAuth 2.0 클라이언트 ID 생성
  2. 승인된 리디렉션 URI: `https://<project-ref>.supabase.co/auth/v1/callback`
  3. Supabase 대시보드 → **Authentication → Providers → Google** → 활성화 + Client ID/Secret 입력

- [ ] **Step 4: Kakao OAuth 설정**

  1. [Kakao Developers](https://developers.kakao.com) → 앱 추가
  2. 플랫폼 → Web → 사이트 도메인: `https://<project-ref>.supabase.co`
  3. 카카오 로그인 → Redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
  4. 동의항목 → 이메일(필수) 활성화
  5. 앱 키 → REST API 키 (Client ID로 사용), 보안 → Client Secret 생성
  6. Supabase 대시보드 → **Authentication → Providers → Kakao** → 활성화 + 값 입력

---

## Task 2: 패키지 설치 & 환경변수

**Files:**
- Modify: `frontend/.env.local`
- Modify: `backend/.env`

- [ ] **Step 1: 프론트엔드 패키지 설치**

  ```bash
  cd frontend
  npm install @supabase/supabase-js @supabase/ssr
  ```

- [ ] **Step 2: 백엔드 패키지 설치**

  ```bash
  cd backend
  npm install @supabase/supabase-js
  ```

- [ ] **Step 3: 환경변수 추가**

  `frontend/.env.local`에 추가:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
  ```

  `backend/.env`에 추가:
  ```env
  SUPABASE_URL=https://xxxx.supabase.co
  SUPABASE_ANON_KEY=eyJhbGciOi...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
  ```

- [ ] **Step 4: 커밋**

  ```bash
  git add frontend/package.json frontend/package-lock.json backend/package.json backend/package-lock.json
  git commit -m "chore: install supabase packages"
  ```

---

## Task 3: 프론트엔드 Supabase 클라이언트 유틸

**Files:**
- Create: `frontend/lib/supabase/client.ts`
- Create: `frontend/lib/supabase/server.ts`

- [ ] **Step 1: 브라우저 클라이언트 생성**

  `frontend/lib/supabase/client.ts`:
  ```typescript
  import { createBrowserClient } from '@supabase/ssr'

  export function createClient() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  ```

- [ ] **Step 2: 서버 클라이언트 생성**

  `frontend/lib/supabase/server.ts`:
  ```typescript
  import { createServerClient } from '@supabase/ssr'
  import { cookies } from 'next/headers'

  export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // 서버 컴포넌트에서 호출 시 무시
            }
          },
        },
      }
    )
  }
  ```

- [ ] **Step 3: 커밋**

  ```bash
  git add frontend/lib/supabase/
  git commit -m "feat: add supabase client utilities"
  ```

---

## Task 4: Next.js 미들웨어 (세션 갱신)

**Files:**
- Create: `frontend/middleware.ts`

- [ ] **Step 1: 미들웨어 생성**

  `frontend/middleware.ts`:
  ```typescript
  import { createServerClient } from '@supabase/ssr'
  import { NextResponse, type NextRequest } from 'next/server'

  export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // 보호된 라우트: 로그인 필요
    const protectedPaths = ['/reading', '/daily', '/onboarding']
    const isProtected = protectedPaths.some(p =>
      request.nextUrl.pathname.startsWith(p)
    )

    if (isProtected && !user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  export const config = {
    matcher: [
      '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
  }
  ```

- [ ] **Step 2: 개발 서버 재시작 후 미들웨어 동작 확인**

  `http://localhost:3000/reading` 접근 시 `/login`으로 리디렉션 되는지 확인

- [ ] **Step 3: 커밋**

  ```bash
  git add frontend/middleware.ts
  git commit -m "feat: add supabase session middleware"
  ```

---

## Task 5: Auth Callback 라우트

**Files:**
- Create: `frontend/app/auth/callback/route.ts`

- [ ] **Step 1: 콜백 라우트 생성**

  `frontend/app/auth/callback/route.ts`:
  ```typescript
  import { createServerClient } from '@supabase/ssr'
  import { cookies } from 'next/headers'
  import { NextResponse } from 'next/server'
  import type { NextRequest } from 'next/server'

  export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (code) {
      const cookieStore = await cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return cookieStore.getAll() },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            },
          },
        }
      )

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        // 신규 유저면 온보딩, 아니면 next로
        const { data: { user } } = await supabase.auth.getUser()
        const { data: profile } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('id', user!.id)
          .single()

        if (!profile?.nickname) {
          return NextResponse.redirect(`${origin}/onboarding`)
        }

        return NextResponse.redirect(`${origin}${next}`)
      }
    }

    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }
  ```

- [ ] **Step 2: 커밋**

  ```bash
  git add frontend/app/auth/callback/
  git commit -m "feat: add oauth callback route"
  ```

---

## Task 6: 로그인 페이지

**Files:**
- Create: `frontend/app/login/page.tsx`

- [ ] **Step 1: 로그인 페이지 생성**

  `frontend/app/login/page.tsx`:
  ```typescript
  "use client";

  import { useState } from "react";
  import { useRouter } from "next/navigation";
  import Link from "next/link";
  import { createClient } from "@/lib/supabase/client";
  import { Cat } from "lucide-react";

  export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleEmailLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("이메일 또는 비밀번호가 올바르지 않다냥.");
      } else {
        router.push("/");
        router.refresh();
      }
      setLoading(false);
    };

    const handleSocialLogin = async (provider: "google" | "kakao") => {
      await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <Cat className="w-10 h-10 text-primary mx-auto" />
            <h1 className="text-2xl font-bold">냥이에게 로그인</h1>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-secondary/5 border border-primary/20 focus:border-accent outline-none transition-all"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-secondary/5 border border-primary/20 focus:border-accent outline-none transition-all"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-primary/20" />
            <span className="text-xs text-muted-foreground">또는</span>
            <div className="flex-1 h-px bg-primary/20" />
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin("google")}
              className="w-full py-3 rounded-full border border-primary/20 hover:bg-primary/10 transition-all flex items-center justify-center gap-2 font-medium"
            >
              Google로 로그인
            </button>
            <button
              onClick={() => handleSocialLogin("kakao")}
              className="w-full py-3 rounded-full bg-[#FEE500] text-[#191919] font-bold hover:bg-[#FEE500]/90 transition-all"
            >
              카카오로 로그인
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            계정이 없으신가냥?{" "}
            <Link href="/signup" className="text-accent hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: 브라우저에서 확인**

  `http://localhost:3000/login` 접근 → 이메일/소셜 버튼 렌더링 확인

- [ ] **Step 3: 커밋**

  ```bash
  git add frontend/app/login/
  git commit -m "feat: add login page with email and social auth"
  ```

---

## Task 7: 회원가입 페이지

**Files:**
- Create: `frontend/app/signup/page.tsx`

- [ ] **Step 1: 회원가입 페이지 생성**

  `frontend/app/signup/page.tsx`:
  ```typescript
  "use client";

  import { useState } from "react";
  import Link from "next/link";
  import { createClient } from "@/lib/supabase/client";
  import { Cat } from "lucide-react";

  export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      if (error) {
        setError(error.message);
      } else {
        setDone(true);
      }
      setLoading(false);
    };

    if (done) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center space-y-4">
          <Cat className="w-10 h-10 text-primary mx-auto" />
          <h2 className="text-2xl font-bold">이메일을 확인해보세냥!</h2>
          <p className="text-muted-foreground">
            {email}로 인증 메일을 보냈다냥. 확인 후 로그인해 주세요.
          </p>
          <Link href="/login" className="text-accent hover:underline">
            로그인으로 이동
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <Cat className="w-10 h-10 text-primary mx-auto" />
            <h1 className="text-2xl font-bold">회원가입</h1>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-secondary/5 border border-primary/20 focus:border-accent outline-none transition-all"
            />
            <input
              type="password"
              placeholder="비밀번호 (6자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-3 rounded-xl bg-secondary/5 border border-primary/20 focus:border-accent outline-none transition-all"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {loading ? "처리 중..." : "회원가입"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            이미 계정이 있으신가냥?{" "}
            <Link href="/login" className="text-accent hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: 커밋**

  ```bash
  git add frontend/app/signup/
  git commit -m "feat: add signup page"
  ```

---

## Task 8: 온보딩 페이지 (최초 소셜 로그인 후 프로필 완성)

**Files:**
- Create: `frontend/app/onboarding/page.tsx`

- [ ] **Step 1: 온보딩 페이지 생성**

  `frontend/app/onboarding/page.tsx`:
  ```typescript
  "use client";

  import { useState } from "react";
  import { useRouter } from "next/navigation";
  import { createClient } from "@/lib/supabase/client";
  import { Cat } from "lucide-react";

  export default function OnboardingPage() {
    const [nickname, setNickname] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { error } = await supabase
        .from("profiles")
        .update({ nickname, birth_date: birthDate, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) {
        setError("저장에 실패했다냥. 다시 시도해 주세요.");
      } else {
        router.push("/");
      }
      setLoading(false);
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <Cat className="w-10 h-10 text-primary mx-auto" />
            <h1 className="text-2xl font-bold">냥이를 소개해 주세냥!</h1>
            <p className="text-muted-foreground text-sm">처음이시군냥. 간단한 정보를 알려주세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">닉네임</label>
              <input
                type="text"
                placeholder="닉네임을 입력해 주세냥"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                className="w-full p-3 rounded-xl bg-secondary/5 border border-primary/20 focus:border-accent outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">생년월일 <span className="text-accent">*</span></label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                max={new Date().toISOString().split("T")[0]}
                min="1900-01-01"
                className="w-full p-3 rounded-xl bg-secondary/5 border border-primary/20 focus:border-accent outline-none transition-all"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || !nickname || !birthDate}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {loading ? "저장 중..." : "시작하기"}
            </button>
          </form>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: 커밋**

  ```bash
  git add frontend/app/onboarding/
  git commit -m "feat: add onboarding page for new social login users"
  ```

---

## Task 9: useUser 훅 & Header 업데이트

**Files:**
- Create: `frontend/hooks/useUser.ts`
- Modify: `frontend/components/layout/Header.tsx`

- [ ] **Step 1: useUser 훅 생성**

  `frontend/hooks/useUser.ts`:
  ```typescript
  "use client";

  import { useEffect, useState } from "react";
  import { createClient } from "@/lib/supabase/client";
  import type { User } from "@supabase/supabase-js";

  export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => setUser(session?.user ?? null)
      );

      return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
      await supabase.auth.signOut();
      setUser(null);
    };

    return { user, loading, signOut };
  }
  ```

- [ ] **Step 2: Header에 로그인/로그아웃 UI 추가**

  `frontend/components/layout/Header.tsx`의 `<nav>` 뒤에 추가:
  ```typescript
  "use client";  // 파일 상단에 추가

  import Link from 'next/link';
  import { Cat } from 'lucide-react';
  import { useUser } from '@/hooks/useUser';
  import { useRouter } from 'next/navigation';

  export function Header() {
    const { user, loading, signOut } = useUser();
    const router = useRouter();

    const handleSignOut = async () => {
      await signOut();
      router.push('/');
      router.refresh();
    };

    return (
      <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex flex-shrink-0 items-center gap-2 transition-opacity hover:opacity-80">
            <Cat className="h-5 w-5 flex-shrink-0 text-primary" />
            <span className="text-base sm:text-xl font-bold font-serif whitespace-nowrap bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              고양이 점술관
            </span>
          </Link>

          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">홈</Link>
            <Link href="/daily" className="text-sm font-medium transition-colors hover:text-primary">오늘의 운세</Link>
            <Link href="/reading" className="text-sm font-medium transition-colors hover:text-primary">고양이 타로 상담</Link>
          </nav>

          <div className="flex items-center gap-3">
            {!loading && (
              user ? (
                <button
                  onClick={handleSignOut}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  로그아웃
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-sm px-4 py-1.5 rounded-full border border-primary/40 hover:bg-primary/10 transition-colors"
                >
                  로그인
                </Link>
              )
            )}
          </div>

          <button className="md:hidden p-2 text-primary">
            <span className="sr-only">Toggle menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
          </button>
        </div>
      </header>
    );
  }
  ```

- [ ] **Step 3: 브라우저에서 확인**

  - 비로그인 상태 → Header에 "로그인" 버튼 표시 확인
  - 로그인 후 → "로그아웃" 버튼 표시 확인

- [ ] **Step 4: 커밋**

  ```bash
  git add frontend/hooks/ frontend/components/layout/Header.tsx
  git commit -m "feat: add useUser hook and auth UI to header"
  ```

---

## Task 10: 백엔드 Supabase 클라이언트 & JWT 미들웨어

**Files:**
- Create: `backend/src/lib/supabase.ts`
- Create: `backend/src/middleware/auth.middleware.ts`

- [ ] **Step 1: 백엔드 Supabase 클라이언트 생성**

  `backend/src/lib/supabase.ts`:
  ```typescript
  import { createClient } from '@supabase/supabase-js';

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error('Supabase 환경변수가 설정되지 않았습니다.');
  }

  export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  export const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  ```

- [ ] **Step 2: JWT 검증 미들웨어 생성**

  `backend/src/middleware/auth.middleware.ts`:
  ```typescript
  import { Request, Response, NextFunction } from 'express';
  import { supabase } from '../lib/supabase';

  declare global {
    namespace Express {
      interface Request {
        user?: { id: string; email?: string };
      }
    }
  }

  export const requireAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: '로그인이 필요하다냥.' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: '유효하지 않은 토큰이다냥.' });
    }

    req.user = { id: user.id, email: user.email };
    next();
  };
  ```

- [ ] **Step 3: 커밋**

  ```bash
  git add backend/src/lib/ backend/src/middleware/auth.middleware.ts
  git commit -m "feat: add supabase client and JWT auth middleware to backend"
  ```

---

## Task 11: 타로 API에 인증 적용

**Files:**
- Modify: `backend/src/routes/tarot.routes.ts`

- [ ] **Step 1: spread 라우트에 requireAuth 적용**

  `backend/src/routes/tarot.routes.ts`:
  ```typescript
  import { Router } from 'express';
  import { getDailyTarot, getSpreadTarot } from '../controllers/tarot.controller';
  import { requireAuth } from '../middleware/auth.middleware';

  const router = Router();

  // 오늘의 운세 (1장) - 로그인 불필요
  router.post('/daily', getDailyTarot);

  // 3장 뽑기 (스프레드) - 로그인 필요
  router.post('/spread', requireAuth, getSpreadTarot);

  export default router;
  ```

- [ ] **Step 2: 프론트엔드에서 API 호출 시 토큰 전달**

  `frontend/app/reading/page.tsx`의 `fetchReading` 함수 수정:
  ```typescript
  const fetchReading = async (pickedCards: TarotCard[]) => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const response = await fetch("/api/tarot/spread", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session ? { "Authorization": `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({ cards: pickedCards, question, birthDate, birthTime, gender }),
    });
    // ... 이하 동일
  };
  ```

  파일 상단에 import 추가:
  ```typescript
  import { createClient } from "@/lib/supabase/client";
  ```

- [ ] **Step 3: 브라우저에서 확인**

  - 비로그인 상태로 `/reading` 접근 시 → `/login` 리디렉션 확인
  - 로그인 후 카드 선택 → AI 응답 정상 확인

- [ ] **Step 4: 커밋**

  ```bash
  git add backend/src/routes/tarot.routes.ts frontend/app/reading/page.tsx
  git commit -m "feat: protect spread API with JWT auth"
  ```

---

## 완료 후 체크리스트

- [ ] 이메일 회원가입 → 인증 메일 수신 → 로그인 정상 동작
- [ ] Google 로그인 → 온보딩 → 홈 이동
- [ ] Kakao 로그인 → 온보딩 → 홈 이동
- [ ] 비로그인 상태로 `/reading` 접근 시 `/login` 리디렉션
- [ ] 로그인 후 타로 상담 API 정상 응답
- [ ] 로그아웃 후 헤더에 "로그인" 버튼 표시
