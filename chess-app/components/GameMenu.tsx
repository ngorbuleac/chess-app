'use client'

import { useState } from 'react'
import { saveFavoriteTheme } from '@/lib/supabase'

// Definizione dei 6 temi con colori e nomi
const THEMES = [
    { id: 'wood',   name: 'Legno',  light: '#F0D0A0', dark: '#8B4513' },
    { id: 'marble', name: 'Marmo',  light: '#E8E4E0', dark: '#6B7B8D' },
    { id: 'felt',   name: 'Feltro', light: '#C8D8A8', dark: '#3A5A2A' },
    { id: 'walnut', name: 'Noce',   light: '#D4A882', dark: '#4A2810' },
    { id: 'ocean',  name: 'Oceano', light: '#B8D4E8', dark: '#1A4A6A' },
    { id: 'night',  name: 'Notte',  light: '#4A4E5A', dark: '#1E2028' },
]

interface GameMenuProps {
    userId: string
    favoriteTheme: string
    onStart: (config: {
        mode: string
        difficulty: string
        color: string
        theme: string
    }) => void
}

export default function GameMenu({ userId, favoriteTheme, onStart }: GameMenuProps) {
    const [mode, setMode] = useState<'ai' | 'player'>('ai')
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
    const [color, setColor] = useState<'w' | 'b'>('w')
    const [theme, setTheme] = useState(favoriteTheme)

    const handleStart = async () => {
        // Salva il tema preferito su Supabase
        await saveFavoriteTheme(userId, theme)
        onStart({ mode, difficulty, color, theme })
    }

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col gap-6 max-w-lg w-full">

            {/* Modalità di gioco */}
            <div>
                <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-3">Modalità</h3>
                <div className="flex gap-3">
                    {[
                        { id: 'ai',     label: '🤖 vs AI' },
                        { id: 'player', label: '👤 vs Giocatore' },
                    ].map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setMode(opt.id as 'ai' | 'player')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                                mode === opt.id
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Difficoltà AI */}
            {mode === 'ai' && (
                <div>
                    <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-3">Difficoltà</h3>
                    <div className="flex gap-3">
                        {[
                            { id: 'easy',   label: '🟢 Facile' },
                            { id: 'medium', label: '🟡 Medio' },
                            { id: 'hard',   label: '🔴 Difficile' },
                        ].map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => setDifficulty(opt.id as 'easy' | 'medium' | 'hard')}
                                className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                                    difficulty === opt.id
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Scelta colore */}
            <div>
                <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-3">Colore pezzi</h3>
                <div className="flex gap-3">
                    {[
                        { id: 'w', label: '♔ Bianco' },
                        { id: 'b', label: '♚ Nero' },
                    ].map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setColor(opt.id as 'w' | 'b')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                                color === opt.id
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scelta tema */}
            <div>
                <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-3">Tema scacchiera</h3>
                <div className="grid grid-cols-3 gap-3">
                    {THEMES.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={`rounded-lg overflow-hidden border-2 transition-all ${
                                theme === t.id
                                    ? 'border-amber-400 scale-105'
                                    : 'border-transparent hover:border-gray-500'
                            }`}
                        >
                            {/* Anteprima mini scacchiera 4x4 */}
                            <div className="grid grid-cols-4">
                                {Array.from({ length: 16 }).map((_, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            backgroundColor:
                                                (Math.floor(i / 4) + i) % 2 === 0
                                                    ? t.light
                                                    : t.dark,
                                            height: '16px',
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="bg-gray-700 py-1 text-xs text-gray-300 text-center">
                                {t.name}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Pulsante avvia */}
            <button
                onClick={handleStart}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold text-lg transition-colors"
            >
                ♟ Inizia partita
            </button>

        </div>
    )
}