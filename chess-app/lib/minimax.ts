import { Chess } from 'chess.js'
import { evaluateBoard } from './evaluation'

// ============================================================
// ALGORITMO MINIMAX CON POTATURA ALPHA-BETA
//
// Minimax è un algoritmo di ricerca ad albero usato nei giochi
// a due giocatori a somma zero (come gli scacchi).
//
// L'idea di base:
//   - Il giocatore MAX (Bianco) cerca di MASSIMIZZARE il punteggio
//   - Il giocatore MIN (Nero) cerca di MINIMIZZARE il punteggio
//   - L'algoritmo esplora tutte le mosse possibili fino a una
//     certa profondità, poi valuta la posizione risultante
//
// La potatura Alpha-Beta ottimizza Minimax eliminando rami
// dell'albero che non possono influenzare il risultato finale,
// riducendo drasticamente il numero di posizioni da esaminare.
//
// Alpha = il miglior punteggio che MAX può garantirsi finora
// Beta  = il miglior punteggio che MIN può garantirsi finora
// Se beta <= alpha, il ramo corrente non verrà mai scelto
// da un giocatore ottimale → lo potaimo (pruning).
// ============================================================

// Profondità di ricerca per ogni livello di difficoltà
const DEPTH_BY_DIFFICULTY: Record<string, number> = {
    easy:   1, // Esplora solo 1 mossa in avanti
    medium: 2, // Esplora 2 mosse in avanti
    hard:   3, // Esplora 3 mosse in avanti
}

// ============================================================
// FUNZIONE MINIMAX RICORSIVA
//
// @param game       - istanza Chess.js con la posizione corrente
// @param depth      - profondità residua da esplorare
// @param alpha      - miglior valore garantito per MAX (inizia a -∞)
// @param beta       - miglior valore garantito per MIN (inizia a +∞)
// @param isMaximizing - true se è il turno del Bianco (MAX)
// @returns          - il punteggio migliore trovato per questo ramo
// ============================================================
function minimax(
    game: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
): number {
    // CASO BASE 1: profondità zero → valuta la posizione attuale
    if (depth === 0) {
        return evaluateBoard(game.board())
    }

    // CASO BASE 2: partita terminata (scacco matto o stallo)
    if (game.isGameOver()) {
        if (game.isCheckmate()) {
            // Chi ha fatto scacco matto vince:
            // se è turno di MAX ed è in scacco matto, ha perso → -∞
            // se è turno di MIN ed è in scacco matto, ha perso → +∞
            return isMaximizing ? -100000 : 100000
        }
        // Stallo, ripetizione, materiale insufficiente → patta
        return 0
    }

    const moves = game.moves()

    if (isMaximizing) {
        // --------------------------------------------------------
        // TURNO DEL BIANCO (MAX): cerca la mossa con punteggio più alto
        // --------------------------------------------------------
        let bestScore = -Infinity

        for (const move of moves) {
            game.move(move)                          // Esegui la mossa
            const score = minimax(game, depth - 1, alpha, beta, false)
            game.undo()                              // Annulla la mossa

            bestScore = Math.max(bestScore, score)
            alpha = Math.max(alpha, bestScore)

            // POTATURA BETA: il Nero non sceglierà mai questo ramo
            // perché ha già un'opzione migliore (beta <= alpha)
            if (beta <= alpha) break
        }

        return bestScore
    } else {
        // --------------------------------------------------------
        // TURNO DEL NERO (MIN): cerca la mossa con punteggio più basso
        // --------------------------------------------------------
        let bestScore = Infinity

        for (const move of moves) {
            game.move(move)                          // Esegui la mossa
            const score = minimax(game, depth - 1, alpha, beta, true)
            game.undo()                              // Annulla la mossa

            bestScore = Math.min(bestScore, score)
            beta = Math.min(beta, bestScore)

            // POTATURA ALPHA: il Bianco non sceglierà mai questo ramo
            // perché ha già un'opzione migliore (beta <= alpha)
            if (beta <= alpha) break
        }

        return bestScore
    }
}

// ============================================================
// FUNZIONE PRINCIPALE: calcola la mossa migliore per l'AI
//
// @param game       - istanza Chess.js con la posizione corrente
// @param difficulty - 'easy' | 'medium' | 'hard'
// @param aiColor    - 'w' (Bianco) o 'b' (Nero)
// @returns          - la stringa della mossa migliore (es. "e2e4")
//                     o null se non ci sono mosse disponibili
// ============================================================
export function getBestMove(
    game: Chess,
    difficulty: string,
    aiColor: string
): string | null {
    const depth = DEPTH_BY_DIFFICULTY[difficulty] ?? 2
    const moves = game.moves()

    if (moves.length === 0) return null

    // L'AI massimizza se gioca col Bianco, minimizza se gioca col Nero
    const isMaximizing = aiColor === 'w'

    let bestMove: string | null = null
    let bestScore = isMaximizing ? -Infinity : Infinity

    for (const move of moves) {
        game.move(move)
        const score = minimax(
            game,
            depth - 1,
            -Infinity,
            Infinity,
            !isMaximizing // il prossimo turno è dell'avversario
        )
        game.undo()

        // Aggiorna la mossa migliore in base al colore dell'AI
        if (isMaximizing && score > bestScore) {
            bestScore = score
            bestMove = move
        } else if (!isMaximizing && score < bestScore) {
            bestScore = score
            bestMove = move
        }
    }

    return bestMove
}