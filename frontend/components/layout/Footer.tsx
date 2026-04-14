import { Cat } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full border-t border-primary/20 bg-background py-6">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left flex items-center gap-1.5">
                    <Cat className="h-3.5 w-3.5" />
                    © 2026 고양이 점술관. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                    {/* 이용약관 및 개인정보처리방침 링크 */}
                    <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        이용약관
                    </Link>
                    <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        개인정보처리방침
                    </Link>
                    <span className="text-xs text-muted-foreground">ghsmsl20@gmail.com</span>
                </div>
            </div>
        </footer>
    );
}
