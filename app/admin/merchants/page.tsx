'use client'
import { useEffect, useState } from 'react'
import { adminAPI } from '@/lib/api'
import { fmtDate } from '@/lib/auth'

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)
  const [filter,    setFilter]    = useState('PENDING')

  const load = () => {
    setLoading(true)
    adminAPI.merchants({ status: filter })
      .then(res => setMerchants(res.data.merchants || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filter])

  const approve = async (id: string, action: string, reason?: string) => {
    await adminAPI.approveMerchant(id, { action, reason })
    load()
  }

  const STATUS_COLOR: any = { PENDING: '#FFD700', APPROVED: '#00D4AA', REJECTED: '#FF4560', SUSPENDED: '#FF4560' }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '26px' }}>Merchants</h1>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
              background: filter === s ? STATUS_COLOR[s] + '15' : 'transparent',
              border: `1px solid ${filter === s ? STATUS_COLOR[s] : '#2A2A3E'}`,
              color: filter === s ? STATUS_COLOR[s] : '#8888AA',
            }}>{s}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '14px' }} />) : (
          merchants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#8888AA' }}>
              No {filter.toLowerCase()} merchants
            </div>
          ) : merchants.map(m => (
            <div key={m.id} style={{ background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '14px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #6C63FF, #00D4AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, color: '#fff' }}>
                    {m.business_name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '3px' }}>{m.business_name}</p>
                    <p style={{ color: '#44445A', fontSize: '12px' }}>{m.business_type} · {m.email} · {m.phone}</p>
                    <p style={{ color: '#44445A', fontSize: '12px' }}>Joined {fmtDate(m.created_at)}</p>
                  </div>
                </div>
                <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '20px', background: STATUS_COLOR[m.status] + '18', color: STATUS_COLOR[m.status], fontWeight: 600 }}>
                  {m.status}
                </span>
              </div>

              {m.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #2A2A3E' }}>
                  <button onClick={() => approve(m.id, 'approve')} style={{ flex: 1, padding: '9px', borderRadius: '8px', background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.25)', color: '#00D4AA', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                    ✅ Approve
                  </button>
                  <button onClick={() => { const r = prompt('Rejection reason:'); if (r) approve(m.id, 'reject', r) }} style={{ flex: 1, padding: '9px', borderRadius: '8px', background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.25)', color: '#FF4560', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                    ❌ Reject
                  </button>
                </div>
              )}

              {m.status === 'APPROVED' && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #2A2A3E' }}>
                  <button onClick={() => approve(m.id, 'suspend')} style={{ padding: '7px 14px', borderRadius: '8px', background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.25)', color: '#FF4560', cursor: 'pointer', fontSize: '12px' }}>
                    Suspend Merchant
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
