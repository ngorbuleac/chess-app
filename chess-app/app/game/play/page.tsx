'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useCallback, Suspense } from 'react'
import { useUser } from '@clerk/nextjs'
import Header from '@/components/Header'
import Board from '@/components/Board'
import { updateStats, insertMatch } from '@/lib/supabase'

function PlayContent() {
    const { user } = useUser()
    const router = useRouter()
    const searchParams = useSearchParams()

    const mode       = searchParams.get('mode')       ?? 'ai'
    const difficulty = searchParams.get('difficulty') ?? 'medium'
    const color      = searchParams.get('color')      ?? 'w'
    const theme      = searchParams.get('theme')      ?? 'wood'

    const [gameEnded, setGameEnded] = useState(false)
    const [resultMessage, setResultMessage] = useState('')

    const handleGameEnd = useCallback(async (result: 'win' | 'loss' | 'draw') => {
        if (!user || gameEnded) return
        setGameEnded(true)

        const messages = {
            win:  '🏆 Hai vinto! Ottima partita!',
            loss: '😞 Hai perso! Riprova!',
            draw: '🤝 Patta! Bella partita!',
        }
        setResultMessage(messages[result])

        // Salva su Supabase
        await updateStats(user.id, result)
        await insertMatch({
            user_id:    user.id,
            mode,
            difficulty,
            color,
            theme,
            result,
        })
    }, [user, gameEnded, mode, difficulty, color, theme])

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <main className="max-w-5xl mx-auto px-6 py-8">

                {/* Modale risultato */}
                {gameEnded && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 flex flex-col items-center gap-6 max-w-sm w-full mx-4">
                            <h2 className="text-3xl font-bold text-amber-400 text-center">
                                Partita terminata
                            </h2>
                            <p className="text-xl text-white text-center">
                                {resultMessage}
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => router.push('/game')}
                                    className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold transition-colors"
                                >
                                    Nuova partita
                                </button>
                                <button
                                    onClick={() => router.push('/stats')}
                                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors"
                                >
                                    Statistiche
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scacchiera */}
                <Board
                    mode={mode}
                    difficulty={difficulty}
                    playerColor={color}
                    theme={theme}
                    onGameEnd={handleGameEnd}
                />

            </main>
        </div>
    )
}

export default function PlayPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <p className="text-amber-400 text-xl">Caricamento...</p>
            </div>
        }>
            <PlayContent />
        </Suspense>
    )
}