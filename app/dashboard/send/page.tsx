'use client'
import { useState } from 'react'
import { walletAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function SendPage() {
  const router = useRouter()
  const [step, setStep]     = useState(0)
  const [form, setForm]     = useState({ phone: '', amount: '', note: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [result, setResult] = useState<any>(null)

  const amount  = parseFloat(form.amount) || 0
  const fee     = amount > 0 ? parseFloat((amount * 0.01).toFixed(2)) : 0
  const net     = parseFloat((amount - fee).toFixed(2))

  const submit = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await walletAPI.transfer({ phone: form.phone, amount, note: form.note })
      setResult(res.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Transfer failed.')
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  if (result) return (
    <div className="max-w-md mx-auto p-8 text-center">
      <div className="rounded-2xl p-8" style={{ background: '#161210', border: '1px solid #2a211a' }}>
        <div className="text-5xl mb-4">✅</div>
        <h2 className="font-display font-bold text-2xl mb-2">Sent!</h2>
        <p className="text-soft mb-6">KES {net.toLocaleString()} delivered to {form.phone}</p>
        <div className="rounded-xl overflow-hidden mb-6" style={{ border: '1px solid #2a211a' }}>
          {[['Reference', result.reference], ['Amount', `KES ${amount.toLocaleString()}`], ['Fee (1%)', `KES ${fee}`], ['Received', `KES ${net.toLocaleString()}`]].map(([k, v], i) => (
            <div key={k} className="flex justify-between px-4 py-3 text-sm"
              style={{ background: i % 2 === 0 ? '#1c1714' : '#161210', borderBottom: i < 3 ? '1px solid #2a211a' : 'none' }}>
              <span style={{ color: '#6b5a4e' }}>{k}</span>
              <span style={{ color: k === 'Received' ? '#d4a853' : '#f0e6dc', fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setResult(null); setStep(0); setForm({ phone: '', amount: '', note: '' }) }}
          className="w-full py-3.5 rounded-xl font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #c8602a, #d4a853)' }}>
          Send Another
        </button>
      </div>
    </div>
  )

  const inputStyle = { background: '#1c1714', border: '1px solid #2a211a', color: '#f0e6dc' }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="font-display font-extrabold text-3xl mb-1">Send Money</h1>
      <p className="text-soft mb-8">1% fee · Instant · Secure</p>

      <div className="rounded-2xl p-6" style={{ background: '#161210', border: '1px solid #2a211a' }}>
        {/* Stepper */}
        <div className="flex gap-2 mb-6">
          {['Recipient', 'Amount', 'Confirm'].map((s, i) => (
            <div key={s} className="flex-1 text-center">
              <div className="w-7 h-7 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-bold"
                style={{ background: step > i ? '#52b788' : step === i ? '#c8602a' : '#1c1714', color: step >= i ? '#fff' : '#6b5a4e' }}>
                {step > i ? '✓' : i + 1}
              </div>
              <p className="text-xs" style={{ color: step === i ? '#c8602a' : '#6b5a4e' }}>{s}</p>
            </div>
          ))}
        </div>

        {error && <div className="mb-4 p-3 rounded-xl text-sm text-red-400"
          style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.2)' }}>{error}</div>}

        {step === 0 && <>
          <label className="block text-soft text-sm mb-2">Phone Number</label>
          <input placeholder="0712345678" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3.5 rounded-xl text-sm mb-4" style={inputStyle} />
          <button onClick={() => form.phone && setStep(1)}
            className="w-full py-3.5 rounded-xl font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #c8602a, #d4a853)' }}>Continue →</button>
        </>}

        {step === 1 && <>
          <label className="block text-soft text-sm mb-2">Amount (KES)</label>
          <input type="number" placeholder="0.00" value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            className="w-full px-4 py-3.5 rounded-xl text-sm mb-3" style={inputStyle} />

          {fee > 0 && (
            <div className="rounded-xl p-3 mb-3 text-sm" style={{ background: '#1c1714', border: '1px solid #2a211a' }}>
              <div className="flex justify-between text-soft mb-1"><span>Amount</span><span>KES {amount.toLocaleString()}</span></div>
              <div className="flex justify-between mb-1"><span style={{ color: '#c8602a' }}>Fee (1%)</span><span style={{ color: '#c8602a' }}>− KES {fee}</span></div>
              <div className="flex justify-between font-semibold pt-2" style={{ borderTop: '1px solid #2a211a' }}>
                <span className="text-soft">Recipient gets</span><span style={{ color: '#d4a853' }}>KES {net.toLocaleString()}</span>
              </div>
            </div>
          )}

          <label className="block text-soft text-sm mb-2">Note (optional)</label>
          <input placeholder="Rent, groceries..." value={form.note}
            onChange={e => setForm({ ...form, note: e.target.value })}
            className="w-full px-4 py-3.5 rounded-xl text-sm mb-4" style={inputStyle} />

          <button onClick={() => amount >= 10 && setStep(2)}
            className="w-full py-3.5 rounded-xl font-semibold text-white mb-2"
            style={{ background: 'linear-gradient(135deg, #c8602a, #d4a853)' }}>Review →</button>
          <button onClick={() => setStep(0)} className="w-full py-3 rounded-xl text-sm"
            style={{ background: 'none', border: '1px solid #2a211a', color: '#6b5a4e', cursor: 'pointer' }}>← Back</button>
        </>}

        {step === 2 && <>
          <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid #2a211a' }}>
            {[['To', form.phone], ['Amount', `KES ${amount.toLocaleString()}`], ['Fee (1%)', `− KES ${fee}`], ['They receive', `KES ${net.toLocaleString()}`]].map(([k, v], i) => (
              <div key={k} className="flex justify-between px-4 py-3 text-sm"
                style={{ background: i % 2 === 0 ? '#1c1714' : '#161210', borderBottom: i < 3 ? '1px solid #2a211a' : 'none' }}>
                <span style={{ color: '#6b5a4e' }}>{k}</span>
                <span style={{ fontWeight: 500, color: k === 'They receive' ? '#d4a853' : '#f0e6dc' }}>{v}</span>
              </div>
            ))}
          </div>
          <button onClick={submit} disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-white mb-2 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #c8602a, #d4a853)' }}>
            {loading ? 'Sending...' : '🔐 Confirm & Send'}
          </button>
          <button onClick={() => setStep(1)} className="w-full py-3 rounded-xl text-sm"
            style={{ background: 'none', border: '1px solid #2a211a', color: '#6b5a4e', cursor: 'pointer' }}>← Edit</button>
        </>}
      </div>
    </div>
  )
}
