// ============================================================
// FUNZIONE DI VALUTAZIONE DELLA POSIZIONE SCACCHISTICA
// Usata dall'algoritmo Minimax per stimare il vantaggio
// di una posizione senza esplorare ulteriori mosse.
// Un valore positivo = vantaggio del Bianco
// Un valore negativo = vantaggio del Nero
// ============================================================

// Valore materiale di ogni pezzo in centipedoni (100 = 1 pedone)
const PIECE_VALUES: Record<string, number> = {
    p: 100,   // pedone
    n: 320,   // cavallo
    b: 330,   // alfiere
    r: 500,   // torre
    q: 900,   // regina
    k: 20000, // re (valore altissimo per non sacrificarlo mai)
}

// ============================================================
// PIECE-SQUARE TABLES (PST)
// Ogni tabella definisce il bonus posizionale di un pezzo
// su ogni casella della scacchiera (dal punto di vista del Bianco).
// Indice 0 = a8 (angolo in alto a sinistra), 63 = h1 (in basso a destra).
// Valori positivi = caselle preferibili, negativi = caselle da evitare.
// ============================================================

// I pedoni valgono di più al centro e quando avanzano
const PAWN_TABLE = [
     0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
     5,  5, 10, 25, 25, 10,  5,  5,
     0,  0,  0, 20, 20,  0,  0,  0,
     5, -5,-10,  0,  0,-10, -5,  5,
     5, 10, 10,-20,-20, 10, 10,  5,
     0,  0,  0,  0,  0,  0,  0,  0,
]

// I cavalli sono forti al centro, deboli ai bordi
const KNIGHT_TABLE = [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50,
]

// Gli alfieri preferiscono le grandi diagonali
const BISHOP_TABLE = [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20,
]

// Le torri sono forti sulla 7a traversa e file aperte
const ROOK_TABLE = [
     0,  0,  0,  0,  0,  0,  0,  0,
     5, 10, 10, 10, 10, 10, 10,  5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
     0,  0,  0,  5,  5,  0,  0,  0,
]

// La regina combina mobilità di torre e alfiere
const QUEEN_TABLE = [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
     -5,  0,  5,  5,  5,  5,  0, -5,
      0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20,
]

// Il re deve stare al sicuro (arrocco) nelle fasi iniziali
const KING_TABLE = [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
     20, 20,  0,  0,  0,  0, 20, 20,
     20, 30, 10,  0,  0, 10, 30, 20,
]

// ============================================================
// Restituisce il bonus posizionale di un pezzo su una casella.
// Per il Nero la tabella viene letta al contrario (specchiata)
// perché le PST sono scritte dal punto di vista del Bianco.
// ============================================================
function getPieceSquareValue(
    piece: string,
    square: number,
    isWhite: boolean
): number {
    // Il Nero legge la tabella specchiata verticalmente
    const index = isWhite ? square : 63 - square

    switch (piece) {
        case 'p': return PAWN_TABLE[index]
        case 'n': return KNIGHT_TABLE[index]
        case 'b': return BISHOP_TABLE[index]
        case 'r': return ROOK_TABLE[index]
        case 'q': return QUEEN_TABLE[index]
        case 'k': return KING_TABLE[index]
        default:  return 0
    }
}

// ============================================================
// FUNZIONE PRINCIPALE DI VALUTAZIONE
// Scorre tutti i pezzi sulla scacchiera e somma:
//   + valore materiale del pezzo
//   + bonus posizionale dalla PST
// I pezzi bianchi contribuiscono positivamente,
// i pezzi neri negativamente.
// ============================================================
export function evaluateBoard(board: (
    { type: string; color: string } | null
)[][]): number {
    let score = 0

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col]
            if (!piece) continue

            // Converti riga/colonna in indice lineare 0-63
            const squareIndex = row * 8 + col
            const isWhite = piece.color === 'w'

            // Valore materiale base
            const materialValue = PIECE_VALUES[piece.type] ?? 0

            // Bonus posizionale dalla PST
            const positionalBonus = getPieceSquareValue(
                piece.type,
                squareIndex,
                isWhite
            )

            // Il bianco aggiunge, il nero sottrae
            if (isWhite) {
                score += materialValue + positionalBonus
            } else {
                score -= materialValue + positionalBonus
            }
        }
    }

    return score
}