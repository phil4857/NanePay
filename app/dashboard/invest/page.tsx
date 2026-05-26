cat > /mnt/user-data/outputs/nextjs/app/dashboard/invest/page.tsx << 'EOF'
'use client'
import { useEffect, useState } from 'react'
import { TrendingUp, Clock, CheckCircle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import PINInput from '@/components/ui/PINInput'
import FeeBreakdown from '@/components/ui/FeeBreakdown'

const PLANS = [
  { name: 'Starter',  min: 500,    max: 4999,   roi: 8,  days: 30,  color: '#3B82F6' },
  { name: 'Silver',   min: 5000,   max: 19999,  roi: 12, days: 60,  color: '#9AA5C0' },
  { name: 'Gold',     min: 20000,  max: 99999,  roi: 18, days: 90,  color: '#FFB830' },
  { name: 'Platinum', min: 100000, max: 999999, roi: 24, days: 180, color: '#8B5CF6' },
]

type Step = 'plans' | 'amount' | 'pin' | 'done'

export default function InvestPage() {
  const [tab,         setTab]         = useState<'plans' | 'mine'>('plans')
  const [sel,         setSel]         = useState<any>(null)
  const [amount,      setAmount]      = useState('')
  const [step,        setStep]        = useState<Step>('plans')
  const [loading,     setLoading]     = useState(false)
  const [investments, setInvestments] = useState<any[]>([])
  const [loadingMine, setLoadingMine] = useState(true)
  const [result,      setResult]      = useState<any>(null)

  useEffect(() => {
    api.get('/invest').then(r => setInvestments(r.data || [])).catch(() => {}).finally(() => setLoadingMine(false))
  }, [])

  const amt = parseFloat(amount) || 0
  const fee = parseFloat((amt * 0.01).toFixed(2))
  const expectedReturn = sel ? (amt * (1 + sel.roi / 100)).toFixed(2) : '0'

  const handlePIN = async (pin: string) => {
    setLoading(true)
    try {
      const res = await api.post('/invest', { plan_name: sel.name, amount: amt, pin })
      setResult(res.data)
      setStep('done')
      // Refresh investments
      api.get('/invest').then(r => setInvestments(r.data || [])).catch(() => {})
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Investment failed')
      setStep('amount')
    } finally { setLoading(false) }
  }

  const withdrawInvestment = async (id: string) => {
    try {
      await api.post(`/invest/${id}/withdraw`)
      toast.success('Investment payout credited to your wallet!')
      api.get('/invest').then(r => setInvestments(r.data || [])).catch(() => {})
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Withdrawal failed')
    }
  }

  const reset = () => { setSel(null); setAmount(''); setStep('plans'); setResult(null) }

  const s = {
    card: { background: '#12121A', border: '1px solid #2A2A3E', borderRadius: 16, padding: 20 },
    input: { width: '100%', padding: '13px 16px', borderRadius: 12, background: '#1A1A26', border: '1px solid #2A2A3E', color: '#F0F0FF', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const },
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '28px 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 28, marginBottom: 4 }}>Investments</h1>
        <p style={{ color: '#8888AA', fontSize: 14 }}>Grow your money with competitive returns</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['plans', 'mine'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            textTransform: 'capitalize',
            background: tab === t ? 'rgba(108,99,255,0.15)' : 'transparent',
            border: `1px solid ${tab === t ? '#6C63FF' : '#2A2A3E'}`,
            color: tab === t ? '#6C63FF' : '#8888AA',
          }}>{t === 'plans' ? 'Investment Plans' : 'My Investments'}</button>
        ))}
      </div>

      {/* ── Plans Tab ── */}
      {tab === 'plans' && <>
        {step === 'plans' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PLANS.map(p => (
              <button key={p.name} onClick={() => { setSel(p); setStep('amount') }} style={{
                ...s.card, cursor: 'pointer', textAlign: 'left', width: '100%',
                border: `2px solid ${sel?.name === p.name ? p.color : '#2A2A3E'}`,
                background: sel?.name === p.name ? p.color + '12' : '#12121A',
                transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, color: p.color }}>{p.name}</span>
                  <span style={{ background: p.color + '20', color: p.color, padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>{p.roi}% ROI</span>
                </div>
                <p style={{ color: '#8888AA', fontSize: 13 }}>
                  KES {p.min.toLocaleString()} – {p.max.toLocaleString()} · {p.days} days
                </p>
                <p style={{ color: p.color, fontSize: 12, marginTop: 4 }}>
                  Earn KES {(p.min * (1 + p.roi / 100)).toLocaleString()} on minimum investment
                </p>
              </button>
            ))}
          </div>
        )}

        {step === 'amount' && sel && (
          <div style={s.card}>
            <button onClick={reset} style={{ background: 'none', border: 'none', color: '#8888AA', cursor: 'pointer', marginBottom: 16, fontSize: 13 }}>← Back</button>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 4, color: sel.color }}>{sel.name} Plan</h3>
            <p style={{ color: '#8888AA', fontSize: 13, marginBottom: 20 }}>{sel.roi}% ROI in {sel.days} days</p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#8888AA', fontSize: 13, marginBottom: 8 }}>
                Amount (KES {sel.min.toLocaleString()} – {sel.max.toLocaleString()})
              </label>
              <input type="number" placeholder={`Min KES ${sel.min.toLocaleString()}`} value={amount}
                onChange={e => setAmount(e.target.value)} style={s.input} />
            </div>

            {amt > 0 && <>
              <FeeBreakdown amount={amt} />
              <div style={{ background: sel.color + '12', border: `1px solid ${sel.color}30`, borderRadius: 10, padding: '10px 14px', marginTop: 10 }}>
                <p style={{ color: '#8888AA', fontSize: 12 }}>Expected return after {sel.days} days</p>
                <p style={{ color: sel.color, fontWeight: 700, fontSize: 18, marginTop: 2 }}>KES {Number(expectedReturn).toLocaleString()}</p>
              </div>
            </>}

            <button onClick={() => {
              if (amt < sel.min || amt > sel.max) return toast.error(`Amount must be KES ${sel.min.toLocaleString()} – ${sel.max.toLocaleString()}`)
              setStep('pin')
            }} style={{
              width: '100%', marginTop: 16, padding: '14px', borderRadius: 12,
              background: `linear-gradient(135deg, ${sel.color}, ${sel.color}cc)`,
              border: 'none', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}>Invest Now →</button>
          </div>
        )}

        {step === 'pin' && sel && (
          <div style={{ ...s.card, textAlign: 'center' }}>
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: '#8888AA', fontSize: 13, marginBottom: 6 }}>{sel.name} Plan · {sel.roi}% ROI</p>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 32 }}>
                KES {amt.toLocaleString()}
              </p>
              <p style={{ color: '#FF6B35', fontSize: 13 }}>+KES {fee} fee = KES {(amt + fee).toLocaleString()} total</p>
            </div>
            {loading
              ? <div style={{ display: 'flex', justifyContent: 'center' }}><RefreshCw style={{ animation: 'spin 0.6s linear infinite', color: '#6C63FF' }} /></div>
              : <PINInput label="Enter your 4-digit PIN to confirm" onComplete={handlePIN} disabled={loading} />
            }
          </div>
        )}

        {step === 'done' && result && (
          <div style={{ ...s.card, textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>📈</div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 24, marginBottom: 8 }}>Investment Active!</h2>
            <p style={{ color: '#8888AA', marginBottom: 20 }}>
              KES {amt.toLocaleString()} invested in {sel?.name} plan
            </p>
            <div style={{ background: '#1A1A26', borderRadius: 10, padding: 14, marginBottom: 20, border: '1px solid #2A2A3E' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: '#8888AA' }}>Expected return</span>
                <span style={{ color: '#00D4AA', fontWeight: 700 }}>KES {Number(expectedReturn).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#8888AA' }}>Matures on</span>
                <span style={{ color: '#F0F0FF' }}>
                  {new Date(Date.now() + sel!.days * 86400000).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
            <p style={{ color: '#8888AA', fontSize: 12, marginBottom: 20 }}>You'll receive email & SMS updates</p>
            <button onClick={() => { reset(); setTab('mine') }} style={{
              width: '100%', padding: 14, borderRadius: 12,
              background: 'linear-gradient(135deg, #6C63FF, #9C92FF)',
              border: 'none', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}>View My Investments</button>
          </div>
        )}
      </>}

      {/* ── My Investments Tab ── */}
      {tab === 'mine' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loadingMine ? [1,2].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14 }} />) :
          investments.length === 0 ? (
            <div style={{ ...s.card, textAlign: 'center', padding: 48 }}>
              <TrendingUp style={{ width: 48, height: 48, color: '#2A2A3E', margin: '0 auto 12px' }} />
              <p style={{ color: '#8888AA' }}>No investments yet</p>
              <button onClick={() => setTab('plans')} style={{
                marginTop: 16, padding: '10px 24px', borderRadius: 10,
                background: 'linear-gradient(135deg, #6C63FF, #9C92FF)',
                border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14,
              }}>Start Investing</button>
            </div>
          ) : investments.map(inv => {
            const matured = new Date() > new Date(inv.matures_at)
            const plan = PLANS.find(p => p.name === inv.plan_name)
            return (
              <div key={inv.id} style={{ ...s.card, border: `1px solid ${plan?.color || '#2A2A3E'}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 16, color: plan?.color || '#F0F0FF', marginBottom: 3 }}>{inv.plan_name}</p>
                    <p style={{ color: '#8888AA', fontSize: 13 }}>{inv.roi}% ROI · {inv.duration_days} days</p>
                  </div>
                  <span style={{
                    fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                    background: matured ? 'rgba(0,212,170,0.15)' : 'rgba(255,215,0,0.15)',
                    color: matured ? '#00D4AA' : '#FFD700',
                  }}>{matured ? '✓ Matured' : 'Active'}</span>
                </div>
                <div style={{ display: 'flex', gap: 12, marginBottom: matured && inv.status === 'active' ? 14 : 0 }}>
                  <div style={{ flex: 1, background: '#1A1A26', borderRadius: 8, padding: '8px 12px' }}>
                    <p style={{ color: '#8888AA', fontSize: 11 }}>Invested</p>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>KES {Number(inv.amount).toLocaleString()}</p>
                  </div>
                  <div style={{ flex: 1, background: '#1A1A26', borderRadius: 8, padding: '8px 12px' }}>
                    <p style={{ color: '#8888AA', fontSize: 11 }}>Expected return</p>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#00D4AA' }}>KES {Number(inv.expected_return).toLocaleString()}</p>
                  </div>
                  <div style={{ flex: 1, background: '#1A1A26', borderRadius: 8, padding: '8px 12px' }}>
                    <p style={{ color: '#8888AA', fontSize: 11 }}>Matures</p>
                    <p style={{ fontWeight: 600, fontSize: 12 }}>{new Date(inv.matures_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>
                {matured && inv.status === 'active' && (
                  <button onClick={() => withdrawInvestment(inv.id)} style={{
                    width: '100%', padding: '11px', borderRadius: 10,
                    background: 'linear-gradient(135deg, #00D4AA, #00F5C3)',
                    border: 'none', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                  }}>💰 Withdraw KES {Number(inv.expected_return).toLocaleString()}</button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
EOF
echo "done"
