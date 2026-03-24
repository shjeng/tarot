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
    const [birthDate, setBirthDate] = useState("");
    const [birthTime, setBirthTime] = useState("");
    const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
    const [cards, setCards] = useState<TarotCard[]>([]);
    const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
    const [readingResult, setReadingResult] = useState<string>("");

    const startReading = () => {
        if (!question.trim() || !birthDate || !gender) return;
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
            const response = await fetch("/api/tarot/spread", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cards: pickedCards,
                    question: question,
                    birthDate: birthDate,
                    birthTime: birthTime || null,
                    gender: gender
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

                        {/* 사주 정보 입력 */}
                        <div className="w-full flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-muted-foreground font-medium">생년월일 <span className="text-accent">*</span></label>
                                <input
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    max={new Date().toISOString().split("T")[0]}
                                    min="1900-01-01"
                                    className="w-full p-4 rounded-xl bg-secondary/5 border border-primary/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none text-base transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-muted-foreground font-medium">태어난 시각 <span className="text-muted-foreground/60">(선택)</span></label>
                                <input
                                    type="time"
                                    value={birthTime}
                                    onChange={(e) => setBirthTime(e.target.value)}
                                    className="w-full p-4 rounded-xl bg-secondary/5 border border-primary/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none text-base transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-muted-foreground font-medium">성별 <span className="text-accent">*</span></label>
                                <div className="flex gap-3">
                                    {([["male", "남성"], ["female", "여성"], ["other", "기타"]] as const).map(([val, label]) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => setGender(val)}
                                            className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${gender === val ? "border-accent bg-accent/20 text-accent" : "border-primary/20 bg-secondary/5 text-muted-foreground hover:border-accent/50"}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

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
                            disabled={!question.trim() || !birthDate || !gender}
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
                        className="flex flex-col items-center gap-10 w-full max-w-xl px-6"
                    >
                        {/* 안내 텍스트 */}
                        <div className="text-center space-y-1.5">
                            <p className="text-[10px] tracking-[0.35em] text-white/25 uppercase">
                                {selectedCards.length} / 3
                            </p>
                            <h2 className="text-lg font-light tracking-wide text-white/75">
                                {[
                                    '과거를 나타내는 카드를 고르세요',
                                    '현재를 나타내는 카드를 고르세요',
                                    '미래를 나타내는 카드를 고르세요',
                                ][selectedCards.length]}
                            </h2>
                        </div>

                        {/* 선택 슬롯 */}
                        <div className="flex gap-5 justify-center">
                            {[
                                { en: 'PAST', ko: '과거' },
                                { en: 'PRESENT', ko: '현재' },
                                { en: 'FUTURE', ko: '미래' },
                            ].map(({ en, ko }, i) => {
                                const filled = i < selectedCards.length;
                                const active = i === selectedCards.length;
                                return (
                                    <div key={i} className="flex flex-col items-center gap-2.5">
                                        <motion.div
                                            className={`w-[66px] h-[105px] rounded-md border flex items-center justify-center transition-all duration-500 ${
                                                filled
                                                    ? 'border-violet-400/40 bg-violet-950/30 shadow-[0_0_20px_rgba(139,92,246,0.12)]'
                                                    : active
                                                    ? 'border-white/18 bg-white/[0.025]'
                                                    : 'border-white/6 bg-transparent'
                                            }`}
                                        >
                                            {filled ? (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.6 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                                                    className="text-center px-1.5"
                                                >
                                                    <p className="text-violet-300 text-base mb-1">✦</p>
                                                    <p className="text-[9px] leading-tight text-violet-200/60 font-medium">
                                                        {selectedCards[i].nameKo}
                                                    </p>
                                                </motion.div>
                                            ) : active ? (
                                                <motion.span
                                                    animate={{ opacity: [0.15, 0.5, 0.15] }}
                                                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                                                    className="text-white/40 text-lg"
                                                >✦</motion.span>
                                            ) : null}
                                        </motion.div>
                                        <div className="text-center space-y-0.5">
                                            <p className={`text-[8px] tracking-[0.25em] font-semibold transition-colors duration-400 ${
                                                filled ? 'text-violet-400/80' : active ? 'text-white/25' : 'text-white/10'
                                            }`}>{en}</p>
                                            <p className={`text-[11px] transition-colors duration-400 ${
                                                filled ? 'text-white/45' : active ? 'text-white/20' : 'text-white/10'
                                            }`}>{ko}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 구분선 */}
                        <div className="w-full flex items-center gap-4">
                            <div className="flex-1 h-px bg-white/6" />
                            <span className="text-[9px] tracking-[0.3em] text-white/15 uppercase">deck</span>
                            <div className="flex-1 h-px bg-white/6" />
                        </div>

                        {/* 카드 그리드 */}
                        <div className="grid grid-cols-7 gap-2 w-full">
                            {cards.map((card, index) => {
                                const isSelected = !!selectedCards.find(c => c.id === card.id);
                                return (
                                    <motion.button
                                        key={card.id}
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{
                                            opacity: isSelected ? 0 : 1,
                                            y: 0,
                                            scale: isSelected ? 0.75 : 1,
                                            pointerEvents: isSelected ? 'none' : 'auto',
                                        }}
                                        whileHover={!isSelected ? { y: -10, scale: 1.06 } : {}}
                                        transition={{
                                            delay: isSelected ? 0 : index * 0.028,
                                            type: 'spring',
                                            stiffness: 260,
                                            damping: 22,
                                        }}
                                        onClick={() => !isSelected && handleCardPick(card)}
                                        disabled={isSelected}
                                        className="relative group focus:outline-none"
                                    >
                                        {/* 글로우 */}
                                        <div className="absolute -inset-1.5 rounded-lg bg-violet-500/0 group-hover:bg-violet-500/12 blur-xl transition-all duration-400 pointer-events-none" />
                                        {/* 카드 */}
                                        <div className="relative w-full aspect-[5/8] rounded-[5px] border border-white/[0.07] group-hover:border-violet-400/35 bg-gradient-to-b from-[#14092b] to-[#0a0618] flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_4px_20px_rgba(139,92,246,0.15)]">
                                            <span className="text-white/[0.07] group-hover:text-violet-300/45 text-xs transition-all duration-300">✦</span>
                                        </div>
                                    </motion.button>
                                );
                            })}
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
