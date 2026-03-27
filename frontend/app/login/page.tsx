"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Cat } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next") ?? "/";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";
  const supabase = createClient();

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

  const handleSocialLogin = async (provider: "google" | "kakao") => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) setError("소셜 로그인에 실패했다냥.");
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
