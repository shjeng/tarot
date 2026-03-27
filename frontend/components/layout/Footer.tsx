import { Cat } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full border-t border-primary/20 bg-background py-6">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left flex items-center gap-1.5">
                    <Cat className="h-3.5 w-3.5" />
                    © 2026 고양이 점술관. All rights reserved.
                </p>
                <div className="flex gap-4">
                    <span className="text-xs text-muted-foreground">ghsmsl20@gmail.com</span>
                </div>
            </div>
        </footer>
    );
}
