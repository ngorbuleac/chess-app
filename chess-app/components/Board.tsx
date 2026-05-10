'use client'

import { useState, useEffect, useCallback } from 'react'
import { Chess } from 'chess.js'
import Square from './Square'
import MoveHistory from './MoveHistory'
import { getBestMove } from '@/lib/minimax'

// Colori per ogni tema
const THEME_COLORS: Record<string, { light: string; dark: string }> = {
    wood:   { light: '#F0D0A0', dark: '#8B4513' },
    marble: { light: '#E8E4E0', dark: '#6B7B8D' },
    felt:   { light: '#C8D8A8', dark: '#3A5A2A' },
    walnut: { light: '#D4A882', dark: '#4A2810' },
    ocean:  { light: '#B8D4E8', dark: '#1A4A6A' },
    night:  { light: '#4A4E5A', dark: '#1E2028' },
}

interface BoardProps {
    mode: string
    difficulty: string
    playerColor: string
    theme: string
    onGameEnd: (result: 'win' | 'loss' | 'draw') => void
}

export default function Board({
    mode,
    difficulty,
    playerColor,
    theme,
    onGameEnd,
}: BoardProps) {
    const [game, setGame] = useState(new Chess())
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
    const [legalMoves, setLegalMoves] = useState<string[]>([])
    const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null)
    const [moves, setMoves] = useState<string[]>([])
    const [gameOver, setGameOver] = useState(false)
    const [status, setStatus] = useState<string>('')

    const colors = THEME_COLORS[theme] ?? THEME_COLORS.wood
    const aiColor = playerColor === 'w' ? 'b' : 'w'

    // Controlla se la partita è finita e notifica il parent
    const checkGameOver = useCallback((currentGame: Chess) => {
        if (currentGame.isGameOver()) {
            setGameOver(true)
            if (currentGame.isCheckmate()) {
                const winner = currentGame.turn() === 'w' ? 'b' : 'w'
                const result = winner === playerColor ? 'win' : 'loss'
                setStatus(result === 'win' ? 'Hai vinto! 🏆' : 'Hai perso! 😞')
                onGameEnd(result)
            } else {
                setStatus('Patta! 🤝')
                onGameEnd('draw')
            }
            return true
        }
        if (currentGame.inCheck()) {
            setStatus('Scacco! ⚠️')
        } else {
            setStatus('')
        }
        return false
    }, [playerColor, onGameEnd])

    // Mossa dell'AI
    const makeAiMove = useCallback((currentGame: Chess) => {
        if (currentGame.isGameOver()) return

        setTimeout(() => {
            const bestMove = getBestMove(currentGame, difficulty, aiColor)
            if (!bestMove) return

            const newGame = new Chess(currentGame.fen())
            const result = newGame.move(bestMove)
            if (result) {
                setLastMove({ from: result.from, to: result.to })
                setMoves(prev => [...prev, result.san])
                setGame(newGame)
                checkGameOver(newGame)
            }
        }, 300) // Piccolo delay per sembrare più naturale
    }, [difficulty, aiColor, checkGameOver])

    // Se l'AI gioca col Bianco, fa la prima mossa
    useEffect(() => {
        if (mode === 'ai' && playerColor === 'b') {
            makeAiMove(game)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Gestisce il click su una casella
    const handleSquareClick = (square: string) => {
        if (gameOver) return
        if (mode === 'ai' && game.turn() !== playerColor) return

        // Se c'è una casella selezionata, prova a muovere
        if (selectedSquare) {
            const move = legalMoves.find(m => m.startsWith(selectedSquare) && m.includes(square))

            if (move) {
                // Prova a eseguire la mossa (gestisce anche promozione)
                const newGame = new Chess(game.fen())
                const result = newGame.move({
                    from: selectedSquare,
                    to: square,
                    promotion: 'q', // Promozione automatica a regina
                })

                if (result) {
                    setLastMove({ from: result.from, to: result.to })
                    setMoves(prev => [...prev, result.san])
                    setGame(newGame)
                    setSelectedSquare(null)
                    setLegalMoves([])

                    const isOver = checkGameOver(newGame)
                    if (!isOver && mode === 'ai') {
                        makeAiMove(newGame)
                    }
                    return
                }
            }

            // Deseleziona se clicca su un'altra casella non valida
            setSelectedSquare(null)
            setLegalMoves([])
        }

        // Seleziona un pezzo
        const piece = game.get(square as any)
        if (piece && piece.color === game.turn()) {
            setSelectedSquare(square)
            const moves = game.moves({ square: square as any, verbose: true })
            setLegalMoves(moves.map(m => `${m.from}${m.to}`))
        }
    }

    // Annulla l'ultima mossa (in modalità vs AI annulla 2 mosse)
    const undoMove = () => {
        const newGame = new Chess(game.fen())
        newGame.undo()
        if (mode === 'ai') newGame.undo()
        setGame(newGame)
        setSelectedSquare(null)
        setLegalMoves([])
        setLastMove(null)
        setMoves(prev => mode === 'ai' ? prev.slice(0, -2) : prev.slice(0, -1))
        setGameOver(false)
        setStatus('')
    }

    // Nuova partita
    const newGame = () => {
        const fresh = new Chess()
        setGame(fresh)
        setSelectedSquare(null)
        setLegalMoves([])
        setLastMove(null)
        setMoves([])
        setGameOver(false)
        setStatus('')
        if (mode === 'ai' && playerColor === 'b') {
            makeAiMove(fresh)
        }
    }

    // Renderizza la scacchiera
    const renderBoard = () => {
        const board = game.board()
        const rows = playerColor === 'w' ? [0,1,2,3,4,5,6,7] : [7,6,5,4,3,2,1,0]
        const cols = playerColor === 'w' ? [0,1,2,3,4,5,6,7] : [7,6,5,4,3,2,1,0]

        const files = ['a','b','c','d','e','f','g','h']
        const ranks = ['8','7','6','5','4','3','2','1']

        return rows.map((row) => (
            cols.map((col) => {
                const piece = board[row][col]
                const file = files[col]
                const rank = ranks[row]
                const square = `${file}${rank}`
                const isLight = (row + col) % 2 === 0
                const isSelected = selectedSquare === square
                const isLegalMove = legalMoves.some(m => m.endsWith(square))
                const isLastMove = lastMove?.from === square || lastMove?.to === square
                const isInCheck = piece?.type === 'k' &&
                    piece.color === game.turn() &&
                    game.inCheck()

                return (
                    <Square
                        key={square}
                        piece={piece}
                        isLight={isLight}
                        isSelected={isSelected}
                        isLegalMove={isLegalMove}
                        isLastMove={isLastMove}
                        isInCheck={isInCheck}
                        onClick={() => handleSquareClick(square)}
                        lightColor={colors.light}
                        darkColor={colors.dark}
                    />
                )
            })
        ))
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center w-full">

            {/* Scacchiera */}
            <div className="flex flex-col items-center gap-2">

                {/* Stato partita */}
                {status && (
                    <div className="text-amber-400 font-semibold text-lg mb-1">
                        {status}
                    </div>
                )}

                {/* Griglia 8x8 */}
                <div
                    className="grid grid-cols-8 rounded-lg overflow-hidden shadow-2xl"
                    style={{ width: 'min(80vw, 480px)', height: 'min(80vw, 480px)' }}
                >
                    {renderBoard()}
                </div>

                {/* Pulsanti */}
                <div className="flex gap-3 mt-2">
                    <button
                        onClick={undoMove}
                        disabled={moves.length === 0 || gameOver}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        ↩ Annulla mossa
                    </button>
                    <button
                        onClick={newGame}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        ↺ Nuova partita
                    </button>
                </div>
            </div>

            {/* Storico mosse */}
            <div className="w-full lg:w-48">
                <MoveHistory moves={moves} />
            </div>

        </div>
    )
}