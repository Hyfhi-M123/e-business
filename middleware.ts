import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  // Hanya contoh struktur jalan masuk middleware Next.js proteksi rute
  
  // 1. Definisikan rute yang wajib dilindungi (contoh: dashboard)
  const isProtectedPath = request.nextUrl.pathname.startsWith('/dashboard')
  
  if (isProtectedPath) {
    // 2. Jika ini adalah backend asli terhubung database, kita akan cek token cookie session di sini.
    // Karena saat ini .env masih kosong, kita menaruh kerangkanya saja.
    const token = request.cookies.get('sb-access-token')?.value
    
    // Jika tidak ada token (belum login), tendang kembali ke /login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Lanjutkan perjalanan request bila lolos
  return NextResponse.next()
}

// Konfigurasi agar middleware Next.js ini hanya berjalan di path navigasi tertentu
export const config = {
  matcher: [
    /*
     * Match semua request paths kecuali untuk:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
