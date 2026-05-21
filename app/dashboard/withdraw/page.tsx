// app/dashboard/withdraw/page.tsx  ← NEW FILE
'use client'
import { useState } from 'react'
import { ArrowUpRight, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function WithdrawPage() {
  const router = useRouter()
  const [amount,  setAmount]  = useState('')
  const [phone,   setPhone]   = useState('')
  const [loading, setLoading] = useState(false)

  const fee    = amount ? parseFloat((parseFloat(amount) * 0.01).toFixed(2)) : 0
  const net    = amount ? parseFloat((parseFloat(amount) - fee).toFixed(2)) : 0

  const handleSubmit = async () => {
    const amt = parseFloat(amount)
    if (!amt || amt < 100) { toast.error('Minimum withdrawal is KES 100'); return }

    setLoading(true)
    try {
      await api.post('/withdrawals/request', { amount: amt, phone: phone || undefined })
      toast.success('Withdrawal request submitted! Processing within 24 hours.')
      router.push('/dashboard/wallet')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Withdrawal failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">Withdraw Funds</h1>

      <div className="card p-6 space-y-5">
        <div>
          <label className="label">Amount (KES)</label>
          <input type="number" className="input-field text-xl font-bold" placeholder="0.00"
            value={amount} onChange={e => setAmount(e.target.value)} min={100} />
        </div>

        <div>
          <label className="label">M-Pesa Phone (optional — uses your registered number)</label>
          <input type="tel" className="input-field" placeholder="07XXXXXXXX"
            value={phone} onChange={e => setPhone(e.target.value)} />
        </div>

        {/* Fee breakdown */}
        {amount && (
          <div className="bg-brand-dark rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-brand-muted">Amount</span><span className="text-white">KES {parseFloat(amount).toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-brand-muted">Fee (1%)</span><span className="text-red-400">-KES {fee.toFixed(2)}</span></div>
            <div className="divider" />
            <div className="flex justify-between font-semibold"><span className="text-white">You receive</span><span className="text-brand-green">KES {net.toFixed(2)}</span></div>
          </div>
        )}

        <div className="bg-brand-dark rounded-xl p-4 flex items-start gap-2">
          <Info className="w-4 h-4 text-brand-muted mt-0.5 shrink-0" />
          <p className="text-brand-muted text-xs">A 1% fee is deducted from withdrawals. Processing time: up to 24 hours. Minimum: KES 100.</p>
        </div>

        <button onClick={handleSubmit} disabled={loading || !amount}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
          <ArrowUpRight className="w-4 h-4" />
          {loading ? 'Submitting…' : 'Request Withdrawal'}
        </button>
      </div>
    </div>
  )
}
