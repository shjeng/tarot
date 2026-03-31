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
  disabled,
}: {
  onGoogle: () => void;
  onKakao: () => void;
  label: "로그인" | "시작하기";
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onGoogle}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white text-gray-800 text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FEE500] text-[#191919] text-sm font-bold hover:bg-[#FDD800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    if (error) setError("소셜 로그인에 실패했다냥. 다시 시도해 달라냥.");
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

// ─── 비밀번호 유효성 조건 ────────────────────────────────────────────────────
const passwordRules = [
  { label: "8자 이상", test: (pw: string) => pw.length >= 8 },
  { label: "영문 포함", test: (pw: string) => /[a-zA-Z]/.test(pw) },
  { label: "숫자 포함", test: (pw: string) => /[0-9]/.test(pw) },
  { label: "특수문자 포함", test: (pw: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw) },
];

function isPasswordValid(pw: string) {
  return passwordRules.every((r) => r.test(pw));
}

// ─── 비밀번호 유효성 표시 컴포넌트 ──────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
      {passwordRules.map((rule) => {
        const ok = rule.test(password);
        return (
          <span
            key={rule.label}
            className={`text-xs flex items-center gap-0.5 transition-colors ${
              ok ? "text-green-400" : "text-muted-foreground"
            }`}
          >
            {ok ? "✓" : "✗"} {rule.label}
          </span>
        );
      })}
    </div>
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
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const supabase = createClient();

  const allAgreed = agreeTerms && agreePrivacy;

  const handleSocial = async (provider: "google" | "kakao") => {
    if (!allAgreed) {
      setError("약관에 동의해야 가입할 수 있다냥.");
      return;
    }
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // 신규 회원은 항상 onboarding으로 이동하므로 ?next= 파라미터 불필요
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError("소셜 가입에 실패했다냥. 다시 시도해 주세요.");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAgreed) {
      setError("약관에 동의해야 가입할 수 있다냥.");
      return;
    }
    if (!isPasswordValid(password)) {
      setError("비밀번호 조건을 모두 충족해야 한다냥.");
      return;
    }
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않다냥.");
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
        const msg = error.message.toLowerCase();
        if (msg.includes("already registered") || msg.includes("already exists") || msg.includes("email address is already")) {
          setError("이미 가입된 이메일이다냥.");
        } else if (msg.includes("password")) {
          setError("비밀번호 조건을 확인해 달라냥.");
        } else {
          setError("가입에 실패했다냥. 다시 시도해 달라냥.");
        }
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
          <br />확인 후 부탁드린다냥!
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
        disabled={!allAgreed}
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
          placeholder="비밀번호 (영문+숫자+특수문자 8자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded-xl bg-secondary/5 border border-primary/20 focus:border-accent outline-none transition-all text-sm"
        />
        <PasswordStrength password={password} />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full p-3 rounded-xl bg-secondary/5 border border-primary/20 focus:border-accent outline-none transition-all text-sm"
        />
        {/* 약관 동의 */}
        <div className="space-y-2 pt-1">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 accent-primary shrink-0"
            />
            <span className="text-xs text-muted-foreground leading-relaxed">
              <span className="text-accent font-medium">[필수]</span>{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                서비스 이용약관
              </a>
              에 동의합니다
            </span>
          </label>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
              className="mt-0.5 accent-primary shrink-0"
            />
            <span className="text-xs text-muted-foreground leading-relaxed">
              <span className="text-accent font-medium">[필수]</span>{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                개인정보 처리방침
              </a>
              에 동의합니다
            </span>
          </label>
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading || !allAgreed}
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
      {/* 배경 장식 */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

      <Suspense fallback={<div className="w-full max-w-sm h-96 bg-background/40 rounded-2xl animate-pulse" />}>
        <LoginModal />
      </Suspense>
    </div>
  );
}
