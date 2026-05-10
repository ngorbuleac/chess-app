import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import GameMenuClient from './GameMenuClient'
import { getStats } from '@/lib/supabase'

export default async function GamePage() {
    const user = await currentUser()

    if (!user) redirect('/sign-in')

    const stats = await getStats(user.id)

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <main className="max-w-2xl mx-auto px-6 py-12">

                {/* Titolo */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-amber-400 mb-2">
                        Nuova partita ♟
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Scegli le impostazioni e inizia a giocare
                    </p>
                </div>

                <GameMenuClient
                    userId={user.id}
                    favoriteTheme={stats?.favorite_theme ?? 'wood'}
                />

            </main>
        </div>
    )
}