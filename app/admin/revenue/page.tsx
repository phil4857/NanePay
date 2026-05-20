'use client'
import { useEffect, useState } from 'react'
import { adminAPI } from '@/lib/api'
import { fmtKES } from '@/lib/auth'

export default function AdminRevenuePage() {
  const [revenue, setRevenue] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.revenue()
      .then(res => setRevenue(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const STREAMS = revenue ? [
    { label: 'Transfer Fees',   sub: '1% per transfer',         data: revenue.revenue?.transfer_fees, color: '#6C63FF', icon: '↗' },
    { label: 'Merchant Fees',   sub: '0.8% per merchant payment',data: revenue.revenue?.merchant_fees, color: '#00D4AA', icon: '🏪' },
    { label: 'Forex Margin',    sub: '2% spread on exchange',   data: revenue.revenue?.forex_margin,  color: '#FFD700', icon: '💱' },
    { label: 'Bill Fees',       sub: '1% on bill payments',     data: revenue.revenue?.bill_fees,     color: '#FF6B35', icon: '🧾' },
  ] : []

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '28px', marginBottom: '4px' }}>Revenue Analytics</h1>
        <p style={{ color: '#8888AA', fontSize: '14px' }}>NanePay platform earnings breakdown</p>
      </div>

      {/* Total Revenue Hero */}
      {revenue && (
        <div style={{ background: 'linear-gradient(135deg, #12121A, #1A1A26)', border: '1px solid #2A2A3E', borderRadius: '20px', padding: '28px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.15), transparent)' }} />
          <p style={{ color: '#8888AA', fontSize: '13px', marginBottom: '8px' }}>TOTAL PLATFORM REVENUE</p>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '44px', background: 'linear-gradient(135deg, #6C63FF, #00D4AA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px' }}>
            {fmtKES(revenue.revenue?.grand_total || 0)}
          </h2>
          <p style={{ color: '#44445A', fontSize: '13px' }}>Platform volume: {fmtKES(revenue.platform_volume || 0)}</p>
        </div>
      )}

      {/* Revenue streams */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '14px' }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          {STREAMS.map(({ label, sub, data, color, icon }) => (
            <div key={label} style={{ background: '#12121A', border: `1px solid #2A2A3E`, borderRadius: '14px', padding: '20px', borderTop: `3px solid ${color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '3px' }}>{label}</p>
                  <p style={{ color: '#44445A', fontSize: '12px' }}>{sub}</p>
                </div>
                <span style={{ fontSize: '22px' }}>{icon}</span>
              </div>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '22px', color, marginBottom: '4px' }}>
                {fmtKES(data?.total || 0)}
              </p>
              <p style={{ color: '#44445A', fontSize: '12px' }}>{data?.count || 0} transactions</p>
            </div>
          ))}
        </div>
      )}

      {/* Daily chart */}
      {revenue?.daily_revenue?.length > 0 && (
        <div style={{ background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '20px' }}>Daily Revenue — Last 7 Days</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '100px' }}>
            {revenue.daily_revenue.map((d: any) => {
              const max = Math.max(...revenue.daily_revenue.map((x: any) => parseFloat(x.revenue)))
              const height = max > 0 ? (parseFloat(d.revenue) / max) * 80 + 20 : 20
              return (
                <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <p style={{ color: '#8888AA', fontSize: '11px' }}>{fmtKES(parseFloat(d.revenue))}</p>
                  <div style={{ width: '100%', height: `${height}px`, borderRadius: '6px', background: 'linear-gradient(180deg, #6C63FF, rgba(108,99,255,0.3))' }} />
                  <span style={{ color: '#44445A', fontSize: '10px' }}>{new Date(d.date).toLocaleDateString('en', { weekday: 'short' })}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
