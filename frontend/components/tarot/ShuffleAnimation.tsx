"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface ShuffleAnimationProps {
    onComplete?: () => void;
    videoSrc?: string; // Optional video source if available later
}

export function ShuffleAnimation({ onComplete, videoSrc }: ShuffleAnimationProps) {
    // Removed unused state isPlaying

    useEffect(() => {
        if (!videoSrc) {
            // If no video, simulate shuffle duration
            const timer = setTimeout(() => {
                onComplete?.();
            }, 3000); // 3 seconds animation
            return () => clearTimeout(timer);
        }
    }, [onComplete, videoSrc]);

    if (videoSrc) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                <video
                    src={videoSrc}
                    autoPlay
                    muted
                    playsInline
                    onEnded={() => {
                        onComplete?.();
                    }}
                    className="w-full h-full object-contain"
                />
            </div>
        );
    }

    // CSS/Framer Motion Fallback Animation
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
            <div className="relative w-48 h-72">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-xl border-2 border-primary/50 bg-indigo-950 shadow-xl"
                        initial={{ x: 0, y: 0, rotate: 0 }}
                        animate={{
                            x: [0, 50, -50, 0],
                            y: [0, -20, 20, 0],
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 0.5,
                            repeat: 5,
                            delay: i * 0.1,
                            ease: "easeInOut",
                        }}
                        style={{
                            zIndex: i,
                        }}
                    >
                        <div className="absolute inset-2 border border-secondary/20 rounded-lg" />
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full border border-secondary/30" />
                        </div>
                    </motion.div>
                ))}
            </div>
            <p className="mt-8 text-xl font-serif text-secondary animate-pulse">
                Shuffling Cards...
            </p>
        </div>
    );
}
