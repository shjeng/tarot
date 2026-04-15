"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Cat, Star, Moon, ChevronDown,
  Sparkles, Calendar, BookOpen, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { ShareButton } from "@/components/ui/ShareButton";
import { Card } from "@/components/tarot/Card";
import { tarotCards } from "@/data/tarotCards";

// ─── 타입 ────────────────────────────────────────────────────────────────────

interface RequestData {
  card?: { name: string; nameKo: string };
  cards?: { name: string; nameKo: string }[];
  question?: string;
  birthDate?: string;
  gender?: string;
}

interface History {
  id: string;
  type: "daily" | "spread";
  request_data: RequestData;
  reading: string;
  created_at: string;
}

// 카드 이름으로 이미지 경로 조회
const cardImageMap = new Map(tarotCards.map(c => [c.name, c.image]));
const getCardImage = (name: string) => cardImageMap.get(name);

// ─── 유틸 ────────────────────────────────────────────────────────────────────

// 날짜를 "2026년 4월 5일 오후 3:22" 형식으로 포맷
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

// ─── 이력 카드 ────────────────────────────────────────────────────────────────

function HistoryCard({ item, index }: { item: History; index: number }) {
  const [open, setOpen] = useState(false);
  const isSpread = item.type === "spread";

  // 카드명 문자열 생성
  const cardNames = isSpread
    ? item.request_data.cards?.map(c => c.nameKo).join(" · ") ?? ""
    : item.request_data.card?.nameKo ?? "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: "easeOut" }}
      className="rounded-2xl border border-primary/15 bg-secondary/5 overflow-hidden hover:border-primary/30 transition-colors"
    >
      {/* 헤더 — 클릭 시 펼치기/접기 */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left p-5 flex items-start gap-4 group"
      >
        {/* 아이콘 */}
        <div className={`mt-0.5 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
          isSpread ? "bg-accent/10" : "bg-primary/10"
        }`}>
          {isSpread
            ? <Sparkles className="w-4 h-4 text-accent" />
            : <Moon className="w-4 h-4 text-primary" />
          }
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          {/* 배지 + 날짜 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full ${
              isSpread
                ? "bg-accent/15 text-accent border border-accent/20"
                : "bg-primary/15 text-primary border border-primary/20"
            }`}>
              {isSpread ? "타로 상담" : "오늘의 운세"}
            </span>
            <span className="text-xs text-muted-foreground">{formatDate(item.created_at)}</span>
          </div>

          {/* 질문 (spread) 또는 카드명 (daily) */}
          {isSpread && item.request_data.question ? (
            <p className="text-sm text-foreground/80 line-clamp-1 break-keep">
              &ldquo;{item.request_data.question}&rdquo;
            </p>
          ) : null}

          {/* 카드명 */}
          {cardNames ? (
            <p className="text-xs text-muted-foreground">
              <Star className="inline w-3 h-3 mr-1 text-secondary/60" />
              {cardNames}
            </p>
          ) : null}
        </div>

        {/* 공유 버튼 + 펼치기 화살표 */}
        <div className="flex-shrink-0 flex items-center gap-1 mt-0.5" onClick={(e) => e.stopPropagation()}>
          <ShareButton
            historyId={item.id}
            variant="icon"
          />
          <div className={`text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      {/* 리딩 내용 — 아코디언 */}
      <motion.div
        initial={false}
        animate={open ? { height: "auto", opacity: 1 } : { height: "0px", opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
            <div className="px-5 pb-6 pt-4 border-t border-primary/10 space-y-5">
              {/* 카드 이미지 */}
              {(() => {
                const cards = isSpread
                  ? (item.request_data.cards ?? [])
                  : item.request_data.card ? [item.request_data.card] : [];
                const labels = isSpread ? ["과거", "현재", "미래"] : [];
                return cards.length > 0 ? (
                  <div className="flex justify-center gap-4 flex-wrap">
                    {cards.map((c, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5">
                        <Card
                          id={idx}
                          frontImage={getCardImage(c.name)}
                          name={c.nameKo}
                          isFlipped={true}
                          width={72}
                          height={120}
                        />
                        {labels[idx] ? (
                          <span className="text-[10px] text-muted-foreground tracking-wide">{labels[idx]}</span>
                        ) : null}
                        <span className="text-xs text-foreground/70 font-medium">{c.nameKo}</span>
                      </div>
                    ))}
                  </div>
                ) : null;
              })()}
              {/* 리딩 텍스트 */}
              <div className="prose prose-invert prose-sm max-w-none
                prose-p:leading-relaxed prose-p:text-gray-300
                prose-headings:text-primary-foreground prose-headings:font-serif
                prose-strong:text-secondary/90 prose-li:text-gray-300">
                <ReactMarkdown>{item.reading}</ReactMarkdown>
              </div>
            </div>
      </motion.div>
    </motion.div>
  );
}

// ─── 빈 상태 ────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 gap-5 text-center"
    >
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-9 h-9 text-primary/50" />
        </div>
        <Star className="absolute -top-1 -right-1 w-5 h-5 text-secondary/50 animate-pulse" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-serif font-bold text-foreground/70">아직 기록이 없다냥</h3>
        <p className="text-sm text-muted-foreground break-keep max-w-xs">
          냥이에게 처음 고민을 털어놓아 달라냥.<br />
          별빛 아래 모든 이야기는 기록된다냥.
        </p>
      </div>
      <Link
        href="/reading"
        className="mt-2 px-6 py-2.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
      >
        타로 상담 받기
      </Link>
    </motion.div>
  );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────────────────

export default function MyPage() {
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<User | null>(null);
  const [histories, setHistories] = useState<History[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const LIMIT = 10;

  // 이력 불러오기 (next.config.ts의 /api/* 프록시를 통해 백엔드 호출)
  const fetchHistories = useCallback(async (currentOffset: number, token: string) => {
    const res = await fetch(
      `/api/tarot/history?limit=${LIMIT}&offset=${currentOffset}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error("이력 조회 실패");
    return res.json() as Promise<{ histories: History[]; total: number }>;
  }, []);

  // 마운트 시 세션 확인 + 첫 이력 로드 (인증은 미들웨어에서 처리)
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUser(session.user);

      try {
        const data = await fetchHistories(0, session.access_token);
        setHistories(data.histories);
        setTotal(data.total);
        setOffset(LIMIT);
      } catch {
        // 조회 실패 시 빈 목록 유지
      } finally {
        setLoading(false);
      }
    })();
  }, [supabase, fetchHistories]);

  // 더 보기
  const handleLoadMore = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setLoadingMore(true);
    try {
      const data = await fetchHistories(offset, session.access_token);
      setHistories(prev => [...prev, ...data.histories]);
      setOffset(prev => prev + LIMIT);
    } finally {
      setLoadingMore(false);
    }
  };

  const hasMore = histories.length < total;

  // ─── 로딩 화면 ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-accent/40 animate-spin" style={{ animationDuration: "2s" }} />
          <Cat className="absolute inset-0 m-auto w-7 h-7 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">기록을 불러오는 중이다냥...</p>
      </div>
    );
  }

  // ─── 메인 렌더 ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

      {/* 뒤로가기 */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        홈으로
      </Link>

      {/* 프로필 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl border border-primary/20 bg-secondary/5 p-6 overflow-hidden"
      >
        {/* 배경 글로우 */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-center gap-5">
          {/* 아바타 */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <Cat className="w-8 h-8 text-primary" />
          </div>

          {/* 정보 */}
          <div className="flex-1 min-w-0 space-y-1">
            <h1 className="text-lg font-serif font-bold truncate">
              {user?.email?.split("@")?.[0]}
            </h1>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }) + " 가입"
                : ""}
            </div>
          </div>

          {/* 총 이력 수 */}
          <div className="flex-shrink-0 text-center">
            <div className="text-2xl font-bold text-secondary font-serif">{total}</div>
            <div className="text-[10px] text-muted-foreground tracking-wide">총 리딩</div>
          </div>
        </div>
      </motion.div>

      {/* 이력 섹션 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-secondary" />
          <h2 className="font-serif font-bold text-base">별빛 아래 남겨진 기억들</h2>
          {total > 0 ? (
            <span className="ml-auto text-xs text-muted-foreground">{total}개</span>
          ) : null}
        </div>

        {histories.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="space-y-3">
              {histories.map((item, i) => (
                <HistoryCard key={item.id} item={item} index={i} />
              ))}
            </div>

            {/* 더 보기 버튼 */}
            {hasMore ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center pt-2"
              >
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary/25 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-3 h-3 border border-primary/40 border-t-primary rounded-full animate-spin" />
                      불러오는 중...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      더 보기 ({total - histories.length}개 남음)
                    </>
                  )}
                </button>
              </motion.div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
