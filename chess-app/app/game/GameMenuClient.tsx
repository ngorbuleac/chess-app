'use client'

import { useRouter } from 'next/navigation'
import GameMenu from '@/components/GameMenu'

interface GameMenuClientProps {
    userId: string
    favoriteTheme: string
}

export default function GameMenuClient({ userId, favoriteTheme }: GameMenuClientProps) {
    const router = useRouter()

    const handleStart = (config: {
        mode: string
        difficulty: string
        color: string
        theme: string
    }) => {
        const params = new URLSearchParams({
            mode:       config.mode,
            difficulty: config.difficulty,
            color:      config.color,
            theme:      config.theme,
        })
        router.push(`/game/play?${params.toString()}`)
    }

    return (
        <GameMenu
            userId={userId}
            favoriteTheme={favoriteTheme}
            onStart={handleStart}
        />
    )
}