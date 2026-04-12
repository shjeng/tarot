"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Star, Moon, Sparkles, Cat } from "lucide-react";

// 공유된 리딩 데이터 타입 (백엔드 응답 구조)
interface SharedReading {
  type: "daily" | "spread";
  request_data: {
    card?: { name: string; nameKo: string };
    cards?: { name: string; nameKo: string }[];
    question?: string;
  };
  reading: string;
  created_at: string;
}

// 날짜 포맷 유틸
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

export default function SharePage() {
  const params = useParams();
  const token = params.token as string;

  const [data, setData] = useState<SharedReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/tarot/share/${token}`)
      .then(res => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then(setData)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  // ─── 로딩 ───────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-accent/40 animate-spin" style={{ animationDuration: "2s" }} />
          <Cat className="absolute inset-0 m-auto w-7 h-7 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">냥이가 리딩을 불러오는 중이다냥...</p>
      </div>
    );
  }

  // ─── 없음 ───────────────────────────────────────────────────────────────────
  if (notFound || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Cat className="w-10 h-10 text-primary/50" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">리딩을 찾을 수 없다냥</h1>
          <p className="text-muted-foreground">
            공유 링크가 만료되었거나 존재하지 않는다냥.
          </p>
        </div>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const isSpread = data.type === "spread";
  const cardNames = isSpread
    ? data.request_data.cards?.map(c => c.nameKo).join(" · ") ?? ""
    : data.request_data.card?.nameKo ?? "";

  // ─── 공유 리딩 ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">고양이 점술관</p>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {isSpread ? "사주타로 리딩" : "오늘의 운세"}
        </h1>
        <p className="text-xs text-muted-foreground">{formatDate(data.created_at)}</p>
      </motion.div>

      {/* 카드 정보 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-primary/15 bg-secondary/5 p-5 space-y-3"
      >
        {/* 타입 배지 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`flex items-center gap-1.5 text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full ${
            isSpread
              ? "bg-accent/15 text-accent border border-accent/20"
              : "bg-primary/15 text-primary border border-primary/20"
          }`}>
            {isSpread ? <Sparkles className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
            {isSpread ? "타로 상담" : "오늘의 운세"}
          </span>
        </div>

        {/* 질문 (스프레드만) */}
        {isSpread && data.request_data.question && (
          <p className="text-sm text-foreground/80 break-keep">
            &ldquo;{data.request_data.question}&rdquo;
          </p>
        )}

        {/* 카드명 */}
        {cardNames && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Star className="w-3 h-3 text-secondary/60 flex-shrink-0" />
            {cardNames}
          </p>
        )}
      </motion.div>

      {/* 리딩 내용 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-secondary/5 rounded-3xl p-6 md:p-8 border border-secondary/20 shadow-xl"
      >
        <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
          <Star className="text-accent w-4 h-4" />
          냥이의 해석
        </h2>
        <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-primary-foreground text-gray-300">
          <ReactMarkdown>{data.reading}</ReactMarkdown>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-center space-y-3 pt-2"
      >
        <p className="text-sm text-muted-foreground">나도 냥이에게 물어보고 싶다냥?</p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/reading"
            className="px-6 py-2.5 rounded-full bg-accent text-accent-foreground text-sm font-bold hover:bg-accent/90 transition-all shadow-lg hover:shadow-accent/30"
          >
            사주타로 상담 받기
          </Link>
          <Link
            href="/daily"
            className="px-6 py-2.5 rounded-full border border-primary/40 text-primary text-sm font-medium hover:bg-primary/10 transition-all"
          >
            오늘의 운세 보기
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
