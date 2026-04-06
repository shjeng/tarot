import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PATHS = ['/reading', '/daily', '/onboarding', '/mypage']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setAll(cookiesToSet: any[]) {
        cookiesToSet.forEach((cookie) =>
          request.cookies.set(cookie.name, cookie.value)
        )
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach((cookie) =>
          supabaseResponse.cookies.set(cookie.name, cookie.value, cookie.options)
        )
      },
    },
  })

  // getSession(): 쿠키에서 읽기만 하므로 네트워크 요청 없음
  const { data: { session } } = await supabase.auth.getSession()
  const pathname = request.nextUrl.pathname

  // 보호된 경로에 비로그인 접근 → /login으로 리다이렉트
  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p))
  if (isProtected && !session) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // 로그인 상태로 /login 접근 → ?next 또는 /으로 리다이렉트
  if (pathname === '/login' && session) {
    const url = request.nextUrl.clone()
    const next = request.nextUrl.searchParams.get('next') ?? '/'
    url.pathname = next.startsWith('/') && !next.startsWith('//') ? next : '/'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/login',
    '/reading/:path*',
    '/daily/:path*',
    '/onboarding/:path*',
    '/mypage/:path*',
  ],
}
