# 로그인/회원가입 화면 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/login` 페이지를 모달 오버레이 + 탭 전환 방식으로 재설계하고, 이메일 회원가입을 같은 화면에 통합한다.

**Architecture:** 기존 `app/login/page.tsx`를 완전 재작성. 배경에 신비로운 장식 요소를 유지하고, 중앙 모달에 로그인/회원가입 탭을 framer-motion으로 전환. 로그인 탭과 회원가입 탭 모두 소셜 버튼(Google, Kakao)을 상단에 노출. `app/signup/page.tsx`는 `/login`으로 리디렉션 처리.

**Tech Stack:** Next.js 16 (App Router), `@supabase/ssr`, framer-motion, lucide-react, Tailwind CSS v4

---

## 현재 상태 (건드리지 않을 파일들)

| 파일 | 상태 |
|------|------|
| `frontend/middleware.ts` | 완성 — /daily, /reading, /onboarding 보호, /login?next= 리디렉션 |
| `frontend/lib/supabase/client.ts` | 완성 — 브라우저 Supabase 클라이언트 |
| `frontend/lib/supabase/server.ts` | 완성 — 서버 Supabase 클라이언트 |
| `frontend/app/auth/callback/route.ts` | 완성 — OAuth 콜백, profiles.nickname 확인 후 온보딩 이동 |
| `frontend/app/onboarding/page.tsx` | 완성 — 닉네임/생년월일/생시 입력 |

## 변경할 파일들

| 파일 | 변경 | 역할 |
|------|------|------|
| `frontend/app/login/page.tsx` | 완전 재작성 | 배경 + 모달 오버레이 + 로그인/회원가입 탭 |
| `frontend/app/signup/page.tsx` | 재작성 | `/login`으로 리디렉션 |

---

## Task 1: `/login` 페이지 — 모달 골격 + 탭 전환 UI

**Files:**
- Modify: `frontend/app/login/page.tsx`

- [ ] **Step 1: 기존 `app/login/page.tsx` 전체를 아래 코드로 교체**

