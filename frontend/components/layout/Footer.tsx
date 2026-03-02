export function Footer() {
    return (
        <footer className="w-full border-t border-primary/20 bg-background py-6">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © 2026 Mystic Tarot. All rights reserved.
                </p>
                <div className="flex gap-4">
                    <span className="text-xs text-muted-foreground">Powered by Gemini Pro</span>
                </div>
            </div>
        </footer>
    );
}
