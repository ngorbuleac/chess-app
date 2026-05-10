'use client'

import { Match } from '@/lib/supabase'

interface MatchTableProps {
    matches: Match[]
}

// Mappa i valori del database in etichette leggibili in italiano
const MODE_LABELS: Record<string, string> = {
    ai:     'vs AI',
    player: 'vs Giocatore',
}

const RESULT_LABELS: Record<string, string> = {
    win:  'Vittoria',
    loss: 'Sconfitta',
    draw: 'Patta',
}

const RESULT_COLORS: Record<string, string> = {
    win:  'text-green-400',
    loss: 'text-red-400',
    draw: 'text-yellow-400',
}

const COLOR_LABELS: Record<string, string> = {
    w: 'Bianco',
    b: 'Nero',
}

const DIFFICULTY_LABELS: Record<string, string> = {
    easy:   'Facile',
    medium: 'Medio',
    hard:   'Difficile',
}

export default function MatchTable({ matches }: MatchTableProps) {
    if (matches.length === 0) {
        return (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
                <p className="text-gray-400 text-lg">Nessuna partita giocata ancora.</p>
                <p className="text-gray-500 text-sm mt-2">Inizia una partita per vedere lo storico!</p>
            </div>
        )
    }

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-900 border-b border-gray-700">
                            <th className="px-4 py-3 text-left text-gray-400 font-medium">Data e ora</th>
                            <th className="px-4 py-3 text-left text-gray-400 font-medium">Modalità</th>
                            <th className="px-4 py-3 text-left text-gray-400 font-medium">Difficoltà</th>
                            <th className="px-4 py-3 text-left text-gray-400 font-medium">Colore</th>
                            <th className="px-4 py-3 text-left text-gray-400 font-medium">Tema</th>
                            <th className="px-4 py-3 text-left text-gray-400 font-medium">Risultato</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map((match, index) => (
                            <tr
                                key={match.id ?? index}
                                className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                            >
                                {/* Data e ora */}
                                <td className="px-4 py-3 text-gray-300">
                                    {match.played_at
                                        ? new Date(match.played_at).toLocaleString('it-IT', {
                                            day:    '2-digit',
                                            month:  '2-digit',
                                            year:   'numeric',
                                            hour:   '2-digit',
                                            minute: '2-digit',
                                        })
                                        : '—'
                                    }
                                </td>

                                {/* Modalità */}
                                <td className="px-4 py-3 text-gray-300">
                                    {MODE_LABELS[match.mode] ?? match.mode}
                                </td>

                                {/* Difficoltà AI */}
                                <td className="px-4 py-3 text-gray-300">
                                    {match.mode === 'ai'
                                        ? (DIFFICULTY_LABELS[match.difficulty] ?? match.difficulty)
                                        : '—'
                                    }
                                </td>

                                {/* Colore giocato */}
                                <td className="px-4 py-3 text-gray-300">
                                    {COLOR_LABELS[match.color] ?? match.color}
                                </td>

                                {/* Tema scacchiera */}
                                <td className="px-4 py-3 text-gray-300 capitalize">
                                    {match.theme}
                                </td>

                                {/* Risultato */}
                                <td className={`px-4 py-3 font-semibold ${RESULT_COLORS[match.result] ?? 'text-gray-300'}`}>
                                    {RESULT_LABELS[match.result] ?? match.result}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}