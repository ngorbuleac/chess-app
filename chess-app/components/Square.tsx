'use client'

// Simboli Unicode per i pezzi degli scacchi
const PIECE_SYMBOLS: Record<string, string> = {
    wk: '♔', // Re bianco
    wq: '♕', // Regina bianca
    wr: '♖', // Torre bianca
    wb: '♗', // Alfiere bianco
    wn: '♘', // Cavallo bianco
    wp: '♙', // Pedone bianco
    bk: '♚', // Re nero
    bq: '♛', // Regina nera
    br: '♜', // Torre nera
    bb: '♝', // Alfiere nero
    bn: '♞', // Cavallo nero
    bp: '♟', // Pedone nero
}

interface SquareProps {
    piece: { type: string; color: string } | null
    isLight: boolean
    isSelected: boolean
    isLegalMove: boolean
    isLastMove: boolean
    isInCheck: boolean
    onClick: () => void
    lightColor: string
    darkColor: string
}

export default function Square({
    piece,
    isLight,
    isSelected,
    isLegalMove,
    isLastMove,
    isInCheck,
    onClick,
    lightColor,
    darkColor,
}: SquareProps) {
    // Calcola il colore di sfondo della casella
    const getBackgroundColor = () => {
        if (isInCheck)   return '#e53935' // Rosso per re in scacco
        if (isSelected)  return '#f6f669' // Giallo per casella selezionata
        if (isLastMove)  return isLight ? '#cdd26a' : '#aaa23a' // Verde per ultima mossa
        return isLight ? lightColor : darkColor
    }

    const backgroundColor = getBackgroundColor()

    // Stile del pezzo: bianco con bordo scuro, nero con bordo chiaro
    const pieceStyle = piece
        ? {
            filter: piece.color === 'w'
                ? 'drop-shadow(0px 0px 1px #000) drop-shadow(0px 0px 1px #000)'
                : 'drop-shadow(0px 0px 1px #fff) drop-shadow(0px 0px 1px #fff)',
            color: piece.color === 'w' ? '#ffffff' : '#1a1a1a',
        }
        : {}

    const pieceKey = piece ? `${piece.color}${piece.type}` : null
    const symbol = pieceKey ? PIECE_SYMBOLS[pieceKey] : null

    return (
        <div
            onClick={onClick}
            className="relative flex items-center justify-center cursor-pointer select-none"
            style={{
                backgroundColor,
                aspectRatio: '1',
                transition: 'background-color 0.15s ease',
            }}
        >
            {/* Indicatore mossa legale: cerchio al centro se vuota, anello se occupata */}
            {isLegalMove && (
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    {piece ? (
                        // Casella occupata: anello attorno al bordo
                        <div className="absolute inset-0 rounded-none border-4 border-black/30 z-10" />
                    ) : (
                        // Casella vuota: cerchio centrale
                        <div className="w-1/3 h-1/3 rounded-full bg-black/25 z-10" />
                    )}
                </div>
            )}

            {/* Pezzo */}
            {symbol && (
                <span
                    className="text-4xl leading-none z-20 pointer-events-none"
                    style={pieceStyle}
                >
                    {symbol}
                </span>
            )}
        </div>
    )
}