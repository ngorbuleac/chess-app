import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipi per le tabelle
export interface Stats {
    user_id: string
    wins: number
    losses: number
    draws: number
    favorite_theme: string
}

export interface Match {
    id?: string
    user_id: string
    played_at?: string
    mode: string
    difficulty: string
    color: string
    theme: string
    result: string
}

// Crea o aggiorna il record utente al primo accesso
export async function upsertUser(userId: string): Promise<void> {
    await supabase
        .from('stats')
        .upsert({ user_id: userId }, { onConflict: 'user_id' })
}

// Carica le statistiche di un utente
export async function getStats(userId: string): Promise<Stats | null> {
    const { data, error } = await supabase
        .from('stats')
        .select('*')
        .eq('user_id', userId)
        .single()

    if (error) return null
    return data
}

// Aggiorna wins/losses/draws dopo una partita
export async function updateStats(
    userId: string,
    result: 'win' | 'loss' | 'draw'
): Promise<void> {
    const stats = await getStats(userId)
    if (!stats) return

    const updates = {
        wins: result === 'win' ? stats.wins + 1 : stats.wins,
        losses: result === 'loss' ? stats.losses + 1 : stats.losses,
        draws: result === 'draw' ? stats.draws + 1 : stats.draws,
    }

    await supabase
        .from('stats')
        .update(updates)
        .eq('user_id', userId)
}

// Salva il tema preferito
export async function saveFavoriteTheme(
    userId: string,
    theme: string
): Promise<void> {
    await supabase
        .from('stats')
        .update({ favorite_theme: theme })
        .eq('user_id', userId)
}

// Inserisce una partita nello storico
export async function insertMatch(match: Match): Promise<void> {
    await supabase.from('matches').insert(match)
}

// Carica lo storico partite di un utente
export async function getMatches(userId: string): Promise<Match[]> {
    const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('user_id', userId)
        .order('played_at', { ascending: false })

    if (error) return []
    return data
}