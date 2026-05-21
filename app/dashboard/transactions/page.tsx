// app/dashboard/transactions/page.tsx  ← REPLACEMENT
'use client'
import { useEffect, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Wifi, RefreshCw, ChevronDown } from 'lucide-react'
import api from '@/lib/api'

interface Transaction {
  id: string; type: string; amount: number; fee: number
  net_amount: number; status: string; reference: string
  description: string; created_at: string; mpesa_receipt?: string
}

const TYPE_ICONS: Record<string, any> = {
  deposit:      { icon: ArrowDownLeft, color: 'text-brand-green', bg: 'bg-brand-green/10' },
  withdrawal:   { icon: ArrowUpRight,  color: 'text-red-400',     bg: 'bg-red-500/10' },
  transfer:     { icon: ArrowUpRight,  color: 'text-blue-400',    bg: 'bg-blue-500/10' },
  wifi_purchase:{ icon: Wifi,          color: 'text-purple-400',  bg: 'bg-purple-500/10' },
}

export default function TransactionsPage() {
  const [txns, setTxns]     = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage]     = useState(1)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setLoading(true)
    const params: any = { page, limit: 20 }
    if (filter !== 'all') params.type = filter
    api.get('/wallet/transactions', { params })
      .then(r => { setTxns(r.data.transactions); setLoading(false) })
      .catch(() => setLoading(false))
  }, [page, filter])

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Transactions</h1>
        <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1) }}
          className="input-field w-auto text-sm py-2 px-3">
          <option value="all">All types</option>
          <option value="deposit">Deposits</option>
          <option value="withdrawal">Withdrawals</option>
          <option value="transfer">Transfers</option>
          <option value="wifi_purchase">WiFi</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <RefreshCw className="w-6 h-6 text-brand-green animate-spin" />
        </div>
      ) : txns.length === 0 ? (
        <div className="card p-12 text-center text-brand-muted">No transactions yet.</div>
      ) : (
        <div className="card divide-y divide-brand-border">
          {txns.map(txn => {
            const t     = TYPE_ICONS[txn.type] || TYPE_ICONS.deposit
            const Icon  = t.icon
            const isCredit = ['deposit', 'transfer_in'].includes(txn.type)
            return (
              <div key={txn.id} className="flex items-center gap-4 p-4 hover:bg-white/2 transition-colors">
                <div className={`w-10 h-10 rounded-xl ${t.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${t.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm capitalize">{txn.type.replace('_', ' ')}</div>
                  <div className="text-brand-muted text-xs truncate">{txn.description || txn.reference}</div>
                  <div className="text-brand-muted text-xs mt-0.5">{new Date(txn.created_at).toLocaleDateString('en-KE', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-semibold text-sm ${isCredit ? 'text-brand-green' : 'text-white'}`}>
                    {isCredit ? '+' : '-'}KES {parseFloat(txn.amount).toFixed(2)}
                  </div>
                  <div className={`text-xs mt-0.5 ${
                    txn.status === 'completed' ? 'text-brand-green' :
                    txn.status === 'failed'    ? 'text-red-400' : 'text-yellow-400'
                  }`}>{txn.status}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {txns.length === 20 && (
        <button onClick={() => setPage(p => p + 1)} className="btn-secondary w-full flex items-center justify-center gap-2">
          Load more <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
