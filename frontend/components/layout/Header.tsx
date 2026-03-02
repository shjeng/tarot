import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Mystic Tarot
                    </span>
                </Link>

                <nav className="hidden md:flex gap-6 items-center">
                    <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                        홈
                    </Link>
                    <Link href="/daily" className="text-sm font-medium transition-colors hover:text-primary">
                        오늘의 운세
                    </Link>
                    <Link href="/reading" className="text-sm font-medium transition-colors hover:text-primary">
                        AI 타로 점
                    </Link>
                </nav>

                {/* Mobile menu trigger placeholder - can be implemented later with Sheet component */}
                <button className="md:hidden p-2 text-primary">
                    <span className="sr-only">Toggle menu</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                </button>
            </div>
        </header>
    );
}
