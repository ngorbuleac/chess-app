import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Chess App',
    description: 'Gioca a scacchi online con AI o contro un amico',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="it">
                <body className={inter.className}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}