import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import StatsCard from '@/components/StatsCard'
import { getStats, upsertUser } from '@/lib/supabase'

export default async function HomePage() {
    const user = await currentUser()

    // Se non autenticato, redirect al login
    if (!user) redirect('/sign-in')

    // Crea o aggiorna il record utente al primo accesso
    await upsertUser(user.id)

    // Carica le statistiche
    const stats = await getStats(user.id)

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <main className="max-w-4xl mx-auto px-6 py-12">

                {/* Benvenuto */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-amber-400 mb-2">
                        Benvenuto, {user.firstName ?? 'Giocatore'}! ♔
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Pronto per una nuova partita?
                    </p>
                </div>

                {/* Statistiche rapide */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">
                        Le tue statistiche
                    </h2>
                    <StatsCard
                        wins={stats?.wins ?? 0}
                        losses={stats?.losses ?? 0}
                        draws={stats?.draws ?? 0}
                        favoriteTheme={stats?.favorite_theme ?? 'wood'}
                    />
                </div>

                {/* Pulsanti azione */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/game"
                        className="flex-1 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold text-xl text-center transition-colors shadow-lg"
                    >
                        ♟ Nuova partita
                    </Link>
                    <Link
                        href="/stats"
                        className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-xl text-center transition-colors shadow-lg"
                    >
                        📊 Statistiche complete
                    </Link>
                </div>

            </main>
        </div>
    )
}