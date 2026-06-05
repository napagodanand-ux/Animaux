import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Protect survey and admin routes
  if (!user) {
    if (pathname.startsWith('/survey') || pathname.startsWith('/admin')) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  const isAdmin = user.email === ADMIN_EMAIL

  // Redirect admin to /admin when accessing /survey routes
  if (isAdmin && pathname.startsWith('/survey')) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  // Block non-admin from /admin
  if (!isAdmin && pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/survey/welcome'
    return NextResponse.redirect(url)
  }

  // Redirect logged-in user away from /login
  if (pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = isAdmin ? '/admin' : '/survey/welcome'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