```tsx
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Cat, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ─── 유틸: ?next= 파라미터 안전 처리 ───────────────────────────────────────
function useSafeNext() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("next") ?? "/";
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
}

// ─── 탭 타입 ────────────────────────────────────────────────────────────────
type Tab = "login" | "signup";

// ─── 소셜 버튼 공통 컴포넌트 ────────────────────────────────────────────────
function SocialButtons({
  onGoogle,
  onKakao,
  label,
}: {
  onGoogle: () => void;
  onKakao: () => void;
  label: "로그인" | "시작하기";
}) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onGoogle}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white text-gray-800 text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-200"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
          <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.96L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Google로 {label}
      </button>
      <button
        type="button"
        onClick={onKakao}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FEE500] text-[#191919] text-sm font-bold hover:bg-[#FDD800] transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M9 0C4.029 0 0 3.136 0 7c0 2.437 1.524 4.574 3.84 5.855l-.98 3.658c-.087.325.277.588.56.392L7.54 14.37A10.65 10.65 0 0 0 9 14.5c4.971 0 9-3.134 9-7S13.971 0 9 0z" fill="#3C1E1E"/>
        </svg>
        카카오로 {label}
      </button>
    </div>
  );
}

// ─── 구분선 ─────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-primary/20" />
      <span className="text-xs text-muted-foreground">또는 이메일로</span>
      <div className="flex-1 h-px bg-primary/20" />
    </div>
  );
}

// ─── 로그인 탭 ───────────────────────────────────────────────────────────────
function LoginTab({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSocial = async (provider: "google" | "kakao") => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) setError("소셜 로그인에 실패했다냥. 다시 시도해 주세요.");
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("이메일 또는 비밀번호가 올바르지 않다냥.");
      } else {
        router.push(next);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
    >
      <SocialButtons
        onGoogle={() => handleSocial("google")}
        onKakao={() => handleSocial("kakao")}
        label="로그인"
      />
      <Divider />
      <form onSubmit={handleEmailLogin} className="space-y-3">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded-xl bg-secondary/5 border border-primary/20 focus:border-accent outline-none transition-all text-sm"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded-xl bg-secondary/5 border border-primary/20 focus:border-accent outline-none transition-all text-sm"
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </motion.div>
  );
}

// ─── 회원가입 탭 ─────────────────────────────────────────────────────────────
function SignupTab() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const supabase = createClient();

  const handleSocial = async (provider: "google" | "kakao") => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError("소셜 가입에 실패했다냥. 다시 시도해 주세요.");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않다냥.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 한다냥.");
      return;
    }
    setLoading(true);
    setError("");
    try {
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
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-3 py-4"
      >
        <div className="text-3xl">📬</div>
        <p className="font-bold text-base">이메일을 확인해보세냥!</p>
        <p className="text-sm text-muted-foreground">
          <span className="text-accent">{email}</span>로 인증 링크를 보냈다냥.
          <br />확인 후 로그인해 주세요.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="signup"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
    >
      <SocialButtons
        onGoogle={() => handleSocial("google")}
        onKakao={() => handleSocial("kakao")}
        label="시작하기"
      />
      <Divider />
      <form onSubmit={handleSignup} className="space-y-3">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded-xl bg-secondary/5 border border-primary/20 focus:border-accent outline-none transition-all text-sm"
        />
        <input
          type="password"
          placeholder="비밀번호 (6자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded-xl bg-secondary/5 border border-primary/20 focus:border-accent outline-none transition-all text-sm"
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full p-3 rounded-xl bg-secondary/5 border border-primary/20 focus:border-accent outline-none transition-all text-sm"
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>
    </motion.div>
  );
}

// ─── 모달 내부 (useSearchParams 사용 — Suspense 경계 안쪽) ──────────────────
function LoginModal() {
  const [tab, setTab] = useState<Tab>("login");
  const next = useSafeNext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm bg-background/80 backdrop-blur border border-primary/20 rounded-2xl shadow-2xl p-8"
    >
      {/* 헤더 */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-3">
          <Cat className="w-10 h-10 text-secondary" />
          <Star
            className="w-5 h-5 text-accent absolute -top-1 -right-3"
            style={{ animationDuration: "3s" }}
          />
        </div>
        <h1 className="text-2xl font-bold font-serif">고양이 점술관</h1>
        <p className="text-sm text-muted-foreground mt-1">별빛 아래, 냥이가 기다리고 있다냥</p>
      </div>

      {/* 탭 헤더 */}
      <div className="flex border-b border-primary/20 mb-6">
        {(["login", "signup"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              tab === t
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "login" ? "로그인" : "회원가입"}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <AnimatePresence mode="wait">
        {tab === "login" ? (
          <LoginTab key="login" next={next} />
        ) : (
          <SignupTab key="signup" />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── 페이지 루트 ─────────────────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <div className="relative flex items-center justify-center min-h-[80vh] overflow-hidden">
      {/* 배경 장식 (홈 페이지와 동일한 패턴) */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

      {/* useSearchParams는 Suspense 경계 안에 있어야 함 */}
      <Suspense fallback={<div className="w-full max-w-sm h-96 bg-background/40 rounded-2xl animate-pulse" />}>
        <LoginModal />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 2: TypeScript 타입 에러 확인**

```bash
cd frontend && npx tsc --noEmit
```

에러 없으면 통과. 에러가 있으면 메시지를 보고 해당 줄 수정.

- [ ] **Step 3: 개발 서버로 시각 확인**

```bash
cd frontend && npm run dev
```

브라우저에서 `http://localhost:3000/login` 접속.
체크리스트:
- [ ] 배경 장식 보임 (블러 원)
- [ ] 고양이 아이콘 + 별 장식 보임
- [ ] "로그인" / "회원가입" 탭 전환 시 framer-motion 슬라이드 작동
- [ ] 소셜 버튼 2개 보임 (Google 흰 배경, 카카오 노란 배경)
- [ ] 이메일/비밀번호 입력 후 로그인 버튼 클릭 — 오류 메시지 또는 리디렉션 작동

- [ ] **Step 4: 커밋**

```bash
cd frontend && git add app/login/page.tsx
git commit -m "feat 로그인/회원가입 모달 UI 재설계 (탭 전환, 소셜 로그인)"
```

---

## Task 2: `/signup` 페이지 — `/login`으로 리디렉션

기존 `/signup` 페이지는 이제 로그인 모달의 "회원가입" 탭으로 통합되었으므로, 직접 접근 시 `/login`으로 보낸다.

**Files:**
- Modify: `frontend/app/signup/page.tsx`

- [ ] **Step 1: `app/signup/page.tsx` 전체를 아래 코드로 교체**

```tsx
import { redirect } from "next/navigation";

export default function SignupPage() {
  redirect("/login");
}
```

- [ ] **Step 2: 개발 서버에서 리디렉션 확인**

`http://localhost:3000/signup` 접속 → `/login`으로 이동하는지 확인.

