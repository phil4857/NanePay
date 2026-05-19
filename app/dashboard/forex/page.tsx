'use client'
import { useEffect, useState } from 'react'
import { forexAPI } from '@/lib/api'

type Rate = {
  code: string; flag: string; name: string
  buy_rate: number; sell_rate: number; mid_rate: number
  markup_pct: number
}

export default function ForexPage() {
  const [rates,     setRates]     = useState<Rate[]>([])
  const [loading,   setLoading]   = useState(true)
  const [source,    setSource]    = useState('')
  const [updatedAt, setUpdatedAt] = useState('')
  const [selected,  setSelected]  = useState<Rate | null>(null)
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy')
  const [amount,    setAmount]    = useState('')
  const [result,    setResult]    = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error,     setError]     = useState('')
  const [done,      setDone]      = useState<any>(null)

  useEffect(() => {
    forexAPI.rates()
      .then(res => {
        setRates(res.data.rates)
        setSource(res.data.source)
        setUpdatedAt(res.data.updated_at)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const fmt = (n: number, decimals = 2) =>
    `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`

  const calcPreview = () => {
    if (!selected || !amount) return null
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) return null
    if (direction === 'buy') {
      const kes = parseFloat((amt * selected.buy_rate).toFixed(2))
      return { foreign: amt, kes, rate: selected.buy_rate, label: `You pay ${fmt(kes)}` }
    } else {
      const kes = parseFloat((amt * selected.sell_rate).toFixed(2))
      return { foreign: amt, kes, rate: selected.sell_rate, label: `You receive ${fmt(kes)}` }
    }
  }

  const preview = calcPreview()

  const submit = async () => {
    if (!selected || !amount) return
    setError('')
    setSubmitting(true)
    try {
      const res = await forexAPI.exchange({
        currency:  selected.code,
        direction,
        amount:    parseFloat(amount),
      })
      setDone(res.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Exchange failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) return (
    <div className="max-w-md mx-auto p-8 text-center">
      <div className="rounded-2xl p-8" style={{ background: '#161210', border: '1px solid #2a211a' }}>
        <div className="text-5xl mb-4">💱</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '24px', marginBottom: '8px' }}>
          Exchange Complete
        </h2>
        <p style={{ color: '#a8917f', marginBottom: '24px' }}>Your exchange was successful</p>
        <div className="rounded-xl overflow-hidden mb-6" style={{ border: '1px solid #2a211a' }}>
          {[
            ['Direction',       done.direction === 'buy' ? 'Bought' : 'Sold'],
            ['Currency',        done.currency],
            ['Foreign Amount',  `${done.foreign_amount} ${done.currency}`],
            ['KES Amount',      fmt(done.kes_amount)],
            ['Rate Used',       `${done.rate_used}`],
            ['NanePay Margin',  fmt(done.nanepay_margin)],
          ].map(([k, v], i) => (
            <div key={k} className="flex justify-between px-4 py-3 text-sm"
              style={{ background: i % 2 === 0 ? '#1c1714' : '#161210', borderBottom: i < 5 ? '1px solid #2a211a' : 'none' }}>
              <span style={{ color: '#6b5a4e' }}>{k}</span>
              <span style={{ color: '#f0e6dc', fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setDone(null); setAmount(''); setSelected(null) }}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #c8602a, #d4a853)',
            border: 'none', color: '#fff', fontSize: '15px',
            fontWeight: 600, cursor: 'pointer',
          }}>
          Exchange Again
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-2">
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px' }}>
          Forex Exchange
        </h1>
        <div style={{ fontSize: '12px', color: '#6b5a4e' }}>
          {source === 'live' ? '🟢 Live rates' : '🟡 Mock rates'} · Updated {updatedAt ? new Date(updatedAt).toLocaleTimeString() : '—'}
        </div>
      </div>
      <p style={{ color: '#a8917f', marginBottom: '28px', fontSize: '14px' }}>
        2% spread · Rates update every hour
      </p>

      {/* Rates Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: '#161210' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {rates.map(rate => (
            <div key={rate.code}
              onClick={() => setSelected(rate)}
              className="rounded-2xl p-4 cursor-pointer transition-all"
              style={{
                background:  '#161210',
                border:      `1px solid ${selected?.code === rate.code ? '#c8602a' : '#2a211a'}`,
                transform:   selected?.code === rate.code ? 'scale(1.02)' : 'scale(1)',
              }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '20px' }}>{rate.flag}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '14px' }}>{rate.code}</p>
                    <p style={{ color: '#6b5a4e', fontSize: '11px' }}>{rate.name}</p>
                  </div>
                </div>
                {selected?.code === rate.code && (
                  <span style={{ color: '#c8602a', fontSize: '16px' }}>✓</span>
                )}
              </div>
              <div className="flex justify-between text-xs mt-2">
                <div>
                  <p style={{ color: '#6b5a4e' }}>Buy</p>
                  <p style={{ color: '#52b788', fontWeight: 600 }}>{fmt(rate.buy_rate)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#6b5a4e' }}>Sell</p>
                  <p style={{ color: '#c8602a', fontWeight: 600 }}>{fmt(rate.sell_rate)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exchange Form */}
      {selected && (
        <div className="rounded-2xl p-6" style={{ background: '#161210', border: '1px solid #2a211a' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '20px' }}>
            {selected.flag} Exchange {selected.code}
          </h3>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm"
              style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.2)', color: '#e74c3c' }}>
              {error}
            </div>
          )}

          {/* Buy / Sell Toggle */}
          <div className="flex gap-2 mb-4">
            {(['buy', 'sell'] as const).map(d => (
              <button key={d} onClick={() => setDirection(d)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px',
                  background: direction === d ? (d === 'buy' ? 'rgba(82,183,136,0.15)' : 'rgba(200,96,42,0.15)') : '#1c1714',
                  border:     `1px solid ${direction === d ? (d === 'buy' ? '#52b788' : '#c8602a') : '#2a211a'}`,
                  color:      direction === d ? (d === 'buy' ? '#52b788' : '#c8602a') : '#6b5a4e',
                  cursor:     'pointer', fontWeight: 600, fontSize: '14px',
                  textTransform: 'capitalize',
                }}>
                {d === 'buy' ? `Buy ${selected.code}` : `Sell ${selected.code}`}
              </button>
            ))}
          </div>

          {/* Amount Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#a8917f', fontSize: '13px', marginBottom: '8px' }}>
              Amount in {selected.code}
            </label>
            <input
              type="number"
              placeholder={`e.g. 100 ${selected.code}`}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '12px',
                background: '#1c1714', border: '1px solid #2a211a',
                color: '#f0e6dc', fontSize: '14px', outline: 'none',
              }}
            />
          </div>

          {/* Preview */}
          {preview && (
            <div className="rounded-xl p-4 mb-4"
              style={{ background: '#1c1714', border: '1px solid #2a211a' }}>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: '#a8917f' }}>
                  {direction === 'buy' ? 'You spend' : 'You receive'}
                </span>
                <span style={{ color: '#d4a853', fontWeight: 700, fontSize: '16px' }}>
                  {fmt(preview.kes)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#6b5a4e' }}>Rate</span>
                <span style={{ color: '#6b5a4e' }}>1 {selected.code} = {fmt(preview.rate)}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span style={{ color: '#6b5a4e' }}>NanePay spread (2%)</span>
                <span style={{ color: '#6b5a4e' }}>
                  {fmt(Math.abs(preview.kes - parseFloat((preview.foreign * selected.mid_rate).toFixed(2))))}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={submit}
            disabled={!preview || submitting}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              background: !preview || submitting ? '#2a211a' : 'linear-gradient(135deg, #c8602a, #d4a853)',
              border: 'none', color: '#fff', fontSize: '15px',
              fontWeight: 600, cursor: !preview || submitting ? 'not-allowed' : 'pointer',
            }}>
            {submitting ? 'Processing...' : `Confirm ${direction === 'buy' ? 'Purchase' : 'Sale'}`}
          </button>
        </div>
      )}
    </div>
  )
}
