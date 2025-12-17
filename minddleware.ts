import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const role = request.cookies.get('user_role')?.value; // sesuaikan nama cookie
  const url = request.nextUrl.pathname;

  // 2. Proteksi Halaman Approval
  if (url.startsWith('/dashboard-approver') && role !== 'approval') {
    return NextResponse.redirect(new URL('/dashboard-pengaju', request.url));
  }

  // 3. Proteksi Halaman Pengaju (Opsional)
  if ((url.startsWith('/dashboard-approver') || url.startsWith('/dashboard-pengaju')) && !role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard-approver/:path*', '/dashboard-pengaju/:path*'],
}