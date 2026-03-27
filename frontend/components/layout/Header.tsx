import Link from 'next/link';
import { Cat } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/auth/LogoutButton';

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex flex-shrink-0 items-center gap-2 transition-opacity hover:opacity-80">
          <Cat className="h-5 w-5 flex-shrink-0 text-primary" />
          <span className="text-base sm:text-xl font-bold font-serif whitespace-nowrap bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            고양이 점술관
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
          {user ? (
            <LogoutButton />
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-1.5 rounded-full border border-primary/40 hover:bg-primary/10 transition-colors"
            >
              로그인
            </Link>
          )}
        </nav>

        <button className="md:hidden p-2 text-primary">
          <span className="sr-only">Toggle menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
        </button>
      </div>
    </header>
  );
}
