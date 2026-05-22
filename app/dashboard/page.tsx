'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { walletAPI, txAPI } from '@/lib/api'
import { getUser, fmtKES, fmtDateTime } from '@/lib/auth'

const STATUS_COLOR: any = {
  SUCCESSFUL: '#00D4AA',
  PENDING: '#FFD700',
  FAILED: '#FF4560',
  REVERSED: '#9C92FF',
}

const TX_ICON: any = {
  MPESA_DEPOSIT: '📱',
  MPESA_WITHDRAW: '🏦',
  FOREX_BUY: '💱',
  INVESTMENT_IN: '📈',
  BILL_PAYMENT: '🧾',
  TRANSFER: '↔',
}

export default function DashboardPage() {
  const [wallet, setWallet] = useState<any>(null)
  const [txs, setTxs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const user = getUser()

  useEffect(() => {
    Promise.all([walletAPI.get(), txAPI.list({ limit: 6 })])
      .then(([w, t]) => {
        setWallet(w.data)
        setTxs(t.data.transactions || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const ACTIONS = [
    { href: '/dashboard/send', icon: '↗', label: 'Send', color: '#6C63FF' },
    { href: '/dashboard/deposit', icon: '↙', label: 'Deposit', color: '#00D4AA' },
    { href: '/dashboard/withdraw', icon: '↑', label: 'Withdraw', color: '#FFD700' },
    { href: '/dashboard/invest', icon: '📈', label: 'Invest', color: '#9C92FF' },
    { href: '/dashboard/forex', icon: '💱', label: 'Forex', color: '#00D4AA' },
    { href: '/dashboard/bills', icon: '🧾', label: 'Bills', color: '#FF6B35' },
    { href: '/dashboard/qr', icon: '⬡', label: 'QR Pay', color: '#6C63FF' },
    { href: '/dashboard/request', icon: '🤝', label: 'Request', color: '#FFD700' },
  ]

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 20px' }}>

      {/* HEADER */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontWeight: 800, fontSize: '26px' }}>
          Hello, {user?.name?.split(' ')[0] || 'User'} 👋
        </h1>
        <p style={{ color: '#8888AA', fontSize: '14px' }}>
          Your financial control center
        </p>
      </div>

      {/* BALANCE */}
      <div style={{
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #12121A, #1A1A26)',
        border: '1px solid #2A2A3E',
      }}>
        <p style={{ color: '#8888AA', fontSize: '13px' }}>
          TOTAL BALANCE
        </p>

        {loading ? (
          <div style={{ height: 50, width: 200, background: '#222', borderRadius: 10 }} />
        ) : (
          <h2 style={{ fontSize: '42px', fontWeight: 800, color: '#00D4AA' }}>
            {fmtKES(wallet?.balance || 0)}
          </h2>
        )}

        <p style={{ color: '#44445A', fontSize: '12px' }}>
          Account NP-{user?.phone?.slice(-6) || '------'}
        </p>
      </div>

      {/* ACTIONS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        marginBottom: '20px',
      }}>
        {ACTIONS.map(({ href, icon, label, color }) => (
          <Link key={label} href={href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: '#12121A',
                border: '1px solid #2A2A3E',
                borderRadius: '14px',
                padding: '14px 10px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: '0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as any
                el.style.borderColor = color
                el.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as any
                el.style.borderColor = '#2A2A3E'
                el.style.transform = 'none'
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  margin: '0 auto 8px',
                  borderRadius: 12,
                  background: color + '18',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                {icon}
              </div>

              <p style={{ fontSize: 11, color: '#8888AA' }}>
                {label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* TRANSACTIONS */}
      <div style={{
        background: '#12121A',
        border: '1px solid #2A2A3E',
        borderRadius: '16px',
        padding: '20px',
      }}>
        <h3 style={{ marginBottom: 14 }}>Recent Transactions</h3>

        {loading ? (
          <p style={{ color: '#888' }}>Loading...</p>
        ) : txs.length === 0 ? (
          <p style={{ color: '#666' }}>No transactions yet</p>
        ) : (
          txs.map((tx) => (
            <div
              key={tx.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #2A2A3E',
              }}
            >
              <div style={{ display: 'flex', gap: 10 }}>
                <div>{TX_ICON[tx.type] || '💰'}</div>
                <div>
                  <p style={{ fontSize: 13 }}>
                    {tx.type}
                  </p>
                  <p style={{ fontSize: 11, color: '#666' }}>
                    {fmtDateTime(tx.created_at)}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{
                  color: tx.direction === 'in' ? '#00D4AA' : '#fff',
                  fontWeight: 600,
                }}>
                  {tx.direction === 'in' ? '+' : '-'}{fmtKES(tx.amount)}
                </p>

                <span style={{
                  fontSize: 10,
                  color: STATUS_COLOR[tx.status],
                }}>
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
