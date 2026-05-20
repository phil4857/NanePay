'use client'
import { useEffect, useState } from 'react'
import { adminAPI } from '@/lib/api'
import { fmtKES } from '@/lib/auth'

export default function AdminOverviewPage() {
  const [stats,   setStats]   = useState<any>(null)
  const [revenue, setRevenue] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminAPI.stats(), adminAPI.revenue()])
      .then(([s, r]) => { setStats(s.data); setRevenue(r.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const STAT_CARDS = stats ? [
    { label: 'Total Users',        value: stats.total_users?.toLocaleString(),    icon: '👥', color: '#6C63FF' },
    { label: 'Total Merchants',    value: stats.total_merchants?.toLocaleString(),icon: '🏪', color: '#00D4AA' },
    { label: 'Total Transactions', value: stats.total_txs?.toLocaleString(),      icon: '💸', color: '#FFD700' },
    { label: 'Platform Revenue',   value: fmtKES(stats.total_revenue),            icon: '💰', color: '#FF6B35' },
    { label: 'Active Subs',        value: stats.active_subs?.toLocaleString(),    icon: '📶', color: '#9C92FF' },
    { label: "Today's Revenue",    value: fmtKES(stats.today_revenue),            icon: '📈', color: '#00D4AA' },
  ] : []

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '28px', marginBottom: '4px' }}>
          Platform Overview
        </h1>
        <p style={{ color: '#8888AA', fontSize: '14px' }}>Real-time NanePay metrics</p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '14px' }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {STAT_CARDS.map(({ label, value, icon, color }) => (
            <div key={label} style={{ background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '14px', padding: '20px', borderTop: `3px solid ${color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ color: '#44445A', fontSize: '12px', marginBottom: '6px' }}>{label}</p>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '22px', color }}>{value}</p>
                </div>
                <span style={{ fontSize: '24px' }}>{icon}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Revenue breakdown */}
      {revenue && (
        <div style={{ background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '16px' }}>Revenue Breakdown</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {[
              { label: 'Transfer Fees (1%)',   data: revenue.revenue?.transfer_fees, color: '#6C63FF' },
              { label: 'Merchant Fees (0.8%)', data: revenue.revenue?.merchant_fees, color: '#00D4AA' },
              { label: 'Forex Margin (2%)',    data: revenue.revenue?.forex_margin,  color: '#FFD700' },
              { label: 'Bill Fees (1%)',       data: revenue.revenue?.bill_fees,     color: '#FF6B35' },
            ].map(({ label, data, color }) => (
              <div key={label} style={{ background: '#1A1A26', borderRadius: '10px', padding: '14px', border: '1px solid #2A2A3E' }}>
                <p style={{ color: '#44445A', fontSize: '12px', marginBottom: '6px' }}>{label}</p>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '18px', color }}>{fmtKES(data?.total || 0)}</p>
                <p style={{ color: '#44445A', fontSize: '11px', marginTop: '2px' }}>{data?.count || 0} transactions</p>
              </div>
            ))}
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(0,212,170,0.1))', borderRadius: '10px', padding: '14px', border: '1px solid #2A2A3E', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>Total Platform Revenue</span>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '22px', background: 'linear-gradient(135deg, #6C63FF, #00D4AA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {fmtKES(revenue.revenue?.grand_total || 0)}
            </span>
          </div>
        </div>
      )}

      {/* Daily revenue */}
      {revenue?.daily_revenue?.length > 0 && (
        <div style={{ background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '16px' }}>Last 7 Days Revenue</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '80px' }}>
            {revenue.daily_revenue.map((d: any) => {
              const max = Math.max(...revenue.daily_revenue.map((x: any) => parseFloat(x.revenue)))
              const height = max > 0 ? (parseFloat(d.revenue) / max) * 70 + 10 : 10
              return (
                <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '100%', height: `${height}px`, borderRadius: '4px', background: 'linear-gradient(180deg, #6C63FF, #9C92FF)', transition: 'height 0.3s', cursor: 'pointer' }}
                    title={`KES ${parseFloat(d.revenue).toFixed(2)}`} />
                  <span style={{ color: '#44445A', fontSize: '9px' }}>{new Date(d.date).toLocaleDateString('en', { weekday: 'short' })}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
