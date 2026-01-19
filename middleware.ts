import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
    '/',
    '/explore',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/loyalty-program'
])

// DEBUG: Force set the key to rule out Vercel Env Var injection failure
if (!process.env.CLERK_SECRET_KEY) {
    process.env.CLERK_SECRET_KEY = 'sk_test_azIl6yHG8Bs0MdA0f6qKUYhcIkEcbD6Ce12Co6l7oK';
}
if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_ZGFyaW5nLXJvb3N0ZXItNDYuY2xlcmsuYWNjb3VudHMuZGV2JA';
}

export default clerkMiddleware(async (auth, req) => {
    // console.log("Middleware is running. URL:", req.url);
    if (!isPublicRoute(req)) {
        await auth.protect()
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}