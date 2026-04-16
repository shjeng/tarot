"use client";

import { useState, useMemo, useEffect } from "react";
import { Share2, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createPortal } from "react-dom";

interface ShareButtonProps {
  // 로그인한 경우 공유 링크 생성에 사용할 히스토리 ID
  historyId: string | null;
  // 비로그인 사용자 또는 링크 생성 실패 시 텍스트로 공유할 내용
  fallbackText?: string;
  className?: string;
  variant?: "icon" | "text";
}

// ─── 토스트 컴포넌트 ─────────────────────────────────────────────────────────

function CopyToast({ visible }: { visible: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-background text-sm font-medium shadow-lg">
        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
        링크를 복사했다냥!
      </div>
    </div>,
    document.body
  );
}

/**
 * 타로 리딩 결과를 공유하는 버튼.
 * - historyId가 있으면 공개 공유 링크를 생성해 공유
 * - historyId가 없으면 fallbackText를 텍스트로 공유
 * - Web Share API 미지원 환경에서는 클립보드에 복사
 */
export function ShareButton({ historyId, fallbackText, className = "", variant = "text" }: ShareButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "copied">("idle");
  const supabase = useMemo(() => createClient(), []);

  const handleShare = async () => {
    if (status !== "idle") return;
    setStatus("loading");

    let copied = false;
    try {
      let shareUrl: string | null = null;
      const shareText: string | null = fallbackText ?? null;

      // 히스토리 ID가 있으면 공유 링크 생성
      if (historyId) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const res = await fetch(`/api/tarot/history/${historyId}/share`, {
            method: "POST",
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
          if (res.ok) {
            const { shareToken } = await res.json();
            shareUrl = `${window.location.origin}/share/${shareToken}`;
          }
        }
      }

      // 클립보드 복사
      const content = shareUrl ?? shareText ?? window.location.href;
      await navigator.clipboard.writeText(content);
      copied = true;
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      // 사용자가 취소하거나 오류 발생 시 무시
    } finally {
      if (!copied) setStatus("idle");
    }
  };

  if (variant === "icon") {
    return (
      <>
        <CopyToast visible={status === "copied"} />
        <button
        onClick={handleShare}
        disabled={status === "loading"}
        title="공유하기"
        className={`flex items-center justify-center w-8 h-8 rounded-full border border-primary/40 bg-primary/5 hover:border-primary/70 hover:bg-primary/15 transition-all disabled:opacity-50 ${className}`}
      >
        {status === "loading" ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
        ) : status === "copied" ? (
          <Check className="w-3.5 h-3.5 text-green-400" />
        ) : (
          <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>
      </>
    );
  }

  return (
    <>
      <CopyToast visible={status === "copied"} />
      <button
        onClick={handleShare}
        disabled={status === "loading"}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 text-sm text-muted-foreground hover:text-foreground hover:border-primary/60 hover:bg-primary/5 transition-all disabled:opacity-50 ${className}`}
      >
        {status === "loading" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : status === "copied" ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
        {status === "copied" ? "링크 복사됨!" : "공유하기"}
      </button>
    </>
  );
}
