import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { getStats, upsertUser } from '@/lib/supabase'

export default async function HomePage() {
    const user = await currentUser()
    if (!user) redirect('/sign-in')

    await upsertUser(user.id)
    const stats = await getStats(user.id)

    const total = (stats?.wins ?? 0) + (stats?.losses ?? 0) + (stats?.draws ?? 0)
    const winRate = total > 0 ? Math.round(((stats?.wins ?? 0) / total) * 100) : 0

    return (
        <div style={{ minHeight: '100vh', background: '#0A0A0F' }}>
            <Header />

            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>

                {/* Hero */}
                <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px', lineHeight: 1 }}>♔</div>
                    <h1
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(36px, 5vw, 56px)',
                            fontWeight: 700,
                            marginBottom: '12px',
                            background: 'linear-gradient(135deg, #A0832A, #F0D060, #A0832A)',
                            backgroundSize: '200% auto',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Benvenuto, {user.firstName ?? 'Giocatore'}
                    </h1>
                    <p style={{ color: '#6B7280', fontSize: '18px', fontWeight: 300 }}>
                        Il tuo regno scacchistico ti aspetta
                    </p>
                </div>

                {/* Stats grid */}
                <div
                    className="animate-fade-in-up delay-100"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '48px',
                    }}
                >
                    {[
                        { value: stats?.wins ?? 0,   label: 'Vittorie',       color: '#34D399', icon: '🏆' },
                        { value: stats?.losses ?? 0, label: 'Sconfitte',      color: '#F87171', icon: '💀' },
                        { value: stats?.draws ?? 0,  label: 'Patte',          color: '#FBBF24', icon: '🤝' },
                        { value: `${winRate}%`,      label: 'Win Rate',       color: '#D4AF37', icon: '📈' },
                        { value: total,              label: 'Partite totali', color: '#60A5FA', icon: '🎮' },
                    ].map((stat, i) => (
                        <div
                            key={stat.label}
                            className="glass-card"
                            style={{ padding: '28px 20px', textAlign: 'center' }}
                        >
                            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                            <div style={{ fontSize: '36px', fontWeight: 700, color: stat.color, lineHeight: 1, marginBottom: '8px' }}>
                                {stat.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="divider-gold animate-fade-in-up delay-200" style={{ marginBottom: '48px' }} />

                {/* CTA buttons */}
                <div
                    className="animate-fade-in-up delay-300"
                    style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
                >
                    <Link href="/game" style={{ textDecoration: 'none' }}>
                        <button className="btn-gold" style={{ fontSize: '18px', padding: '18px 48px' }}>
                            ♟ Nuova partita
                        </button>
                    </Link>
                    <Link href="/stats" style={{ textDecoration: 'none' }}>
                        <button className="btn-outline" style={{ fontSize: '18px', padding: '18px 48px' }}>
                            📊 Statistiche
                        </button>
                    </Link>
                </div>

            </main>
        </div>
    )
}