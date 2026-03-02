"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tarotCards, TarotCard } from "@/data/tarotCards";
import { Card } from "@/components/tarot/Card";
import { shuffleArray } from "@/lib/shuffle";
import Link from "next/link";
import { ArrowLeft, Sparkles, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Define reading state in a context or pass via query/state manager in a real app. 
// For simplicity, we might show results on the same page or pass via URL params (limited).
// Better approach for large response: Use client state if staying on same page or Context API.
// Let's implement steps: Input -> Shuffle -> Pick 3 -> Loading AI -> Result Layout

type Step = "input" | "shuffling" | "picking" | "analyzing" | "result";

export default function ReadingPage() {
    const [step, setStep] = useState<Step>("input");
    const [question, setQuestion] = useState("");
    const [cards, setCards] = useState<TarotCard[]>([]);
    const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
    const [readingResult, setReadingResult] = useState<string>("");

    const startReading = () => {
        if (!question.trim()) return;
        const shuffled = shuffleArray(tarotCards);
        setCards(shuffled);
        setStep("picking");
    };

    const handleCardPick = (card: TarotCard) => {
        if (selectedCards.find(c => c.id === card.id)) return;

        const newSelection = [...selectedCards, card];
        setSelectedCards(newSelection);

        if (newSelection.length === 3) {
            setStep("analyzing");
            fetchReading(newSelection);
        }
    };

    const fetchReading = async (pickedCards: TarotCard[]) => {
        try {
            const response = await fetch("http://localhost:5000/api/tarot/spread", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cards: pickedCards,
                    question: question
                })
            });

            const data = await response.json();
            if (data.reading) {
                setReadingResult(data.reading);
                setStep("result");
            } else {
                // Handle error (mock for now or alert)
                // Ensure to handle API failures gracefully
                console.error("API Error", data);
                setReadingResult("죄송합니다. AI가 운세를 읽어내지 못했습니다. 다시 시도해주세요.");
                setStep("result");
            }
        } catch (e) {
            console.error(e);
            setReadingResult("네트워크 오류가 발생했습니다.");
            setStep("result");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-[80vh] py-8">
            <div className="w-full max-w-4xl px-4 flex justify-between items-center mb-8">
                <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> 홈으로
                </Link>
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
                        AI 타로 상담
                    </h1>
                </div>
                <div className="w-20" /> {/* Spacer */}
            </div>

            <AnimatePresence mode="wait">
                {step === "input" && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center text-center gap-8 max-w-lg w-full px-4"
                    >
                        <h2 className="text-3xl font-bold">무엇이 고민이신가요?</h2>
                        <p className="text-muted-foreground break-keep">
                            구체적으로 질문할수록 더 정확한 답변을 얻을 수 있습니다. <br />
                            예: &quot;이직을 하는 것이 좋을까요?&quot;, &quot;그 사람의 속마음이 궁금해요.&quot;
                        </p>

                        <div className="w-full relative">
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="고민을 적어주세요..."
                                className="w-full p-6 rounded-2xl bg-secondary/5 border border-primary/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none min-h-[150px] resize-none text-lg transition-all"
                            />
                        </div>

                        <button
                            onClick={startReading}
                            disabled={!question.trim()}
                            className="flex items-center gap-2 px-10 py-4 rounded-full bg-accent text-accent-foreground font-bold text-lg hover:bg-accent/90 transition-all shadow-lg hover:shadow-accent/40 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                        >
                            <Send className="w-5 h-5" /> 상담 시작하기
                        </button>
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
                        <div className="text-center">
                            <h2 className="text-2xl font-bold animate-pulse">
                                {selectedCards.length === 0 && "과거: 첫 번째 카드를 선택하세요"}
                                {selectedCards.length === 1 && "현재: 두 번째 카드를 선택하세요"}
                                {selectedCards.length === 2 && "미래: 마지막 카드를 선택하세요"}
                            </h2>
                            <p className="text-muted-foreground mt-2">{selectedCards.length} / 3 장 선택됨</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-[-5rem] max-w-6xl overflow-hidden py-12 px-4 perspective-1000">
                            {cards.slice(0, 15).map((card, index) => {
                                const isSelected = selectedCards.find(c => c.id === card.id);
                                if (isSelected) return null; // Hide picked cards from deck

                                return (
                                    <motion.div
                                        key={card.id}
                                        initial={{ opacity: 0, x: -50, rotate: -5 }}
                                        animate={{ opacity: 1, x: 0, rotate: (index - 7) * 3 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="relative -ml-16 first:ml-0 cursor-pointer hover:-translate-y-6 hover:z-20 transition-transform duration-300"
                                        style={{ zIndex: index }}
                                        onClick={() => handleCardPick(card)}
                                    >
                                        <Card id={card.id} />
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Display selected cards placeholder */}
                        <div className="flex gap-4 mt-8">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className={`w-24 h-40 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors ${i < selectedCards.length ? 'border-accent bg-accent/20' : 'border-slate-700'}`}>
                                    {i < selectedCards.length ? (
                                        <span className="text-2xl">🎴</span>
                                    ) : (
                                        <span className="text-slate-700 text-sm">{['과거', '현재', '미래'][i]}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === "analyzing" && (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center gap-8 py-20"
                    >
                        <div className="relative w-32 h-32">
                            <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
                            <div className="absolute inset-2 rounded-full border-4 border-accent/50 animate-spin" style={{ animationDuration: '3s' }} />
                            <div className="absolute inset-0 flex items-center justify-center text-4xl">✨</div>
                        </div>
                        <h2 className="text-2xl font-bold text-center">
                            AI가 카드를 읽고 있습니다...
                        </h2>
                        <p className="text-muted-foreground text-center animate-pulse">
                            당신의 운명, 그리고 {question}에 대한 해답.
                        </p>
                    </motion.div>
                )}

                {step === "result" && (
                    <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            {selectedCards.map((card, idx) => (
                                <div key={card.id} className="flex flex-col items-center gap-4">
                                    <span className="text-sm font-bold text-accent px-3 py-1 rounded-full bg-accent/10">
                                        {['PAST (과거)', 'PRESENT (현재)', 'FUTURE (미래)'][idx]}
                                    </span>
                                    <Card
                                        id={card.id}
                                        frontImage={card.image}
                                        name={card.name}
                                        isFlipped={true}
                                    />
                                    <div className="text-center">
                                        <h3 className="font-bold text-lg">{card.nameKo}</h3>
                                        <p className="text-xs text-muted-foreground">{card.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-secondary/5 rounded-3xl p-8 border border-secondary/20 shadow-xl">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Sparkles className="text-accent" />
                                AI 분석 결과
                            </h3>
                            <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-primary-foreground text-gray-300">
                                <ReactMarkdown>
                                    {readingResult}
                                </ReactMarkdown>
                            </div>
                        </div>

                        <div className="flex justify-center mt-12 mb-8">
                            <Link href="/" className="px-8 py-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all">
                                다른 고민 상담하기
                            </Link>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
