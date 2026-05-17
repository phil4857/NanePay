'use client'
import { useEffect, useState } from 'react'
import { txAPI } from '@/lib/api'

const TYPES = ['ALL', 'TRANSFER', 'MPESA_DEPOSIT', 'MPESA_WITHDRAW', 'FOREX_BUY', 'INVESTMENT_IN']
const STATUS_COLOR: any = {
  SUCCESSFUL: '#52b788', PENDING: '#d4a853', FAILED: '#e74c3c', REVERSED: '#9b59b6'
}

export default function HistoryPage() {
  const [txs,     setTxs]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('ALL')
  const [page,    setPage]    = useState(1)
  const [total,   setTotal]   = useState(0)

  useEffect(() => {
    setLoading(true)
    const params: any = { page, limit: 20 }
    if (filter !== 'ALL') params.type = filter
    txAPI.list(params)
      .then(res => { setTxs(res.data.transactions); setTotal(res.data.pagination.total) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filter, page])

  const fmt = (n: number) => `KES ${(n || 0).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="font-display font-extrabold text-3xl mb-1">Transaction History</h1>
      <p className="text-soft mb-6">{total} total transactions</p>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {TYPES.map(t => (
          <button key={t} onClick={() => { setFilter(t); setPage(1) }}
            className="px-4 py-1.5 rounded-full text-xs transition-all"
            style={{
              background: filter === t ? 'rgba(200,96,42,0.15)' : 'transparent',
              border: `1px solid ${filter === t ? '#c8602a' : '#2a211a'}`,
              color: filter === t ? '#c8602a' : '#6b5a4e', cursor: 'pointer',
            }}>
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="rounded-2xl p-6" style={{ background: '#161210', border: '1px solid #2a211a' }}>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: '#2a211a' }} />)}
          </div>
        ) : txs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-soft">No transactions found</p>
          </div>
        ) : (
          txs.map((tx, i) => (
            <div key={tx.id} className="flex items-center justify-between py-4"
              style={{ borderBottom: i < txs.length - 1 ? '1px solid #2a211a' : 'none' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{
                    background: tx.direction === 'in' ? 'rgba(82,183,136,0.12)' : 'rgba(200,96,42,0.12)',
                    color:      tx.direction === 'in' ? '#52b788' : '#c8602a',
                  }}>
                  {tx.type === 'MPESA_DEPOSIT' ? '📱' : tx.type === 'MPESA_WITHDRAW' ? '🏦'
                    : tx.type === 'FOREX_BUY' ? '💱' : tx.type === 'INVESTMENT_IN' ? '📈'
                    : tx.direction === 'in' ? '↙' : '↗'}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {tx.type === 'MPESA_DEPOSIT' ? 'M-Pesa Deposit'
                      : tx.type === 'MPESA_WITHDRAW' ? 'M-Pesa Withdrawal'
                      : tx.type === 'FOREX_BUY' ? `Bought ${tx.forex_currency}`
                      : tx.type === 'INVESTMENT_IN' ? 'Investment'
                      : tx.direction === 'in' ? tx.sender?.name : tx.receiver?.name || tx.type}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#6b5a4e' }}>
                    {new Date(tx.created_at).toLocaleString()} · {tx.reference}
                  </p>
                  {tx.fee > 0 && <p className="text-xs" style={{ color: '#c8602a66' }}>Fee: KES {tx.fee}</p>}
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="font-display font-semibold text-sm mb-1"
                  style={{ color: tx.direction === 'in' ? '#52b788' : '#f0e6dc' }}>
                  {tx.direction === 'in' ? '+' : '−'}{fmt(tx.amount)}
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: STATUS_COLOR[tx.status] + '18', color: STATUS_COLOR[tx.status] }}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {total > 20 && (
          <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: '1px solid #2a211a' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 rounded-xl text-sm disabled:opacity-40"
              style={{ border: '1px solid #2a211a', color: '#a8917f', cursor: 'pointer', background: 'none' }}>
              ← Prev
            </button>
            <span className="text-soft text-sm">Page {page} of {Math.ceil(total / 20)}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 20)}
              className="px-4 py-2 rounded-xl text-sm disabled:opacity-40"
              style={{ border: '1px solid #2a211a', color: '#a8917f', cursor: 'pointer', background: 'none' }}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
