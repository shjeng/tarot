"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tarotCards, TarotCard } from "@/data/tarotCards";
import { Card } from "@/components/tarot/Card";
import { ShuffleAnimation } from "@/components/tarot/ShuffleAnimation";
import { shuffleArray } from "@/lib/shuffle";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

type Step = "intro" | "shuffling" | "picking" | "analyzing" | "result";

export default function DailyPage() {
    const [step, setStep] = useState<Step>("intro");
    const [cards, setCards] = useState<TarotCard[]>([]);
    const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [readingResult, setReadingResult] = useState<string>("");

    const startShuffle = () => {
        setStep("shuffling");
    };

    const handleShuffleComplete = () => {
        // Shuffle and take top 22 (or just enough for visual spread)
        // For visual effect, we might show a fan of cards.
        // Let's just shuffle the whole deck logic-wise, but render a few for picking.
        const shuffled = shuffleArray(tarotCards);
        setCards(shuffled);
        setStep("picking");
    };

    const handleCardPick = async (card: TarotCard) => {
        setSelectedCard(card);
        setStep("analyzing");

        try {
            const response = await fetch("http://localhost:5000/api/tarot/daily", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ card })
            });
            const data = await response.json();
            if (data.reading) {
                setReadingResult(data.reading);
            } else {
                setReadingResult("죄송합니다. 운세를 읽어내지 못했습니다.");
            }
        } catch (e) {
            console.error(e);
            setReadingResult("네트워크 오류가 발생했습니다.");
        }

        setStep("result");
        setTimeout(() => setIsFlipped(true), 100);
    };

    const reset = () => {
        setStep("intro");
        setSelectedCard(null);
        setIsFlipped(false);
        setCards([]);
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
                <div className="w-20" /> {/* Spacer */}
            </div>

            <AnimatePresence mode="wait">
                {step === "intro" && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center text-center gap-6"
                    >
                        <div className="p-8 rounded-full bg-primary/10 mb-4">
                            <div className="text-6xl">🔮</div>
                        </div>
                        <h2 className="text-3xl font-bold">오늘 하루를 위한 조언</h2>
                        <p className="text-muted-foreground max-w-md break-keep">
                            마음을 비우고 편안하게 집중하세요. <br />
                            오늘 하루 당신에게 필요한 조언을 카드가 알려줄 것입니다.
                            준비가 되셨다면 아래 버튼을 눌러주세요.
                        </p>
                        <button
                            onClick={startShuffle}
                            className="mt-8 px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/40 transform hover:scale-105"
                        >
                            카드 셔플하기
                        </button>
                    </motion.div>
                )}

                {step === "shuffling" && (
                    <motion.div key="shuffling" exit={{ opacity: 0 }}>
                        <ShuffleAnimation onComplete={handleShuffleComplete} />
                    </motion.div>
                )}

                {step === "picking" && (
                    <motion.div
                        key="picking"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-8 w-full"
                    >
                        <h2 className="text-2xl font-bold animate-pulse">카드를 한 장 선택하세요</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 max-w-6xl py-8 px-4">
                            {/* Render all cards in a grid */}
                            {cards.map((card, index) => (
                                <motion.div
                                    key={card.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="cursor-pointer hover:-translate-y-2 hover:shadow-lg transition-transform duration-300"
                                    onClick={() => handleCardPick(card)}
                                >
                                    <Card id={card.id} width={100} height={160} />
                                </motion.div>
                            ))}
                        </div>
                        <p className="text-muted-foreground text-sm">직관을 믿으세요.</p>
                    </motion.div>
                )}

                {step === "analyzing" && (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center gap-8 py-20"
                    >
                        <div className="animate-spin text-5xl">🔮</div>
                        <h2 className="text-2xl font-bold">오늘의 기운을 읽고 있습니다...</h2>
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
                                width={280}
                                height={460}
                                className="shadow-2xl shadow-primary/30"
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
                                    <h4 className="font-bold text-secondary mb-1">키워드</h4>
                                    <p className="text-sm">{selectedCard.meaningUpright}</p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-lg mb-2">오늘의 조언</h4>
                                    <div className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                        {readingResult || selectedCard.desc}
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                                className="mt-4"
                            >
                                <button
                                    onClick={reset}
                                    className="flex items-center gap-2 px-6 py-2 rounded-lg border border-primary/50 hover:bg-primary/10 transition-colors mx-auto md:mx-0"
                                >
                                    <RotateCcw className="w-4 h-4" /> 다시 뽑기
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
