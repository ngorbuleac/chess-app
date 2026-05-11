'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
    const { user } = useUser()
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header
            style={{
                background: 'rgba(10,10,15,0.85)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(212,175,55,0.15)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}
        >
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>

                    {/* Logo */}
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '28px', lineHeight: 1 }}>♔</span>
                            <span
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '22px',
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #A0832A, #F0D060, #A0832A)',
                                    backgroundSize: '200% auto',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Chess Club
                            </span>
                        </div>
                    </Link>

                    {/* Nav desktop */}
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {[
                            { href: '/',      label: 'Home' },
                            { href: '/game',  label: 'Gioca' },
                            { href: '/stats', label: 'Statistiche' },
                        ].map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    color: '#9CA3AF',
                                    textDecoration: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => {
                                    (e.target as HTMLElement).style.color = '#D4AF37'
                                    ;(e.target as HTMLElement).style.background = 'rgba(212,175,55,0.08)'
                                }}
                                onMouseLeave={e => {
                                    (e.target as HTMLElement).style.color = '#9CA3AF'
                                    ;(e.target as HTMLElement).style.background = 'transparent'
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Utente */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {user && (
                            <span style={{ color: '#6B7280', fontSize: '13px' }}>
                                {user.firstName ?? user.emailAddresses[0]?.emailAddress}
                            </span>
                        )}
                        <UserButton />
                    </div>

                </div>
            </div>
        </header>
    )
}