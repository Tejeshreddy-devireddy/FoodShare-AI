import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple role-based route protection using a role cookie `gs_role` set on client login.
const ROLE_ROUTES: Record<string, string> = {
  '/dashboard/donor': 'Donor',
  '/dashboard/ngo': 'NGO',
  '/dashboard/volunteer': 'Volunteer',
  '/dashboard/admin': 'Admin',
};

function getRoleFromCookie(req: NextRequest) {
  try {
    const cookie = req.cookies.get('gs_role');
    if (!cookie) return null;
    return cookie;
  } catch (e) {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // protect all /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const role = getRoleFromCookie(req)?.value || null;

    // if user has no role cookie, redirect to login
    if (!role) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // if requesting the base /dashboard, send user to their role dashboard
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      switch (role) {
        case 'Donor':
          url.pathname = '/dashboard/donor';
          break;
        case 'NGO':
          url.pathname = '/dashboard/ngo';
          break;
        case 'Volunteer':
          url.pathname = '/dashboard/volunteer';
          break;
        case 'Admin':
          url.pathname = '/dashboard/admin';
          break;
        default:
          url.pathname = '/unauthorized';
      }
      return NextResponse.redirect(url);
    }

    // ensure the path matches the role
    const segments = pathname.split('/').filter(Boolean);
    const requested = segments[1]; // dashboard/<requested>
    if (requested) {
      const expectedPrefix = `/dashboard/${requested}`;
      const expectedRole = ROLE_ROUTES[expectedPrefix];
      if (expectedRole && expectedRole !== role) {
        // redirect to their correct dashboard
        switch (role) {
          case 'Donor':
            url.pathname = '/dashboard/donor';
            break;
          case 'NGO':
            url.pathname = '/dashboard/ngo';
            break;
          case 'Volunteer':
            url.pathname = '/dashboard/volunteer';
            break;
          case 'Admin':
            url.pathname = '/dashboard/admin';
            break;
          default:
            url.pathname = '/unauthorized';
        }
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard'],
};
