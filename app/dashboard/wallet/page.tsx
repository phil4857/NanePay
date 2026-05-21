// app/dashboard/wallet/page.tsx  ← REPLACEMENT (full script)
'use client'
import { useEffect, useState } from 'react'
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, TrendingUp } from 'lucide-react'
import api from '@/lib/api'
import Link from 'next/link'

interface WalletData {
  available_balance: string | number
  locked_balance:    string | number
  total_balance:     string | number
  currency:          string
}

function toFloat(val: string | number | undefined): number {
  return parseFloat(String(val ?? '0'))
}

export default function WalletPage() {
  const [wallet,  setWallet]  = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  useEffect(() => {
    api.get('/wallet')
      .then(r => {
        setWallet(r.data.wallet)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  const available = toFloat(wallet?.available_balance)
  const locked    = toFloat(wallet?.locked_balance)
  const total     = toFloat(wallet?.total_balance)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="w-6 h-6 text-brand-green animate-spin" />
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-brand-muted text-sm">Failed to load wallet.</p>
      <button onClick={() => window.location.reload()} className="btn-secondary text-sm py-2 px-4">
        Retry
      </button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">My Wallet</h1>

      {/* Balance card */}
      <div className="card p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-transparent pointer-events-none" />
        <Wallet className="w-8 h-8 text-brand-green mx-auto mb-3" />
        <div className="text-brand-muted text-sm mb-1">Available Balance</div>
        <div className="font-display text-5xl font-bold text-white mb-1">
          KES {available.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-brand-muted text-xs mt-1">
          {wallet?.currency || 'KES'} account
        </div>
        {locked > 0 && (
          <div className="mt-3 inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            <span className="text-yellow-400 text-xs font-medium">
              KES {locked.toFixed(2)} locked (pending withdrawal)
            </span>
          </div>
        )}
      </div>

      {/* Balance breakdown */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Available', value: available, color: 'text-brand-green' },
          { label: 'Locked',    value: locked,    color: 'text-yellow-400' },
          { label: 'Total',     value: total,      color: 'text-white' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <div className="text-brand-muted text-xs mb-1">{label}</div>
            <div className={`font-semibold text-sm ${color}`}>
              KES {value.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/dashboard/deposit"
          className="card-hover p-5 flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5 text-brand-green" />
          </div>
          <div>
            <div className="font-semibold text-white text-sm">Deposit</div>
            <div className="text-brand-muted text-xs">via M-Pesa</div>
          </div>
        </Link>

        <Link href="/dashboard/withdraw"
          className="card-hover p-5 flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="font-semibold text-white text-sm">Withdraw</div>
            <div className="text-brand-muted text-xs">to M-Pesa</div>
          </div>
        </Link>
      </div>

      {/* Send money */}
      <Link href="/dashboard/send"
        className="card-hover p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="font-semibold text-white text-sm">Send Money</div>
            <div className="text-brand-muted text-xs">Transfer to another NanePay user · 1% fee</div>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-brand-muted" />
      </Link>

      {/* Transaction history */}
      <Link href="/dashboard/transactions"
        className="card-hover p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-brand-green" />
          </div>
          <div>
            <div className="font-semibold text-white text-sm">Transaction History</div>
            <div className="text-brand-muted text-xs">View all deposits, transfers & payments</div>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-brand-muted" />
      </Link>
    </div>
  )
}
