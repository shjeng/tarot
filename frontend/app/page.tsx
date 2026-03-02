"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Moon, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center gap-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-4"
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Sparkles className="w-12 h-12 text-secondary animate-pulse" />
            <Star className="w-6 h-6 text-accent absolute top-0 -right-4 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-foreground via-accent-foreground to-primary-foreground bg-clip-text text-transparent pb-2">
          미스틱 타로
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto break-keep">
          카드의 지혜로 당신의 운명을 확인해보세요. <br />
          AI가 당신의 고민을 들어주고 길을 안내합니다.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4"
      >
        <Link href="/daily" className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-background/50 hover:bg-primary/10 transition-all p-8 flex flex-col items-center gap-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20">
          <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Moon className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
          </div>
          <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">오늘의 운세</h2>
          <p className="text-sm text-muted-foreground">하루를 시작하기 전 한 장의 카드로 알아보세요.</p>
        </Link>

        <Link href="/reading" className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-background/50 hover:bg-primary/10 transition-all p-8 flex flex-col items-center gap-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20">
          <div className="p-4 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
            <Sparkles className="w-8 h-8 text-accent group-hover:text-primary transition-colors" />
          </div>
          <h2 className="text-2xl font-bold group-hover:text-accent transition-colors">AI 타로 상담</h2>
          <p className="text-sm text-muted-foreground">당신의 고민에 대해 3장의 카드로 조언을 구하세요.</p>
        </Link>
      </motion.div>
    </div>
  );
}
