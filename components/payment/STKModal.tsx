// components/payment/STKModal.tsx  ← NEW FILE
'use client'
import { useState, useEffect, useCallback } from 'react'
import { Loader2, CheckCircle, XCircle, Smartphone, X } from 'lucide-react'
import api from '@/lib/api'

type Status = 'idle' | 'waiting' | 'success' | 'failed'

interface Props {
  isOpen:           boolean
  onClose:          () => void
  onSuccess:        (data: any) => void
  checkoutRequestId: string | null
  amount:           number
  fee:              number
  description:      string
}

export default function STKModal({ isOpen, onClose, onSuccess, checkoutRequestId, amount, fee, description }: Props) {
  const [status, setStatus]   = useState<Status>('waiting')
  const [attempts, setAttempts] = useState(0)

  const poll = useCallback(async () => {
    if (!checkoutRequestId) return
    try {
      const { data } = await api.get(`/mpesa/stk-status/${checkoutRequestId}`)
      if (data.status === 'completed') {
        setStatus('success')
        setTimeout(() => onSuccess(data), 1500)
      } else if (data.status === 'failed') {
        setStatus('failed')
      } else {
        setAttempts(a => a + 1)
      }
    } catch { setAttempts(a => a + 1) }
  }, [checkoutRequestId, onSuccess])

  useEffect(() => {
    if (!isOpen || !checkoutRequestId) return
    setStatus('waiting')
    setAttempts(0)
    const interval = setInterval(poll, 3000)
    const timeout  = setTimeout(() => { clearInterval(interval); setStatus('failed') }, 90000)
    return () => { clearInterval(interval); clearTimeout(timeout) }
  }, [isOpen, checkoutRequestId, poll])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="card w-full max-w-sm p-8 animate-slide-up text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-muted hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Status icon */}
        <div className="mb-6">
          {status === 'waiting' && (
            <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto animate-pulse-slow">
              <Smartphone className="w-8 h-8 text-brand-green" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-brand-green" />
            </div>
          )}
          {status === 'failed' && (
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          )}
        </div>

        {status === 'waiting' && (
          <>
            <h3 className="font-display text-xl font-bold text-white mb-2">Check your phone</h3>
            <p className="text-brand-muted text-sm mb-6">Enter your M-Pesa PIN on your phone to complete payment.</p>
            <div className="bg-brand-dark rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-brand-muted">Amount</span>
                <span className="text-white font-medium">KES {amount.toFixed(2)}</span>
              </div>
              {fee > 0 && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-brand-muted">Fee (1%)</span>
                  <span className="text-white font-medium">KES {fee.toFixed(2)}</span>
                </div>
              )}
              <div className="divider my-2" />
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted font-semibold">Total</span>
                <span className="text-brand-green font-bold">KES {(amount + fee).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-brand-muted text-xs">
              <Loader2 className="w-3 h-3 animate-spin" />
              Waiting for confirmation… ({attempts > 0 ? `${attempts * 3}s` : 'just sent'})
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <h3 className="font-display text-xl font-bold text-white mb-2">Payment Successful!</h3>
            <p className="text-brand-muted text-sm">{description} confirmed. Your wallet has been updated.</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <h3 className="font-display text-xl font-bold text-white mb-2">Payment Failed</h3>
            <p className="text-brand-muted text-sm mb-6">The payment was not completed. Please try again.</p>
            <button onClick={onClose} className="btn-primary w-full">Try Again</button>
          </>
        )}
      </div>
    </div>
  )
}
