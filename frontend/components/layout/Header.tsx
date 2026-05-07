import Link from 'next/link';
import { Cat } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { MobileMenu } from '@/components/layout/MobileMenu';

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative container mx-auto flex h-16 items-center justify-between px-4">
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
            고양이 타로 상담
          </Link>
          <Link href="/cards" className="text-sm font-medium transition-colors hover:text-primary">
            타로 카드 도감
          </Link>
          {user ? (
            <>
              <Link href="/mypage" className="text-sm font-medium transition-colors hover:text-primary">
                마이페이지
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-1.5 rounded-full border border-primary/40 hover:bg-primary/10 transition-colors"
            >
              로그인
            </Link>
          )}
        </nav>

        <MobileMenu isLoggedIn={!!user} />
      </div>
    </header>
  );
}
