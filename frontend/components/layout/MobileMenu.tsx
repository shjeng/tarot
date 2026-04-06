"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";

interface MobileMenuProps {
  isLoggedIn: boolean;
}

export function MobileMenu({ isLoggedIn }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      {/* 햄버거 버튼 */}
      <button
        onClick={() => setOpen(v => !v)}
        className="p-2 text-primary rounded-md hover:bg-primary/10 transition-colors"
        aria-label="메뉴 열기"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* 드롭다운 메뉴 */}
      <AnimatePresence>
        {open && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            {/* 메뉴 패널 */}
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 z-50 border-b border-primary/20 bg-background/95 backdrop-blur px-4 py-4 flex flex-col gap-1"
            >
              <Link href="/" onClick={close}
                className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                홈
              </Link>
              <Link href="/daily" onClick={close}
                className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                오늘의 운세
              </Link>
              <Link href="/reading" onClick={close}
                className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                고양이 타로 상담
              </Link>
              {isLoggedIn ? (
                <>
                  <Link href="/mypage" onClick={close}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                    마이페이지
                  </Link>
                  <div className="px-3 py-1">
                    <LogoutButton />
                  </div>
                </>
              ) : (
                <Link href="/login" onClick={close}
                  className="mx-3 mt-1 py-2 rounded-full border border-primary/40 text-sm font-medium text-center hover:bg-primary/10 transition-colors">
                  로그인
                </Link>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
