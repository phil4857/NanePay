'use client'
import { useState } from 'react'
import { mpesaAPI } from '@/lib/api'

export default function DepositPage() {
  const [amount, setAmount]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [sent, setSent]       = useState<any>(null)

  const quick = [500, 1000, 2000, 5000, 10000, 20000]

  const submit = async () => {
    if (!amount || parseFloat(amount) < 10) return
    setError('')
    setLoading(true)
    try {
      const res = await mpesaAPI.stkPush({ amount: parseFloat(amount) })
      setSent(res.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Deposit failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { background: '#1c1714', border: '1px solid #2a211a', color: '#f0e6dc' }

  if (sent) return (
    <div className="max-w-md mx-auto p-8">
      <div className="rounded-2xl p-8 text-center" style={{ background: '#161210', border: '1px solid #2a211a' }}>
        <div className="text-5xl mb-4">📱</div>
        <h2 className="font-display font-bold text-2xl mb-2">Check your phone!</h2>
        <p className="text-soft mb-4">An M-Pesa prompt has been sent. Enter your PIN to complete.</p>
        <div className="rounded-xl p-4 mb-6 text-sm" style={{ background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.2)', color: '#d4a853' }}>
          ⏳ Waiting for payment confirmation...
          {sent.mock && <p className="mt-1 text-xs opacity-70">Mock mode — add M-Pesa credentials to go live</p>}
        </div>
        <p className="text-xs text-muted mb-6">Reference: {sent.reference}</p>
        <button onClick={() => { setSent(null); setAmount('') }}
          className="w-full py-3.5 rounded-xl font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #c8602a, #d4a853)' }}>
          Make Another Deposit
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="font-display font-extrabold text-3xl mb-1">Deposit via M-Pesa</h1>
      <p className="text-soft mb-8">STK Push · No fees · Instant</p>

      <div className="rounded-2xl p-6" style={{ background: '#161210', border: '1px solid #2a211a' }}>
        {error && <div className="mb-4 p-3 rounded-xl text-sm text-red-400"
          style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.2)' }}>{error}</div>}

        <label className="block text-soft text-sm mb-3">Quick amounts (KES)</label>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {quick.map(a => (
            <button key={a} onClick={() => setAmount(String(a))}
              className="py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: amount === String(a) ? 'rgba(200,96,42,0.15)' : '#1c1714',
                border: `1px solid ${amount === String(a) ? '#c8602a' : '#2a211a'}`,
                color: amount === String(a) ? '#c8602a' : '#a8917f', cursor: 'pointer',
              }}>
              {a.toLocaleString()}
            </button>
          ))}
        </div>

        <label className="block text-soft text-sm mb-2">Or enter amount</label>
        <input type="number" placeholder="Min KES 10" value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl text-sm mb-4" style={inputStyle} />

        <div className="rounded-xl p-3 mb-4 text-sm" style={{ background: '#1c1714', border: '1px solid #2a211a' }}>
          <div className="flex justify-between text-soft">
            <span>Deposit amount</span>
            <span style={{ color: '#d4a853' }}>{amount ? `KES ${parseFloat(amount).toLocaleString()}` : '—'}</span>
          </div>
          <div className="flex justify-between text-soft mt-1">
            <span>Fee</span><span style={{ color: '#52b788' }}>Free</span>
          </div>
        </div>

        <button onClick={submit} disabled={!amount || loading}
          className="w-full py-3.5 rounded-xl font-semibold text-white disabled:opacity-60 transition-all"
          style={{ background: 'linear-gradient(135deg, #c8602a, #d4a853)' }}>
          {loading ? 'Sending prompt...' : '📱 Send M-Pesa Prompt'}
        </button>
        <p className="text-center text-xs mt-3" style={{ color: '#6b5a4e' }}>Min KES 10 · Max KES 150,000</p>
      </div>
    </div>
  )
}
