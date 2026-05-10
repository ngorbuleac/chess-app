'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'

export default function Header() {
    const { user } = useUser()

    return (
        <header className="w-full bg-gray-900 border-b border-gray-700 px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">

                {/* Logo */}
                <Link
                    href="/"
                    className="text-2xl font-bold text-amber-400 tracking-wide hover:text-amber-300 transition-colors"
                >
                    ♔ Chess Club
                </Link>

                {/* Navigazione centrale */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-gray-300 hover:text-amber-400 transition-colors font-medium"
                    >
                        Home
                    </Link>
                    <Link
                        href="/game"
                        className="text-gray-300 hover:text-amber-400 transition-colors font-medium"
                    >
                        Gioca
                    </Link>
                    <Link
                        href="/stats"
                        className="text-gray-300 hover:text-amber-400 transition-colors font-medium"
                    >
                        Statistiche
                    </Link>
                </nav>

                {/* Utente e logout */}
                <div className="flex items-center gap-3">
                    {user && (
                        <span className="text-gray-400 text-sm hidden sm:block">
                            {user.firstName ?? user.emailAddresses[0]?.emailAddress}
                        </span>
                    )}
                    <UserButton />
                </div>

            </div>
        </header>
    )
}