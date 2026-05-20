'use client'
import { useState } from 'react'
import { requestAPI } from '@/lib/api'

export default function RequestPage() {
  const [form, setForm]       = useState({ phone: '', amount: '', note: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [done,    setDone]    = useState<any>(null)

  const submit = async () => {
    if (!form.phone || !form.amount) return setError('Phone and amount are required')
    setError(''); setLoading(true)
    try {
      const res = await requestAPI.send({ phone: form.phone, amount: parseFloat(form.amount), note: form.note })
      setDone(res.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send request')
    } finally { setLoading(false) }
  }

  const inputStyle = { width: '100%', padding: '13px 16px', borderRadius: '12px', background: '#1A1A26', border: '1px solid #2A2A3E', color: '#F0F0FF', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }

  if (done) return (
    <div style={{ maxWidth: '440px', margin: '40px auto', padding: '20px' }}>
      <div style={{ background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '52px', marginBottom: '12px' }}>🤝</div>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '22px', marginBottom: '8px' }}>Request Sent!</h2>
        <p style={{ color: '#8888AA', marginBottom: '24px', fontSize: '14px' }}>
          {done.requested_from?.name} will receive a notification to send you KES {parseFloat(form.amount).toLocaleString()}
        </p>
        <div style={{ background: '#1A1A26', borderRadius: '10px', padding: '14px', marginBottom: '20px', border: '1px solid #2A2A3E' }}>
          {[
            ['Request to',  done.requested_from?.name],
            ['Phone',       done.requested_from?.phone],
            ['Amount',      `KES ${done.amount?.toLocaleString()}`],
            ['Note',        done.note || '—'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', borderBottom: '1px solid #2A2A3E' }}>
              <span style={{ color: '#8888AA' }}>{k}</span>
              <span style={{ color: k === 'Amount' ? '#00D4AA' : '#F0F0FF', fontWeight: k === 'Amount' ? 600 : 400 }}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setDone(null); setForm({ phone: '', amount: '', note: '' }) }} style={{
          width: '100%', padding: '14px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #6C63FF, #9C92FF)',
          border: 'none', color: '#fff', fontSize: '15px', fontWeight: 600,
          cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
        }}>Send Another Request</button>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', padding: '28px 20px' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '26px', marginBottom: '6px' }}>Request Money</h1>
      <p style={{ color: '#8888AA', marginBottom: '24px', fontSize: '14px' }}>
        Send a payment request to any NanePay user
      </p>

      <div style={{ background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '16px', padding: '24px' }}>
        {error && <div style={{ background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.25)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', color: '#FF4560', fontSize: '13px' }}>⚠️ {error}</div>}

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', color: '#8888AA', fontSize: '13px', marginBottom: '8px' }}>Their Phone Number</label>
          <input type="tel" placeholder="0712345678" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', color: '#8888AA', fontSize: '13px', marginBottom: '8px' }}>Amount (KES)</label>
          <input type="number" placeholder="0.00" value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#8888AA', fontSize: '13px', marginBottom: '8px' }}>Note (optional)</label>
          <input type="text" placeholder="e.g. For lunch yesterday" value={form.note}
            onChange={e => setForm({ ...form, note: e.target.value })} style={inputStyle} />
        </div>

        {form.amount && (
          <div style={{ background: '#1A1A26', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px', border: '1px solid #2A2A3E' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#8888AA' }}>You're requesting</span>
              <span style={{ color: '#00D4AA', fontWeight: 700 }}>KES {parseFloat(form.amount).toLocaleString()}</span>
            </div>
            <p style={{ color: '#44445A', fontSize: '12px', marginTop: '4px' }}>
              They'll receive a notification and can pay with one tap
            </p>
          </div>
        )}

        <button onClick={submit} disabled={loading || !form.phone || !form.amount} style={{
          width: '100%', padding: '14px', borderRadius: '12px',
          background: !form.phone || !form.amount ? '#2A2A3E' : 'linear-gradient(135deg, #6C63FF, #9C92FF)',
          border: 'none', color: '#fff', fontSize: '15px', fontWeight: 600,
          cursor: !form.phone || !form.amount ? 'not-allowed' : 'pointer',
          fontFamily: 'Space Grotesk, sans-serif', opacity: loading ? 0.7 : 1,
        }}>
          {loading ? '⏳ Sending...' : '🤝 Send Request'}
        </button>
      </div>
    </div>
  )
}
