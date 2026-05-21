'use client'
import { useEffect, useState } from 'react'
import { adminAPI } from '@/lib/api'
import { fmtKES, fmtDateTime } from '@/lib/auth'

const STATUS_COLOR: any = { SUCCESSFUL: '#00D4AA', PENDING: '#FFD700', FAILED: '#FF4560', REVERSED: '#9C92FF' }

export default function AdminTransactionsPage() {
  const [txs,     setTxs]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(1)
  const [total,   setTotal]   = useState(0)
  const [filter,  setFilter]  = useState({ type: '', status: '' })

  const load = () => {
    setLoading(true)
    adminAPI.transactions({ page, ...filter })
      .then(res => { setTxs(res.data.transactions || []); setTotal(res.data.pagination?.total || 0) })
      .catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page, filter])

  const reverse = async (id: string) => {
    if (!confirm('Reverse this transaction?')) return
    await adminAPI.reverseTransaction(id)
    load()
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '26px', marginBottom: '2px' }}>Transactions</h1>
          <p style={{ color: '#8888AA', fontSize: '14px' }}>{total} total</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}
            style={{ padding: '8px 12px', borderRadius: '8px', background: '#1A1A26', border: '1px solid #2A2A3E', color: '#F0F0FF', fontSize: '12px', outline: 'none' }}>
            <option value="">All Types</option>
            {['TRANSFER', 'MPESA_DEPOSIT', 'MPESA_WITHDRAW', 'FOREX_BUY', 'FOREX_SELL', 'INVESTMENT_IN', 'BILL_PAYMENT'].map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}
            style={{ padding: '8px 12px', borderRadius: '8px', background: '#1A1A26', border: '1px solid #2A2A3E', color: '#F0F0FF', fontSize: '12px', outline: 'none' }}>
            <option value="">All Status</option>
            {['SUCCESSFUL', 'PENDING', 'FAILED', 'REVERSED'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr 80px', padding: '10px 16px', background: '#1A1A26', borderBottom: '1px solid #2A2A3E' }}>
          {['Reference', 'Type', 'Amount / Fee', 'Status', 'Date', 'Action'].map(h => (
            <span key={h} style={{ color: '#44445A', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{h}</span>
          ))}
        </div>

        {loading ? [1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '52px', margin: '6px 12px', borderRadius: '8px' }} />) : (
          txs.map((tx, i) => (
            <div key={tx.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr 80px', padding: '12px 16px', borderBottom: i < txs.length - 1 ? '1px solid #2A2A3E' : 'none', alignItems: 'center' }}>
              <p style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: '#6C63FF' }}>{tx.reference}</p>
              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(108,99,255,0.1)', color: '#9C92FF', fontWeight: 500 }}>{tx.type?.replace('_', ' ')}</span>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#F0F0FF' }}>{fmtKES(tx.amount)}</p>
                {tx.fee > 0 && <p style={{ fontSize: '11px', color: '#FF6B35' }}>Fee: {fmtKES(tx.fee)}</p>}
              </div>
              <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '20px', background: STATUS_COLOR[tx.status] + '18', color: STATUS_COLOR[tx.status], fontWeight: 600 }}>{tx.status}</span>
              <p style={{ fontSize: '11px', color: '#44445A' }}>{fmtDateTime(tx.created_at)}</p>
              {tx.status === 'SUCCESSFUL' && tx.type === 'TRANSFER' ? (
                <button onClick={() => reverse(tx.id)} style={{ padding: '5px 10px', borderRadius: '6px', background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.25)', color: '#FF4560', cursor: 'pointer', fontSize: '11px' }}>
                  Reverse
                </button>
              ) : <span />}
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
          style={{ padding: '8px 16px', borderRadius: '8px', background: 'none', border: '1px solid #2A2A3E', color: '#8888AA', cursor: 'pointer', fontSize: '13px' }}>← Prev</button>
        <span style={{ padding: '8px 16px', color: '#8888AA', fontSize: '13px' }}>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={txs.length < 20}
          style={{ padding: '8px 16px', borderRadius: '8px', background: 'none', border: '1px solid #2A2A3E', color: '#8888AA', cursor: 'pointer', fontSize: '13px' }}>Next →</button>
      </div>
    </div>
  )
}
