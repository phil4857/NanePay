'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { walletAPI, txAPI } from '@/lib/api'

export default function DashboardPage() {
  const [wallet, setWallet] = useState<any>(null)
  const [txs,    setTxs]    = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([walletAPI.get(), txAPI.list({ limit: 5 })])
      .then(([w, t]) => {
        setWallet(w.data)
        setTxs(t.data.transactions || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const fmt = (n: number) => `KES ${(n || 0).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`

  const STATUS_COLOR: any = {
    SUCCESSFUL: '#52b788', PENDING: '#d4a853', FAILED: '#e74c3c', REVERSED: '#9b59b6'
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Balance Card */}
      <div className="rounded-3xl p-8 mb-6 relative overflow-hidden fade-up"
        style={{ background: 'linear-gradient(135deg, #1a0f08, #2a1a10)', border: '1px solid #2a211a' }}>
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,96,42,0.15), transparent)' }} />
        <p className="text-soft text-sm mb-2">Total Balance</p>
        {loading ? (
          <div className="h-12 w-48 rounded-xl animate-pulse" style={{ background: '#2a211a' }} />
        ) : (
          <h1 className="font-display font-extrabold text-5xl text-gradient tracking-tight mb-1">
            {fmt(wallet?.balance)}
          </h1>
        )}
        <p className="text-sm mt-1" style={{ color: '#6b5a4e' }}>KES · Wallet Balance</p>

        {wallet?.investment_balance > 0 && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid #2a211a' }}>
            <p className="text-soft text-xs">Investing: <span style={{ color: '#52b788' }}>{fmt(wallet.investment_balance)}</span></p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3 mb-6 fade-up-1">
        {[
          { href: '/dashboard/send',     icon: '↗', label: 'Send',    color: '#c8602a' },
          { href: '/dashboard/deposit',  icon: '📱', label: 'Deposit', color: '#52b788' },
          { href: '/dashboard/invest',   icon: '📈', label: 'Invest',  color: '#9b59b6' },
          { href: '/dashboard/forex',    icon: '💱', label: 'Forex',   color: '#d4a853' },
          { href: '/dashboard/withdraw', icon: '🏦', label: 'Withdraw',color: '#d4a853' },
          { href: '/dashboard/merchant', icon: '🏪', label: 'Merchant',color: '#e67e22' },
          { href: '/dashboard/history',  icon: '≡',  label: 'History', color: '#6b5a4e' },
          { href: '/dashboard/send',     icon: '📋', label: 'Pay Bill',color: '#c8602a' },
        ].map(({ href, icon, label, color }) => (
          <Link key={label} href={href} style={{ textDecoration: 'none' }}>
            <div className="rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200"
              style={{ background: '#161210', border: `1px solid #2a211a` }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a211a')}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: color + '18' }}>{icon}</div>
              <span className="text-xs" style={{ color: '#a8917f' }}>{label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl p-6 fade-up-2" style={{ background: '#161210', border: '1px solid #2a211a' }}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-display font-bold text-lg">Recent Transactions</h2>
          <Link href="/dashboard/history" style={{ color: '#6b5a4e', textDecoration: 'none', fontSize: '13px' }}>
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: '#2a211a' }} />
            ))}
          </div>
        ) : txs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">💸</div>
            <p className="text-soft">No transactions yet</p>
            <p className="text-muted text-sm mt-1">Make your first deposit to get started</p>
          </div>
        ) : (
          txs.map((tx, i) => (
            <div key={tx.id} className="flex items-center justify-between py-3.5"
              style={{ borderBottom: i < txs.length - 1 ? '1px solid #2a211a' : 'none' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base"
                  style={{
                    background: tx.direction === 'in' ? 'rgba(82,183,136,0.12)' : 'rgba(200,96,42,0.12)',
                    color:      tx.direction === 'in' ? '#52b788' : '#c8602a',
                  }}>
                  {tx.type === 'MPESA_DEPOSIT' ? '📱' : tx.type === 'FOREX_BUY' ? '💱' : tx.direction === 'in' ? '↙' : '↗'}
                </div>
                <div>
                  <p className="text-sm font-medium">{tx.sender?.name || tx.receiver?.name || tx.type}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6b5a4e' }}>
                    {new Date(tx.created_at).toLocaleDateString()} · {tx.reference}
                  </p>
                  {tx.fee > 0 && <p className="text-xs" style={{ color: '#c8602a88' }}>Fee: KES {tx.fee}</p>}
                </div>
              </div>
              <div className="text-right">
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
      </div>
    </div>
  )
}
