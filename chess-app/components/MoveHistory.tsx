'use client'

import { useEffect, useRef } from 'react'

interface MoveHistoryProps {
    moves: string[]
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
    const bottomRef = useRef<HTMLDivElement>(null)

    // Scrolla automaticamente all'ultima mossa
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [moves])

    // Raggruppa le mosse in coppie (mossa bianco + mossa nero)
    const movePairs: { white: string; black?: string }[] = []
    for (let i = 0; i < moves.length; i += 2) {
        movePairs.push({
            white: moves[i],
            black: moves[i + 1],
        })
    }

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col h-full">
            <h3 className="text-amber-400 font-semibold text-sm uppercase tracking-wide mb-3">
                Storico mosse
            </h3>

            <div className="overflow-y-auto flex-1 max-h-96">
                {movePairs.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center mt-4">
                        Nessuna mossa ancora
                    </p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 border-b border-gray-700">
                                <th className="text-left py-1 px-2 w-8">#</th>
                                <th className="text-left py-1 px-2">Bianco</th>
                                <th className="text-left py-1 px-2">Nero</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movePairs.map((pair, index) => (
                                <tr
                                    key={index}
                                    className={`border-b border-gray-700/50 ${
                                        index === movePairs.length - 1
                                            ? 'bg-gray-700/30'
                                            : ''
                                    }`}
                                >
                                    <td className="py-1 px-2 text-gray-500">
                                        {index + 1}.
                                    </td>
                                    <td className="py-1 px-2 text-gray-200 font-mono">
                                        {pair.white}
                                    </td>
                                    <td className="py-1 px-2 text-gray-200 font-mono">
                                        {pair.black ?? ''}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    )
}