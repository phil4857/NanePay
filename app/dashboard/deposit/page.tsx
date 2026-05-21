// app/dashboard/deposit/page.tsx  ← REPLACEMENT
'use client'
import { useState } from 'react'
import { ArrowDownLeft, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import STKModal from '@/components/payment/STKModal'
import { useRouter } from 'next/navigation'

const PRESETS = [50, 100, 200, 500, 1000, 2000]

export default function DepositPage() {
  const router = useRouter()
  const [amount, setAmount]         = useState('')
  const [loading, setLoading]       = useState(false)
  const [modalOpen, setModalOpen]   = useState(false)
  const [checkoutId, setCheckoutId] = useState<string | null>(null)
  const [feeInfo, setFeeInfo]       = useState({ amount: 0, fee: 0, total: 0 })

  const handleDeposit = async () => {
    const amt = parseFloat(amount)
    if (!amt || amt < 10) { toast.error('Minimum deposit is KES 10'); return }

    setLoading(true)
    try {
      const { data } = await api.post('/mpesa/stk-push', { amount: amt })
      setCheckoutId(data.checkoutRequestId)
      setFeeInfo({ amount: data.amount, fee: data.fee, total: data.total })
      setModalOpen(true)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to initiate payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">Deposit Funds</h1>

      <div className="card p-6 space-y-5">
        {/* Amount input */}
        <div>
          <label className="label">Amount (KES)</label>
          <input type="number" className="input-field text-xl font-bold" placeholder="0.00"
            value={amount} onChange={e => setAmount(e.target.value)} min={10} />
        </div>

        {/* Presets */}
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map(p => (
            <button key={p} onClick={() => setAmount(String(p))}
              className={`py-2 rounded-xl text-sm font-medium transition-all border ${
                amount === String(p)
                  ? 'bg-brand-green border-brand-green text-white'
                  : 'bg-brand-dark border-brand-border text-brand-muted hover:border-brand-green/40 hover:text-white'
              }`}>
              KES {p}
            </button>
          ))}
        </div>

        {/* Fee info */}
        <div className="bg-brand-dark rounded-xl p-4 flex items-start gap-2">
          <Info className="w-4 h-4 text-brand-muted mt-0.5 shrink-0" />
          <p className="text-brand-muted text-xs">Deposits via M-Pesa are free. You will receive a push notification on your phone to enter your PIN.</p>
        </div>

        <button onClick={handleDeposit} disabled={loading || !amount}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
          <ArrowDownLeft className="w-4 h-4" />
          {loading ? 'Sending STK Push…' : 'Deposit via M-Pesa'}
        </button>
      </div>

      <STKModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => { setModalOpen(false); toast.success('Deposit successful!'); router.push('/dashboard/wallet') }}
        checkoutRequestId={checkoutId}
        amount={feeInfo.amount}
        fee={feeInfo.fee}
        description="Deposit"
      />
    </div>
  )
}
