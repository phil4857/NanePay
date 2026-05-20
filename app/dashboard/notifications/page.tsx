'use client'
import { useEffect, useState } from 'react'
import { notifAPI } from '@/lib/api'
import { fmtDateTime } from '@/lib/auth'

const TYPE_CONFIG: any = {
  PAYMENT:      { icon: '💸', color: '#00D4AA' },
  SUBSCRIPTION: { icon: '📶', color: '#6C63FF' },
  WITHDRAWAL:   { icon: '🏦', color: '#FFD700' },
  SECURITY:     { icon: '🔒', color: '#FF4560' },
  PROMO:        { icon: '🎉', color: '#FF6B35' },
  SYSTEM:       { icon: '⚙️', color: '#8888AA' },
}

export default function NotificationsPage() {
  const [notifs,  setNotifs]  = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notifAPI.list()
      .then(res => setNotifs(res.data.notifications || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const markAll = async () => {
    await notifAPI.readAll()
    setNotifs(n => n.map(x => ({ ...x, is_read: true })))
  }

  const markOne = async (id: string) => {
    await notifAPI.read(id)
    setNotifs(n => n.map(x => x.id === id ? { ...x, is_read: true } : x))
  }

  const unread = notifs.filter(n => !n.is_read).length

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '28px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '26px', marginBottom: '2px' }}>
            Notifications
          </h1>
          <p style={{ color: '#8888AA', fontSize: '14px' }}>{unread} unread</p>
        </div>
        {unread > 0 && (
          <button onClick={markAll} style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: '8px', padding: '8px 14px', color: '#6C63FF', fontSize: '13px', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
            Mark all read
          </button>
        )}
      </div>

      <div style={{ background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          [1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '72px', margin: '8px', borderRadius: '10px' }} />)
        ) : notifs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔔</div>
            <p style={{ color: '#8888AA' }}>No notifications yet</p>
          </div>
        ) : (
          notifs.map((n, i) => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.SYSTEM
            return (
              <div key={n.id}
                onClick={() => !n.is_read && markOne(n.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '16px 18px',
                  borderBottom: i < notifs.length - 1 ? '1px solid #2A2A3E' : 'none',
                  background: n.is_read ? 'transparent' : 'rgba(108,99,255,0.04)',
                  cursor: n.is_read ? 'default' : 'pointer', transition: 'background 0.2s',
                }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: cfg.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  {cfg.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <p style={{ fontSize: '14px', fontWeight: n.is_read ? 400 : 600, marginBottom: '3px' }}>{n.title}</p>
                    {!n.is_read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6C63FF', flexShrink: 0, marginTop: '4px' }} />}
                  </div>
                  <p style={{ fontSize: '13px', color: '#8888AA', marginBottom: '4px', lineHeight: 1.4 }}>{n.body}</p>
                  <p style={{ fontSize: '11px', color: '#44445A' }}>{fmtDateTime(n.created_at)}</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
