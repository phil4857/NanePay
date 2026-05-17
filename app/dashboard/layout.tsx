'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { isLoggedIn, getUser, clearAuth } from '@/lib/auth'

const NAV = [
  { href: '/dashboard',          icon: '◈', label: 'Dashboard'  },
  { href: '/dashboard/send',     icon: '↗', label: 'Send'       },
  { href: '/dashboard/deposit',  icon: '📱', label: 'Deposit'   },
  { href: '/dashboard/withdraw', icon: '🏦', label: 'Withdraw'  },
  { href: '/dashboard/invest',   icon: '📈', label: 'Invest'    },
  { href: '/dashboard/forex',    icon: '💱', label: 'Forex'     },
  { href: '/dashboard/merchant', icon: '🏪', label: 'Merchant'  },
  { href: '/dashboard/history',  icon: '≡',  label: 'History'   },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const path     = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/auth/login'); return }
    setUser(getUser())
  }, [])

  const logout = () => {
    clearAuth()
    router.push('/auth/login')
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0 flex flex-col"
        style={{ background: '#161210', borderRight: '1px solid #2a211a' }}>

        {/* Logo */}
        <div className="p-5" style={{ borderBottom: '1px solid #2a211a' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs font-display"
              style={{ background: 'linear-gradient(135deg, #c8602a, #d4a853)' }}>N</div>
            <span className="font-display font-bold">NanePay</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          {NAV.map(({ href, icon, label }) => {
            const active = path === href || (href !== '/dashboard' && path.startsWith(href))
            return (
              <Link key={href} href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 20px', textDecoration: 'none',
                  color:      active ? '#c8602a' : '#6b5a4e',
                  background: active ? 'rgba(200,96,42,0.08)' : 'transparent',
                  borderLeft: active ? '2px solid #c8602a' : '2px solid transparent',
                  fontWeight: active ? 500 : 400,
                  fontSize: '13px', transition: 'all 0.15s',
                }}>
                <span>{icon}</span>{label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4" style={{ borderTop: '1px solid #2a211a' }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold font-display flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #c8602a, #d4a853)' }}>
              {user?.name?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs" style={{ color: '#6b5a4e' }}>Personal</p>
            </div>
          </div>
          <button onClick={logout} className="text-xs hover:text-white transition-colors"
            style={{ color: '#6b5a4e', background: 'none', border: 'none', cursor: 'pointer' }}>
            Sign out →
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-pattern">
        {children}
      </main>
    </div>
  )
}
