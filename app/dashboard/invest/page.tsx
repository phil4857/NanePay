'use client'

import { useEffect, useState } from 'react'
import {
  TrendingUp,
  RefreshCw,
} from 'lucide-react'

import toast from 'react-hot-toast'

import api from '@/lib/api'
import PINInput from '@/components/ui/PINInput'
import FeeBreakdown from '@/components/ui/FeeBreakdown'

const PLANS = [
  {
    name: 'Starter',
    min: 500,
    max: 4999,
    roi: 8,
    days: 30,
    color: '#3B82F6',
  },
  {
    name: 'Silver',
    min: 5000,
    max: 19999,
    roi: 12,
    days: 60,
    color: '#9AA5C0',
  },
  {
    name: 'Gold',
    min: 20000,
    max: 99999,
    roi: 18,
    days: 90,
    color: '#FFB830',
  },
  {
    name: 'Platinum',
    min: 100000,
    max: 999999,
    roi: 24,
    days: 180,
    color: '#8B5CF6',
  },
]

type Step = 'plans' | 'amount' | 'pin' | 'done'

export default function InvestPage() {
  const [tab, setTab] =
    useState<'plans' | 'mine'>('plans')

  const [sel, setSel] = useState<any>(null)

  const [amount, setAmount] = useState('')

  const [step, setStep] =
    useState<Step>('plans')

  const [loading, setLoading] =
    useState(false)

  const [investments, setInvestments] =
    useState<any[]>([])

  const [loadingMine, setLoadingMine] =
    useState(true)

  const [result, setResult] =
    useState<any>(null)

  useEffect(() => {
    api
      .get('/invest')
      .then((r) => setInvestments(r.data || []))
      .catch(() => {})
      .finally(() => setLoadingMine(false))
  }, [])

  const amt = parseFloat(amount) || 0

  const fee = parseFloat(
    (amt * 0.01).toFixed(2)
  )

  const expectedReturn = sel
    ? (amt * (1 + sel.roi / 100)).toFixed(2)
    : '0'

  const handlePIN = async (pin: string) => {
    setLoading(true)

    try {
      const res = await api.post('/invest', {
        plan_name: sel.name,
        amount: amt,
        pin,
      })

      setResult(res.data)

      setStep('done')

      api
        .get('/invest')
        .then((r) =>
          setInvestments(r.data || [])
        )
        .catch(() => {})

    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          'Investment failed'
      )

      setStep('amount')

    } finally {
      setLoading(false)
    }
  }

  const withdrawInvestment = async (
    id: string
  ) => {
    try {
      await api.post(`/invest/${id}/withdraw`)

      toast.success(
        'Investment payout credited to your wallet!'
      )

      api
        .get('/invest')
        .then((r) =>
          setInvestments(r.data || [])
        )
        .catch(() => {})

    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          'Withdrawal failed'
      )
    }
  }

  const reset = () => {
    setSel(null)
    setAmount('')
    setStep('plans')
    setResult(null)
  }

  const s = {
    card: {
      background: '#12121A',
      border: '1px solid #2A2A3E',
      borderRadius: 16,
      padding: 20,
    },

    input: {
      width: '100%',
      padding: '13px 16px',
      borderRadius: 12,
      background: '#1A1A26',
      border: '1px solid #2A2A3E',
      color: '#F0F0FF',
      fontSize: 14,
      outline: 'none',
      boxSizing: 'border-box' as const,
    },
  }

  return (
    <div
      style={{
        maxWidth: 700,
        margin: '0 auto',
        padding: '28px 20px',
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 800,
            fontSize: 28,
            marginBottom: 4,
          }}
        >
          Investments
        </h1>

        <p
          style={{
            color: '#8888AA',
            fontSize: 14,
          }}
        >
          Grow your money with competitive returns
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
        }}
      >
        {(['plans', 'mine'] as const).map(
          (t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                textTransform: 'capitalize',
                background:
                  tab === t
                    ? 'rgba(108,99,255,0.15)'
                    : 'transparent',
                border: `1px solid ${
                  tab === t
                    ? '#6C63FF'
                    : '#2A2A3E'
                }`,
                color:
                  tab === t
                    ? '#6C63FF'
                    : '#8888AA',
              }}
            >
              {t === 'plans'
                ? 'Investment Plans'
                : 'My Investments'}
            </button>
          )
        )}
      </div>

      {tab === 'plans' && (
        <>
          {step === 'plans' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {PLANS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setSel(p)
                    setStep('amount')
                  }}
                  style={{
                    ...s.card,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    border: `2px solid ${
                      sel?.name === p.name
                        ? p.color
                        : '#2A2A3E'
                    }`,
                    background:
                      sel?.name === p.name
                        ? p.color + '12'
                        : '#12121A',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily:
                          'Outfit, sans-serif',
                        fontWeight: 700,
                        fontSize: 18,
                        color: p.color,
                      }}
                    >
                      {p.name}
                    </span>

                    <span
                      style={{
                        background:
                          p.color + '20',
                        color: p.color,
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {p.roi}% ROI
                    </span>
                  </div>

                  <p
                    style={{
                      color: '#8888AA',
                      fontSize: 13,
                    }}
                  >
                    KES {p.min.toLocaleString()}
                    {' - '}
                    {p.max.toLocaleString()}
                    {' · '}
                    {p.days} days
                  </p>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
