import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Route protette: solo utenti autenticati possono accedere
const isProtectedRoute = createRouteMatcher([
    '/game(.*)',
    '/stats(.*)',
])

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        await auth.protect()
    }
})

export const config = {
    matcher: [
        // Salta file statici e interni di Next.js
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}