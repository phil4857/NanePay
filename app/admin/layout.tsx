'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { isLoggedIn, isAdmin, clearAuth } from '@/lib/auth'

const ADMIN_NAV = [
  { href: '/admin',                  icon: '⊞', label: 'Overview'      },
  { href: '/admin/users',            icon: '👥', label: 'Users'         },
  { href: '/admin/merchants',        icon: '🏪', label: 'Merchants'     },
  { href: '/admin/transactions',     icon: '💸', label: 'Transactions'  },
  { href: '/admin/subscriptions',    icon: '📶', label: 'Subscriptions' },
  { href: '/admin/withdrawals',      icon: '🏦', label: 'Withdrawals'   },
  { href: '/admin/revenue',          icon: '📊', label: 'Revenue'       },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const path   = usePathname()

  useEffect(() => {
    if (!isLoggedIn() || !isAdmin()) { router.push('/auth/login') }
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0F' }}>
      {/* Sidebar */}
      <aside style={{ width: '200px', flexShrink: 0, background: '#12121A', borderRight: '1px solid #2A2A3E', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
        <div style={{ padding: '18px 16px', borderBottom: '1px solid #2A2A3E' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#0A0A0F' }}>A</div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '14px' }}>Admin Panel</span>
          </div>
          <p style={{ color: '#44445A', fontSize: '11px' }}>NanePay v2.0</p>
        </div>

        <nav style={{ flex: 1, padding: '12px 0' }}>
          {ADMIN_NAV.map(({ href, icon, label }) => {
            const active = path === href || (href !== '/admin' && path.startsWith(href))
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 16px', textDecoration: 'none',
                color:      active ? '#FFD700' : '#8888AA',
                background: active ? 'rgba(255,215,0,0.08)' : 'transparent',
                borderLeft: `2px solid ${active ? '#FFD700' : 'transparent'}`,
                fontSize: '13px', fontWeight: active ? 600 : 400, transition: 'all 0.15s',
              }}>
                <span>{icon}</span>{label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '14px 16px', borderTop: '1px solid #2A2A3E' }}>
          <Link href="/dashboard" style={{ display: 'block', color: '#8888AA', fontSize: '12px', textDecoration: 'none', marginBottom: '8px' }}>← User Dashboard</Link>
          <button onClick={() => { clearAuth(); router.push('/auth/login') }} style={{ background: 'none', border: '1px solid #2A2A3E', borderRadius: '8px', color: '#FF4560', cursor: 'pointer', fontSize: '12px', width: '100%', padding: '7px', fontFamily: 'Space Grotesk, sans-serif' }}>
            Sign Out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto', background: '#0A0A0F', backgroundImage: 'radial-gradient(ellipse at 80% 10%, rgba(255,215,0,0.04) 0%, transparent 40%)' }}>
        {children}
      </main>
    </div>
  )
}
