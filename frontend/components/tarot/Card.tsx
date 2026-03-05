"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CardProps {
    id: string | number;
    isFlipped?: boolean;
    frontImage?: string;
    name?: string;
    onClick?: () => void;
    className?: string;
    width?: number;
    height?: number;
    disabled?: boolean;
}

export function Card({
    // id prop is not used in the DOM but kept in interface
    isFlipped = false,
    frontImage,
    name,
    onClick,
    className,
    width = 200,
    height = 340,
    disabled = false,
}: CardProps) {
    return (
        <div
            className={cn(
                "relative perspective-1000",
                "w-[80px] h-[130px] sm:w-[100px] sm:h-[160px] md:w-[150px] md:h-[240px] lg:w-[200px] lg:h-[340px]",
                className
            )}
            style={{
                // Inline styles act as fallback or default if custom width/height are explicitly passed and not handled by tailwind classes
                ...(width !== 200 ? { width } : {}),
                ...(height !== 340 ? { height } : {})
            }}
            onClick={!disabled ? onClick : undefined}
        >
            <motion.div
                className="w-full h-full relative preserve-3d cursor-pointer transition-shadow hover:shadow-xl hover:shadow-primary/20 rounded-xl"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Card Back (Mystical Design) */}
                <div
                    className="absolute inset-0 backface-hidden rounded-xl border-2 border-secondary/30 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {/* Decorative Pattern (CSS only for now) */}
                    <div className="absolute inset-2 border border-secondary/20 rounded-lg opacity-50" />
                    <div className="absolute inset-4 border border-secondary/10 rounded-lg opacity-30" />
                    <div className="w-16 h-16 rounded-full border-2 border-secondary/40 flex items-center justify-center">
                        <div className="w-10 h-10 rotate-45 border border-secondary/30" />
                    </div>
                    <div className="absolute bottom-4 text-secondary/40 text-xs tracking-[0.2em] font-serif">
                        MYSTIC
                    </div>
                </div>

                {/* Card Front */}
                <div
                    className="absolute inset-0 backface-hidden rounded-xl bg-white border-2 border-secondary/50 overflow-hidden flex flex-col"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)"
                    }}
                >
                    {frontImage ? (
                        <div className="relative w-full h-full">
                            {/* Use Next.js Image if valid src, otherwise fallback or standard img */}
                            <Image
                                src={frontImage}
                                alt={name || "Tarot Card"}
                                fill
                                className="object-contain" // object-cover에서 object-contain으로 변경하여 이미지가 잘리지 않게 함
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-100 text-slate-800">
                            <span className="font-serif text-xl font-bold text-center">{name}</span>
                            <p className="text-xs text-muted-foreground mt-2">Image Placeholder</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
