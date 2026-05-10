'use client'

interface StatsCardProps {
    wins: number
    losses: number
    draws: number
    favoriteTheme: string
}

export default function StatsCard({
    wins,
    losses,
    draws,
    favoriteTheme,
}: StatsCardProps) {
    const total = wins + losses + draws
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {/* Vittorie */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col items-center gap-2">
                <span className="text-3xl font-bold text-green-400">{wins}</span>
                <span className="text-gray-400 text-sm uppercase tracking-wide">Vittorie</span>
            </div>

            {/* Sconfitte */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col items-center gap-2">
                <span className="text-3xl font-bold text-red-400">{losses}</span>
                <span className="text-gray-400 text-sm uppercase tracking-wide">Sconfitte</span>
            </div>

            {/* Patte */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col items-center gap-2">
                <span className="text-3xl font-bold text-yellow-400">{draws}</span>
                <span className="text-gray-400 text-sm uppercase tracking-wide">Patte</span>
            </div>

            {/* Win rate */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col items-center gap-2">
                <span className="text-3xl font-bold text-amber-400">{winRate}%</span>
                <span className="text-gray-400 text-sm uppercase tracking-wide">Vittorie %</span>
            </div>

            {/* Totale partite */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col items-center gap-2 col-span-2">
                <span className="text-3xl font-bold text-blue-400">{total}</span>
                <span className="text-gray-400 text-sm uppercase tracking-wide">Partite totali</span>
            </div>

            {/* Tema preferito */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col items-center gap-2 col-span-2">
                <span className="text-3xl font-bold text-purple-400 capitalize">{favoriteTheme}</span>
                <span className="text-gray-400 text-sm uppercase tracking-wide">Tema preferito</span>
            </div>

        </div>
    )
}