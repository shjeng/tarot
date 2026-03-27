"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Cat } from "lucide-react";

export default function OnboardingPage() {
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  // 마운트 시 세션 확인 — 비로그인 유저는 로그인 페이지로
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace("/login");
    });
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          nickname,
          birth_date: birthDate,
          birth_time: birthTime || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        setError("저장에 실패했다냥. 다시 시도해 주세요.");
      } else {
        router.push("/");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Cat className="w-10 h-10 text-primary mx-auto" aria-hidden="true" />
          <h1 className="text-2xl font-bold">냥이를 소개해 주세냥!</h1>
          <p className="text-muted-foreground text-sm">처음이시군냥. 간단한 정보를 알려주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground">닉네임 <span className="text-accent">*</span></label>
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
          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground">태어난 시각 <span className="text-muted-foreground/60">(선택)</span></label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
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
