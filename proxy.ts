import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/webhooks/clerk(.*)'
])

export default clerkMiddleware( async (auth, req: NextRequest) => {

  const { userId } = await auth();
  const currentUrl = req.nextUrl.pathname;

  if (userId && (currentUrl === '/' || isPublicRoute(req))) {
    const financesUrl = new URL('/finances', req.url);
    return NextResponse.redirect(financesUrl);
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/(.*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};