"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tarotCards, TarotCard } from "@/data/tarotCards";
import { Card } from "@/components/tarot/Card";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { ShareButton } from "@/components/ui/ShareButton";

type Step = "intro" | "orb" | "result";

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export default function DailyClient() {
    const [step, setStep] = useState<Step>("intro");
    const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [readingResult, setReadingResult] = useState<string>("");
    const [historyId, setHistoryId] = useState<string | null>(null);
    const supabase = useMemo(() => createClient(), []);
    const abortRef = useRef<AbortController | null>(null);
    const isRunningRef = useRef(false);

    // 최소 거리 보장 알고리즘으로 22장 위치 고정 (리렌더 시 불변)
    const cardPositions = useMemo(() => {
        const positions: { x: number; y: number; r: number }[] = [];
        const MIN_DIST = 12;
        for (let i = 0; i < tarotCards.length; i++) {
            let x: number, y: number;
            let attempts = 0;
            do {
                x = 5 + ((i * 37 + 13 + attempts * 7) % 80);
                y = 5 + ((i * 53 + 7 + attempts * 11) % 80);
                attempts++;
            } while (
                attempts < 30 &&
                positions.some(p => Math.hypot(p.x - x, p.y - y) < MIN_DIST)
            );
            positions.push({ x, y, r: -25 + ((i * 29) % 51) });
        }
        return positions;
    }, []);

    const fetchReading = async (card: TarotCard, signal: AbortSignal): Promise<void> => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch("/api/tarot/daily", {
                method: "POST",
                signal,
                headers: {
                    "Content-Type": "application/json",
                    ...(session ? { "Authorization": `Bearer ${session.access_token}` } : {}),
                },
                body: JSON.stringify({ card }),
            });
            if (signal.aborted) return;
            if (!response.ok) {
                console.error("API error:", response.status);
                setReadingResult(card.desc);
                return;
            }
            const data = await response.json();
            setReadingResult(data.reading || card.desc);
            if (data.historyId) setHistoryId(data.historyId);
        } catch (e) {
            if (signal.aborted) return;
            setReadingResult(card.desc);
        }
    };

    const handleCardSelect = async (card: TarotCard) => {
        if (isRunningRef.current) return;
        isRunningRef.current = true;

        const controller = new AbortController();
        abortRef.current = controller;
        setSelectedCard(card);

        setStep("orb");

        await Promise.all([
            fetchReading(card, controller.signal),
            sleep(1500),
        ]).catch(() => []);

        if (controller.signal.aborted) return;
        setStep("result");
        isRunningRef.current = false;
    };

    useEffect(() => {
        if (step === "result") {
            const t = setTimeout(() => setIsFlipped(true), 100);
            return () => clearTimeout(t);
        }
    }, [step]);

    const reset = () => {
        abortRef.current?.abort();
        isRunningRef.current = false;
        setStep("intro");
        setSelectedCard(null);
        setIsFlipped(false);
        setReadingResult("");
        setHistoryId(null);
    };

    return (
        <div className="flex flex-col items-center min-h-[80vh] py-8">
            <div className="w-full max-w-4xl px-4 flex justify-between items-center mb-8">
                <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> 홈으로
                </Link>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    오늘의 운세
                </h1>
                <div className="w-20" />
            </div>

            <AnimatePresence mode="wait">
                {step === "intro" && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-4xl"
                    >
                        <p className="text-center text-muted-foreground text-sm mb-4">
                            이끌리는 카드를 한 장 골라보세냥 🐾
                        </p>
                        {/* velvet 테이블 */}
                        <div
                            className="relative w-full rounded-2xl overflow-hidden h-[320px] sm:h-[380px] md:h-[460px]"
                            style={{
                                background: "radial-gradient(ellipse at 50% 30%, #2d1b4e 0%, #1a0a2e 40%, #0d0718 100%)",
                                boxShadow: "inset 0 0 80px rgba(0,0,0,0.6)",
                            }}
                        >
                            {/* 비네트 오버레이 */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
                                }}
                            />
                            {/* 22장 카드 */}
                            {tarotCards.map((card, i) => (
                                <motion.button
                                    key={card.id}
                                    aria-label={`카드 ${i + 1} 선택`}
                                    className="absolute focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                                    style={{
                                        left: `${cardPositions[i].x}%`,
                                        top: `${cardPositions[i].y}%`,
                                        rotate: cardPositions[i].r,
                                        translateX: "-50%",
                                        translateY: "-50%",
                                    }}
                                    whileHover={{
                                        y: -10,
                                        scale: 1.1,
                                        boxShadow: "0 0 20px rgba(139,92,246,0.6)",
                                        zIndex: 50,
                                        transition: { duration: 0.15 },
                                    }}
                                    onClick={() => handleCardSelect(card)}
                                >
                                    <Card
                                        id={card.id}
                                        className="!w-[52px] !h-[84px] pointer-events-none"
                                    />
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === "orb" && (
                    <motion.div
                        key="orb"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-8 py-8"
                    >
                        <p className="text-muted-foreground text-sm">
                            냥이가 카드를 읽고 있다냥...
                        </p>

                        {/* 수정구 */}
                        <div className="relative flex items-center justify-center">
                            {/* 외부 회전 링 */}
                            <motion.div
                                className="absolute rounded-full border border-violet-400/30"
                                style={{ width: 240, height: 240 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                                className="absolute rounded-full border border-purple-300/20"
                                style={{ width: 210, height: 210 }}
                                animate={{ rotate: -360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />

                            {/* 구체 — 등장 wrapper */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                {/* pulse inner */}
                                <motion.div
                                    className="relative rounded-full"
                                    style={{
                                        width: 176,
                                        height: 176,
                                        background: "radial-gradient(circle at 35% 35%, #e9d5ff, #7c3aed 40%, #1e1b4b 70%, #0a0618)",
                                        boxShadow: "0 0 60px 20px rgba(139,92,246,0.35), inset 0 0 30px rgba(255,255,255,0.08)",
                                    }}
                                    animate={{ scale: [1, 1.07, 1], opacity: [0.9, 1, 0.9] }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <div
                                        className="absolute rounded-full bg-white/20"
                                        style={{ width: 48, height: 32, top: 28, left: 32, filter: "blur(6px)" }}
                                    />
                                </motion.div>
                            </motion.div>
                        </div>

                        <p className="text-violet-300/70 text-xs animate-pulse">
                            {selectedCard?.nameKo} 카드의 기운을 읽는 중...
                        </p>
                    </motion.div>
                )}

                {step === "result" && selectedCard && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 max-w-4xl"
                    >
                        <div className="flex-shrink-0">
                            <Card
                                id={selectedCard.id}
                                isFlipped={isFlipped}
                                frontImage={selectedCard.image}
                                name={selectedCard.name}
                                className="shadow-2xl shadow-primary/30 w-[180px] h-[300px] md:w-[280px] md:h-[460px] lg:w-[320px] lg:h-[520px]"
                            />
                        </div>

                        <div className="flex flex-col gap-6 text-center md:text-left">
                            <div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-3xl md:text-4xl font-bold text-primary mb-2"
                                >
                                    {selectedCard.nameKo}
                                </motion.h2>
                                <motion.h3
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="text-xl text-muted-foreground"
                                >
                                    {selectedCard.name}
                                </motion.h3>
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="space-y-4"
                            >
                                <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                                    <h4 className="font-bold text-secondary mb-1">냥이가 읽은 키워드</h4>
                                    <p className="text-sm">{selectedCard.meaningUpright}</p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-lg mb-2">냥이의 조언</h4>
                                    <div className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                        {readingResult || <span className="animate-pulse">조언을 불러오는 중이다냥...</span>}
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                                className="mt-4 flex items-center gap-3 mx-auto md:mx-0"
                            >
                                <button
                                    onClick={reset}
                                    className="flex items-center gap-2 px-6 py-2 rounded-lg border border-primary/50 hover:bg-primary/10 transition-colors"
                                >
                                    <RotateCcw className="w-4 h-4" /> 다시 뽑기
                                </button>
                                <ShareButton
                                    historyId={historyId}
                                    fallbackText={readingResult}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
