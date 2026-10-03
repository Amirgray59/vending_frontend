import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/devices',
  '/places',
  '/alerts',
  '/financial-report',
  '/roles-users',
  '/repairs',
];

// صفحاتی که فقط کاربر غیر-لاگین باید ببیند
const PUBLIC_ONLY_ROUTES = ['/', '/verify-otp'];

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  console.log("Current Path:", pathname);
  console.log("Token found in cookie:", token);

  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  // ۱. اگر کاربر توکن ندارد و می‌خواهد به صفحات محافظت شده برود -> هدایت به صفحه اصلی (/)
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ۲. اگر کاربر توکن دارد و می‌خواهد به صفحاتی که فقط برای کاربران غیر-لاگین است (مثل / یا /verify-otp) برود
  if (PUBLIC_ONLY_ROUTES.includes(pathname) && token) {
    // هدایت به داشبورد
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // اصلاح شد: اضافه شدن * برای شناسایی تمام مسیرها
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};