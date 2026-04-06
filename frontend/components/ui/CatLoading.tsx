"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CatLoadingProps {
  loading: boolean;
  message?: string;
}

export function CatLoading({ loading, message = "냥이가 불러오고 있다냥..." }: CatLoadingProps) {
  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          key="cat-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-background/80 backdrop-blur-sm"
        >
          <div className="relative text-6xl">
            <motion.span
              animate={{ rotate: [0, -15, 15, -15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              🐱
            </motion.span>
            <motion.span
              className="absolute -top-2 -right-4 text-2xl"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
            >
              ✨
            </motion.span>
          </div>
          <p className="text-muted-foreground animate-pulse">{message}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
