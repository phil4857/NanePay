// app/dashboard/wallet/page.tsx  ← NEW FILE
'use client'
import { useEffect, useState } from 'react'
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, TrendingUp } from 'lucide-react'
import api from '@/lib/api'
import Link from 'next/link'

interface WalletData {
  available_balance: number
  locked_balance:    number
  total_balance:     number
  currency:          string
}

export default function WalletPage() {
  const [wallet, setWallet]   = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/wallet').then(r => { setWallet(r.data.wallet); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="w-6 h-6 text-brand-green animate-spin" />
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
          KES {parseFloat(wallet?.available_balance || '0').toLocaleString('en-KE', { minimumFractionDigits: 2 })}
        </div>
        {(wallet?.locked_balance || 0) > 0 && (
          <div className="text-brand-muted text-xs mt-2">
            KES {parseFloat(wallet?.locked_balance || '0').toFixed(2)} locked (pending withdrawal)
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/dashboard/deposit" className="card-hover p-5 flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5 text-brand-green" />
          </div>
          <div>
            <div className="font-semibold text-white text-sm">Deposit</div>
            <div className="text-brand-muted text-xs">via M-Pesa</div>
          </div>
        </Link>
        <Link href="/dashboard/withdraw" className="card-hover p-5 flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="font-semibold text-white text-sm">Withdraw</div>
            <div className="text-brand-muted text-xs">to M-Pesa</div>
          </div>
        </Link>
      </div>

      {/* Recent transactions link */}
      <Link href="/dashboard/transactions" className="card-hover p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-brand-green" />
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
