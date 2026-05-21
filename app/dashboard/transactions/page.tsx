// app/dashboard/transactions/page.tsx  ← REPLACEMENT
'use client'
import { useEffect, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Wifi, RefreshCw, ChevronDown } from 'lucide-react'
import api from '@/lib/api'

interface Transaction {
  id:            string
  type:          string
  amount:        string | number
  fee:           string | number
  net_amount:    string | number
  status:        string
  reference:     string
  description:   string
  created_at:    string
  mpesa_receipt?: string
}

function toFloat(val: string | number | undefined): number {
  return parseFloat(String(val ?? '0'))
}

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  deposit:       { icon: ArrowDownLeft, color: 'text-brand-green', bg: 'bg-brand-green/10' },
  withdrawal:    { icon: ArrowUpRight,  color: 'text-red-400',     bg: 'bg-red-500/10'     },
  transfer:      { icon: ArrowUpRight,  color: 'text-blue-400',    bg: 'bg-blue-500/10'    },
  transfer_in:   { icon: ArrowDownLeft, color: 'text-brand-green', bg: 'bg-brand-green/10' },
  transfer_out:  { icon: ArrowUpRight,  color: 'text-red-400',     bg: 'bg-red-500/10'     },
  wifi_purchase: { icon: Wifi,          color: 'text-purple-400',  bg: 'bg-purple-500/10'  },
  refund:        { icon: ArrowDownLeft, color: 'text-yellow-400',  bg: 'bg-yellow-500/10'  },
}

const CREDIT_TYPES = ['deposit', 'transfer_in', 'refund']

export default function TransactionsPage() {
  const [txns,    setTxns]    = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(1)
  const [filter,  setFilter]  = useState('all')
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setLoading(true)
    const params: Record<string, any> = { page, limit: 20 }
    if (filter !== 'all') params.type = filter

    api.get('/wallet/transactions', { params })
      .then(r => {
        const results = r.data.transactions as Transaction[]
        setTxns(prev => page === 1 ? results : [...prev, ...results])
        setHasMore(results.length === 20)
      })
      .finally(() => setLoading(false))
  }, [page, filter])

  const handleFilterChange = (val: string) => {
    setFilter(val)
    setPage(1)
    setTxns([])
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Transactions</h1>
        <select
          value={filter}
          onChange={e => handleFilterChange(e.target.value)}
          className="input-field w-auto text-sm py-2 px-3"
        >
          <option value="all">All types</option>
          <option value="deposit">Deposits</option>
          <option value="withdrawal">Withdrawals</option>
          <option value="transfer">Transfers</option>
          <option value="wifi_purchase">WiFi</option>
        </select>
      </div>

      {loading && page === 1 ? (
        <div className="flex items-center justify-center h-48">
          <RefreshCw className="w-6 h-6 text-brand-green animate-spin" />
        </div>
      ) : txns.length === 0 ? (
        <div className="card p-12 text-center text-brand-muted">
          No transactions yet.
        </div>
      ) : (
        <div className="card divide-y divide-brand-border">
          {txns.map(txn => {
            const config   = TYPE_CONFIG[txn.type] ?? TYPE_CONFIG.deposit
            const Icon     = config.icon
            const isCredit = CREDIT_TYPES.includes(txn.type)
            const amount   = toFloat(txn.amount)

            return (
              <div key={txn.id}
                className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors">
                <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm capitalize">
                    {txn.type.replace(/_/g, ' ')}
                  </div>
                  <div className="text-brand-muted text-xs truncate">
                    {txn.description || txn.reference}
                  </div>
                  <div className="text-brand-muted text-xs mt-0.5">
                    {new Date(txn.created_at).toLocaleDateString('en-KE', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`font-semibold text-sm ${isCredit ? 'text-brand-green' : 'text-white'}`}>
                    {isCredit ? '+' : '-'}KES {amount.toFixed(2)}
                  </div>
                  <div className={`text-xs mt-0.5 ${
                    txn.status === 'completed' ? 'text-brand-green' :
                    txn.status === 'failed'    ? 'text-red-400'     :
                    txn.status === 'reversed'  ? 'text-yellow-400'  :
                                                 'text-yellow-400'
                  }`}>
                    {txn.status}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {hasMore && (
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={loading}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          {loading
            ? <RefreshCw className="w-4 h-4 animate-spin" />
            : <><ChevronDown className="w-4 h-4" /> Load more</>
          }
        </button>
      )}
    </div>
  )
}
