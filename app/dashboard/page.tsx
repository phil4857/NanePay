'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { walletAPI, txAPI } from '@/lib/api'
import { getUser, fmtKES, fmtDateTime } from '@/lib/auth'

const STATUS_COLOR: any = {
  SUCCESSFUL: '#00D4AA', PENDING: '#FFD700', FAILED: '#FF4560', REVERSED: '#9C92FF'
}

const TX_ICON: any = {
  MPESA_DEPOSIT: '📱', MPESA_WITHDRAW: '🏦', FOREX_BUY: '💱',
  INVESTMENT_IN: '📈', BILL_PAYMENT: '🧾', TRANSFER: null,
}

export default function DashboardPage() {
  const [wallet,  setWallet]  = useState<any>(null)
  const [txs,     setTxs]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const user = getUser()

  useEffect(() => {
    Promise.all([walletAPI.get(), txAPI.list({ limit: 6 })])
      .then(([w, t]) => { setWallet(w.data); setTxs(t.data.transactions || []) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const ACTIONS = [
    { href: '/dashboard/send',     icon: '↗', label: 'Send',     color: '#6C63FF' },
    { href: '/dashboard/deposit',  icon: '↙', label: 'Deposit',  color: '#00D4AA' },
    { href: '/dashboard/withdraw', icon: '↑', label: 'Withdraw', color: '#FFD700' },
    { href: '/dashboard/invest',   icon: '📈', label: 'Invest',  color: '#9C92FF' },
    { href: '/dashboard/forex',    icon: '💱', label: 'Forex',   color: '#00D4AA' },
    { href: '/dashboard/bills',    icon: '🧾', label: 'Bills',   color: '#FF6B35' },
    { href: '/dashboard/qr',       icon: '⬡',  label: 'QR Pay', color: '#6C63FF' },
    { href: '/dashboard/request',  icon: '🤝', label: 'Request', color: '#FFD700' },
  ]

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 20px' }}>

      {/* Greeting */}
      <div style={{ marginBottom: '24px' }} className="fade-up">
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '26px', marginBottom: '2px' }}>
          Hello, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p style={{ color: '#8888AA', fontSize: '14px' }}>Here's your financial overview</p>
      </div>

      {/* Balance Card */}
      <div className="fade-up" style={{
        borderRadius: '24px', padding: '32px', marginBottom: '20px',
        background: 'linear-gradient(135deg, #12121A 0%, #1A1A26 100%)',
        border: '1px solid #2A2A3E', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.15), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, right: 100, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,170,0.1), transparent)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }}>
          <p style={{ color: '#8888AA', fontSize: '13px', marginBottom: '8px', letterSpacing: '0.5px' }}>
            TOTAL BALANCE
          </p>
          {loading ? (
            <div className="skeleton" style={{ height: '52px', width: '240px', marginBottom: '8px' }} />
          ) : (
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '48px', letterSpacing: '-1px', marginBottom: '4px', background: 'linear-gradient(135deg, #6C63FF, #00D4AA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {fmtKES(wallet?.balance || 0)}
            </h2>
          )}
          <p style={{ color: '#44445A', fontSize: '13px' }}>
            KES · Account NP-{user?.phone?.slice(-6) || '------'}
          </p>

          {(wallet?.investment_balance || 0) > 0 && (
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #2A2A3E' }}>
              <div>
                <p style={{ color: '#44445A', fontSize: '11px', marginBottom: '2px' }}>INVESTING</p>
                <p style={{ color: '#00D4AA', fontWeight: 600, fontSize: '14px' }}>
                  {fmtKES(wallet.investment_balance)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {ACTIONS.map(({ href, icon, label, color }) => (
          <Link key={label} href={href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '14px',
              padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as any).style.borderColor = color; (e.currentTarget as any).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as any).style.borderColor = '#2A2A3E'; (e.currentTarget as any).style.transform = 'none' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', margin: '0 auto 8px', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                {icon}
              </div>
              <p style={{ fontSize: '11px', color: '#8888AA', fontWeight: 500 }}>{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Sent this month',     value: 'KES 0',  color: '#6C63FF' },
          { label: 'Received this month', value: 'KES 0',  color: '#00D4AA' },
          { label: 'Active subscriptions',value: '0',      color: '#FFD700' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#12121A', border: `1px solid #2A2A3E`, borderTop: `3px solid ${color}`, borderRadius: '14px', padding: '16px' }}>
            <p style={{ color: '#44445A', fontSize: '11px', marginBottom: '6px' }}>{label}</p>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '20px', color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="fade-up-3" style={{ background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '16px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '16px' }}>Recent Transactions</h3>
          <Link href="/dashboard/history" style={{ color: '#6C63FF', fontSize: '13px', textDecoration: 'none' }}>View all →</Link>
        </div>

        {loading ? (
          [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '60px', marginBottom: '8px', borderRadius: '10px' }} />)
        ) : txs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>💸</div>
            <p style={{ color: '#8888AA', fontSize: '14px' }}>No transactions yet</p>
            <p style={{ color: '#44445A', fontSize: '12px' }}>Make your first deposit to get started</p>
          </div>
        ) : (
          txs.map((tx, i) => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < txs.length - 1 ? '1px solid #2A2A3E' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                  background: tx.direction === 'in' ? 'rgba(0,212,170,0.12)' : 'rgba(108,99,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                  color: tx.direction === 'in' ? '#00D4AA' : '#6C63FF',
                }}>
                  {TX_ICON[tx.type] || (tx.direction === 'in' ? '↙' : '↗')}
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: '2px' }}>
                    {tx.type === 'MPESA_DEPOSIT' ? 'M-Pesa Deposit' : tx.type === 'BILL_PAYMENT' ? 'Bill Payment' : tx.direction === 'in' ? tx.sender?.name || 'Received' : tx.receiver?.name || 'Sent'}
                  </p>
                  <p style={{ fontSize: '11px', color: '#44445A' }}>
                    {fmtDateTime(tx.created_at)} · {tx.reference?.slice(0, 16)}
                  </p>
                  {tx.fee > 0 && <p style={{ fontSize: '11px', color: 'rgba(108,99,255,0.6)' }}>Fee: {fmtKES(tx.fee)}</p>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: tx.direction === 'in' ? '#00D4AA' : '#F0F0FF' }}>
                  {tx.direction === 'in' ? '+' : '−'}{fmtKES(tx.amount)}
                </p>
                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', fontWeight: 500, background: STATUS_COLOR[tx.status] + '18', color: STATUS_COLOR[tx.status] }}>
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
