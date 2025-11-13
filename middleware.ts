import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// JWT secret - should match your backend
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key'

interface JWTPayload {
  userId: string
  tenantId: string
  email: string
  roles?: string[]
  iat: number
  exp: number
}

async function validateToken(token: string): Promise<JWTPayload | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    console.error('JWT validation failed:', error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '')

  let user: JWTPayload | null = null

  if (token) {
    user = await validateToken(token)
  }

  // Define protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/pos',
    '/products',
    '/customers',
    '/sales',
    '/reports',
    '/settings',
    '/admin'
  ]

  // Define routes that require tenant context
  const tenantRequiredRoutes = [
    '/pos',
    '/products',
    '/customers',
    '/sales',
    '/reports',
    '/settings'
  ]

  // Define routes that require store context
  const storeRequiredRoutes = [
    '/pos',
    '/sales'
  ]

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/signup',
    '/',
    '/forgot-password'
  ]

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  const isTenantRequiredRoute = tenantRequiredRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  const isStoreRequiredRoute = storeRequiredRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname === route
  )

  // If accessing a protected route without authentication, redirect to login
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url)
    // Preserve the original URL for redirect after login
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated user tries to access login/signup, redirect to dashboard
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // For authenticated users on protected routes, add user context to headers
  // This allows the client-side components to access user information
  const response = NextResponse.next()

  if (user) {
    // Add user context to response headers for client-side access
    response.headers.set('x-user-id', user.userId)
    response.headers.set('x-user-email', user.email)
    response.headers.set('x-tenant-id', user.tenantId)

    if (user.roles) {
      response.headers.set('x-user-roles', JSON.stringify(user.roles))
    }

    // For tenant-required routes, ensure tenant context is available
    if (isTenantRequiredRoute && !user.tenantId) {
      return NextResponse.redirect(new URL('/login?error=tenant_required', request.url))
    }

    // Note: Store context validation is handled by client-side components
    // since middleware can't access client-side state for store selection
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}