- [ ] **Step 3: 커밋**

```bash
cd frontend && git add app/signup/page.tsx
git commit -m "refactor /signup을 /login으로 리디렉션 처리"
```

---

## Task 3: Header에 로그인 버튼 추가

미로그인 사용자가 헤더에서도 로그인 페이지에 접근할 수 있게 한다.

**Files:**
- Modify: `frontend/components/layout/Header.tsx`

현재 Header는 서버 컴포넌트다. 로그인 상태 확인 + 버튼 표시를 위해 Supabase 서버 클라이언트를 사용한다.

- [ ] **Step 1: `Header.tsx` 전체를 아래 코드로 교체**

```tsx
import Link from 'next/link';
import { Cat } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            홈
          </Link>
          <Link href="/daily" className="text-sm font-medium transition-colors hover:text-primary">
            오늘의 운세
          </Link>
          <Link href="/reading" className="text-sm font-medium transition-colors hover:text-primary">
            AI 타로 점
          </Link>
          {user ? (
            <LogoutButton />
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-1.5 rounded-full border border-primary/40 hover:bg-primary/10 transition-colors"
            >
              로그인
            </Link>
          )}
        </nav>

        <button className="md:hidden p-2 text-primary">
          <span className="sr-only">Toggle menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
        </button>
      </div>
    </header>
  );
}
```

> **Note:** `LogoutButton`은 클라이언트 컴포넌트가 필요하다. Task 4에서 만든다.

- [ ] **Step 2: 커밋하지 않고 Task 4로 이동**

---

## Task 4: LogoutButton 클라이언트 컴포넌트

Header에서 사용할 로그아웃 버튼. 클라이언트 컴포넌트이므로 별도 파일로 분리.

**Files:**
- Create: `frontend/components/auth/LogoutButton.tsx`
- Modify: `frontend/components/layout/Header.tsx` (import 추가)

- [ ] **Step 1: `frontend/components/auth/LogoutButton.tsx` 생성**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium px-4 py-1.5 rounded-full border border-primary/40 hover:bg-primary/10 transition-colors"
    >
      로그아웃
    </button>
  );
}
```

- [ ] **Step 2: `Header.tsx`에 import 추가**

`Header.tsx` 파일 상단, 기존 import 아래에 추가:

```tsx
import { LogoutButton } from '@/components/auth/LogoutButton';
```

- [ ] **Step 3: TypeScript 타입 에러 확인**

```bash
cd frontend && npx tsc --noEmit
```

에러 없으면 통과.

- [ ] **Step 4: 개발 서버에서 확인**

```bash
cd frontend && npm run dev
```

체크리스트:
- [ ] 미로그인 상태: 헤더 우측에 "로그인" 버튼 표시
- [ ] 로그인 상태: 헤더 우측에 "로그아웃" 버튼 표시
- [ ] 로그아웃 버튼 클릭 → `/login`으로 이동

- [ ] **Step 5: 커밋**

```bash
cd frontend && git add components/auth/LogoutButton.tsx components/layout/Header.tsx
git commit -m "feat 헤더에 로그인/로그아웃 버튼 추가"
```

---

## Task 5: 최종 빌드 검증

- [ ] **Step 1: 프로덕션 빌드**

```bash
cd frontend && npm run build
```

기대 출력: `✓ Compiled successfully` 또는 빌드 성공 메시지. 에러가 있으면 내용을 보고 수정.

- [ ] **Step 2: 전체 흐름 수동 검증**

개발 서버(`npm run dev`)를 켜고 아래 시나리오를 순서대로 확인:

1. **미로그인 + /daily 접근** → `/login?next=/daily`로 리디렉션 되는가
2. **로그인 탭 — 소셜** → Google/카카오 버튼 클릭 시 소셜 OAuth 페이지로 이동하는가
3. **로그인 탭 — 이메일** → 잘못된 비밀번호 입력 시 "올바르지 않다냥" 에러 표시
4. **회원가입 탭** → 비밀번호 불일치 시 에러, 일치 시 가입 → 이메일 인증 안내 화면 전환
5. **/signup 직접 접근** → `/login`으로 리디렉션
6. **소셜 로그인 완료 (callback)** → 닉네임 없으면 `/onboarding`으로 이동
7. **온보딩 완료** → `/`로 이동

- [ ] **Step 3: 커밋 (빌드 에러 수정이 있었을 경우)**

```bash
cd frontend && git add -A
git commit -m "fix 빌드 에러 수정"
```
