'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { isLoggedIn, getUser, clearAuth } from '@/lib/auth'
import { notifAPI } from '@/lib/api'

const NAV = [
  { href: '/dashboard',               icon: '⊞',  label: 'Dashboard'  },
  { href: '/dashboard/send',          icon: '↗',  label: 'Send'       },
  { href: '/dashboard/deposit',       icon: '↙',  label: 'Deposit'    },
  { href: '/dashboard/withdraw',      icon: '↑',  label: 'Withdraw'   },
  { href: '/dashboard/bills',         icon: '🧾', label: 'Pay Bills'  },
  { href: '/dashboard/packages',      icon: '📶', label: 'Packages'   },
  { href: '/dashboard/invest',        icon: '📈', label: 'Invest'     },
  { href: '/dashboard/forex',         icon: '💱', label: 'Forex'      },
  { href: '/dashboard/merchant',      icon: '🏪', label: 'Merchant'   },
  { href: '/dashboard/qr',            icon: '⬡',  label: 'QR Pay'     },
  { href: '/dashboard/request',       icon: '🤝', label: 'Request'    },
  { href: '/dashboard/history',       icon: '≡',  label: 'History'    },
  { href: '/dashboard/notifications', icon: '🔔', label: 'Alerts'     },
  { href: '/dashboard/settings',      icon: '⚙️', label: 'Settings'   },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const path   = usePathname()
  const [user, setUser]           = useState<any>(null)
  const [unread, setUnread]       = useState(0)
  const [sidebarOpen, setSidebar] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/auth/login'); return }
    setUser(getUser())
    notifAPI.list().then(r => setUnread(r.data.unread_count || 0)).catch(() => {})
  }, [])

  const logout = () => { clearAuth(); router.push('/auth/login') }

  const NavItem = ({ href, icon, label }: any) => {
    const active  = path === href || (href !== '/dashboard' && path.startsWith(href))
    const isNotif = href.includes('notifications')
    return (
      <Link href={href} onClick={() => setSidebar(false)} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 16px', textDecoration: 'none',
        color:      active ? '#6C63FF' : '#8888AA',
        background: active ? 'rgba(108,99,255,0.1)' : 'transparent',
        borderLeft: `2px solid ${active ? '#6C63FF' : 'transparent'}`,
        fontSize: 13, fontWeight: active ? 600 : 400,
        transition: 'all 0.15s', borderRadius: '0 8px 8px 0', position: 'relative',
      }}>
        <span style={{ fontSize: 15 }}>{icon}</span>
        {label}
        {isNotif && unread > 0 && (
          <span style={{
            marginLeft: 'auto', background: '#FF4560', color: '#fff',
            borderRadius: 10, padding: '1px 7px', fontSize: 10, fontWeight: 700,
          }}>{unread}</span>
        )}
      </Link>
    )
  }

  const Sidebar = () => (
    <aside style={{
      width: 210, flexShrink: 0, display: 'flex', flexDirection: 'column',
      background: '#12121A', borderRight: '1px solid #2A2A3E',
      height: '100vh', position: 'sticky', top: 0,
    }}>
      <div style={{ padding: '18px 16px', borderBottom: '1px solid #2A2A3E' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #6C63FF, #00D4AA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800, color: '#fff',
          }}>N</div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff' }}>NanePay</span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {NAV.map(n => <NavItem key={n.href} {...n} />)}
        {user?.role === 'admin' && (
          <Link href="/admin" style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
            textDecoration: 'none', fontSize: 13, fontWeight: 600, marginTop: 8,
            color: path.startsWith('/admin') ? '#FFD700' : '#8888AA',
            background: path.startsWith('/admin') ? 'rgba(255,215,0,0.08)' : 'transparent',
            borderLeft: `2px solid ${path.startsWith('/admin') ? '#FFD700' : 'transparent'}`,
          }}>
            <span>⚙️</span> Admin Panel
          </Link>
        )}
      </nav>

      <div style={{ padding: '14px 16px', borderTop: '1px solid #2A2A3E' }}>
        <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #6C63FF, #00D4AA)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff',
            }}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'User'}
              </p>
              <p style={{ fontSize: 11, color: '#44445A', textTransform: 'capitalize', margin: 0 }}>
                {user?.role || 'personal'}
              </p>
            </div>
          </div>
        </Link>
        <button onClick={logout} style={{
          background: 'none', border: '1px solid #2A2A3E', borderRadius: 8,
          color: '#8888AA', cursor: 'pointer', fontSize: 12,
          width: '100%', padding: 7, transition: 'all 0.15s',
        }}
          onMouseEnter={e => { (e.currentTarget as any).style.borderColor = '#FF4560'; (e.currentTarget as any).style.color = '#FF4560' }}
          onMouseLeave={e => { (e.currentTarget as any).style.borderColor = '#2A2A3E'; (e.currentTarget as any).style.color = '#8888AA' }}>
          Sign out
        </button>
      </div>
    </aside>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0F' }}>
      <style>{`
        .np-sidebar { display: flex !important; }
        .np-topbar  { display: none  !important; }
        @media (max-width: 768px) {
          .np-sidebar { display: none !important; }
          .np-topbar  { display: flex !important; }
        }
      `}</style>

      {/* Desktop sidebar */}
      <div className="np-sidebar" style={{ display: 'flex' }}>
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div onClick={() => setSidebar(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
          <div style={{ position: 'relative', zIndex: 51 }}><Sidebar /></div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mobile topbar */}
        <div className="np-topbar" style={{
          display: 'none', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', background: '#12121A', borderBottom: '1px solid #2A2A3E',
        }}>
          <button onClick={() => setSidebar(true)} style={{
            background: 'none', border: '1px solid #2A2A3E', borderRadius: 8,
            color: '#8888AA', cursor: 'pointer', padding: '6px 10px', fontSize: 16,
          }}>☰</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #6C63FF, #00D4AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>N</div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#fff' }}>NanePay</span>
          </div>
          <Link href="/dashboard/notifications" style={{ position: 'relative', color: '#8888AA', textDecoration: 'none', fontSize: 20 }}>
            🔔
            {unread > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: '#FF4560', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{unread}</span>}
          </Link>
        </div>

        <main style={{
          flex: 1, overflowY: 'auto', background: '#0A0A0F',
          backgroundImage: 'radial-gradient(ellipse at 20% 10%, rgba(108,99,255,0.05) 0%, transparent 40%)',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}
