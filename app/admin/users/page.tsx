'use client'
import { useEffect, useState } from 'react'
import { adminAPI } from '@/lib/api'
import { fmtKES, fmtDate } from '@/lib/auth'

export default function AdminUsersPage() {
  const [users,   setUsers]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [page,    setPage]    = useState(1)
  const [total,   setTotal]   = useState(0)

  const load = () => {
    setLoading(true)
    adminAPI.users({ page, search: search || undefined })
      .then(res => { setUsers(res.data.users); setTotal(res.data.pagination?.total || 0) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page])
  useEffect(() => { const t = setTimeout(load, 400); return () => clearTimeout(t) }, [search])

  const suspend = async (id: string) => {
    await adminAPI.suspendUser(id)
    load()
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '26px', marginBottom: '2px' }}>Users</h1>
          <p style={{ color: '#8888AA', fontSize: '14px' }}>{total} total users</p>
        </div>
        <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '10px', background: '#1A1A26', border: '1px solid #2A2A3E', color: '#F0F0FF', fontSize: '13px', outline: 'none', width: '200px' }} />
      </div>

      <div style={{ background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 80px', padding: '10px 16px', borderBottom: '1px solid #2A2A3E', background: '#1A1A26' }}>
          {['Name', 'Email', 'Phone', 'Balance', 'Joined', 'Action'].map(h => (
            <span key={h} style={{ color: '#44445A', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' as const }}>{h}</span>
          ))}
        </div>

        {loading ? [1,2,3,4,5].map(i => (
          <div key={i} className="skeleton" style={{ height: '52px', margin: '6px 12px', borderRadius: '8px' }} />
        )) : users.map((u, i) => (
          <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 80px', padding: '12px 16px', borderBottom: i < users.length - 1 ? '1px solid #2A2A3E' : 'none', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #00D4AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {u.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 500 }}>{u.name}</p>
                <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '20px', background: u.role === 'admin' ? 'rgba(255,215,0,0.1)' : u.role === 'merchant' ? 'rgba(0,212,170,0.1)' : 'rgba(108,99,255,0.1)', color: u.role === 'admin' ? '#FFD700' : u.role === 'merchant' ? '#00D4AA' : '#6C63FF' }}>{u.role}</span>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#8888AA', overflow: 'hidden', textOverflow: 'ellipsis' as const, whiteSpace: 'nowrap' as const }}>{u.email}</p>
            <p style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>{u.phone}</p>
            <p style={{ fontSize: '13px', color: '#00D4AA', fontWeight: 500 }}>{fmtKES(u.balance)}</p>
            <p style={{ fontSize: '12px', color: '#44445A' }}>{fmtDate(u.created_at)}</p>
            <button onClick={() => suspend(u.id)} style={{
              padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 600,
              background: u.is_active ? 'rgba(255,69,96,0.1)' : 'rgba(0,212,170,0.1)',
              border: `1px solid ${u.is_active ? 'rgba(255,69,96,0.25)' : 'rgba(0,212,170,0.25)'}`,
              color: u.is_active ? '#FF4560' : '#00D4AA',
            }}>
              {u.is_active ? 'Suspend' : 'Restore'}
            </button>
          </div>
        ))}
      </div>

      {total > 20 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: '8px 16px', borderRadius: '8px', background: 'none', border: '1px solid #2A2A3E', color: '#8888AA', cursor: 'pointer', fontSize: '13px' }}>← Prev</button>
          <span style={{ padding: '8px 16px', color: '#8888AA', fontSize: '13px' }}>Page {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={users.length < 20}
            style={{ padding: '8px 16px', borderRadius: '8px', background: 'none', border: '1px solid #2A2A3E', color: '#8888AA', cursor: 'pointer', fontSize: '13px' }}>Next →</button>
        </div>
      )}
    </div>
  )
}
