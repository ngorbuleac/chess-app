import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import StatsCard from '@/components/StatsCard'
import MatchTable from '@/components/MatchTable'
import { getStats, getMatches } from '@/lib/supabase'

export default async function StatsPage() {
    const user = await currentUser()

    if (!user) redirect('/sign-in')

    const [stats, matches] = await Promise.all([
        getStats(user.id),
        getMatches(user.id),
    ])

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <main className="max-w-5xl mx-auto px-6 py-12">

                {/* Titolo */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-amber-400 mb-2">
                        Statistiche ♟
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Il tuo storico completo di partite
                    </p>
                </div>

                {/* Card riepilogative */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">
                        Riepilogo
                    </h2>
                    <StatsCard
                        wins={stats?.wins ?? 0}
                        losses={stats?.losses ?? 0}
                        draws={stats?.draws ?? 0}
                        favoriteTheme={stats?.favorite_theme ?? 'wood'}
                    />
                </div>

                {/* Storico partite */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">
                        Storico partite
                        <span className="text-gray-500 text-base font-normal ml-2">
                            ({matches.length} partite)
                        </span>
                    </h2>
                    <MatchTable matches={matches} />
                </div>

            </main>
        </div>
    )
}