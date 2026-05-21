// app/dashboard/wifi/page.tsx  ← NEW FILE
'use client'
import { useEffect, useState } from 'react'
import { Wifi, Clock, Zap, Users, RefreshCw, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import STKModal from '@/components/payment/STKModal'

interface Offer {
  id: string; name: string; duration_type: string; duration_hours: number
  price: number; speed_profile: string; max_devices: number
  business_name: string; location: string; rating: number
}

interface Session {
  id: string; offer_name: string; business_name: string
  expiry_time: string; status: string; speed_profile: string
  username: string; password: string
}

export default function WiFiPage() {
  const [offers,     setOffers]     = useState<Offer[]>([])
  const [sessions,   setSessions]   = useState<Session[]>([])
  const [loading,    setLoading]    = useState(true)
  const [buying,     setBuying]     = useState<string | null>(null)
  const [modalOpen,  setModalOpen]  = useState(false)
  const [checkoutId, setCheckoutId] = useState<string | null>(null)
  const [pendingInfo, setPendingInfo] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      api.get('/wifi/offers'),
      api.get('/wifi/sessions'),
    ]).then(([o, s]) => {
      setOffers(o.data.offers)
      setSessions(s.data.sessions.filter((s: Session) => s.status === 'active'))
    }).finally(() => setLoading(false))
  }, [])

  const handleBuy = async (offer: Offer) => {
    setBuying(offer.id)
    try {
      const { data } = await api.post('/wifi/purchase', { offerId: offer.id })
      setCheckoutId(data.checkoutRequestId)
      setPendingInfo({ amount: data.offer.price, fee: data.fee, total: data.total, name: offer.name })
      setModalOpen(true)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Purchase failed')
    } finally {
      setBuying(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="w-6 h-6 text-brand-green animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="font-display text-2xl font-bold text-white">Internet Packages</h1>

      {/* Active sessions */}
      {sessions.length > 0 && (
        <div>
          <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-brand-green" /> Active Sessions
          </h2>
          <div className="space-y-3">
            {sessions.map(s => {
              const expiry  = new Date(s.expiry_time)
              const mins    = Math.max(0, Math.floor((expiry.getTime() - Date.now()) / 60000))
              const hours   = Math.floor(mins / 60)
              const timeLeft = hours > 0 ? `${hours}h ${mins % 60}m left` : `${mins}m left`
              return (
                <div key={s.id} className="card p-4 border-brand-green/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold text-white">{s.offer_name}</div>
                      <div className="text-brand-muted text-xs">{s.business_name} · {s.speed_profile}</div>
                    </div>
                    <div className="badge-green">{timeLeft}</div>
                  </div>
                  <div className="bg-brand-dark rounded-lg p-3 text-xs font-mono">
                    <span className="text-brand-muted">User: </span><span className="text-white">{s.username}</span>
                    <span className="text-brand-muted ml-4">Pass: </span><span className="text-white">{s.password}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Offers */}
      <div>
        <h2 className="font-semibold text-white mb-3">Available Packages</h2>
        {offers.length === 0 ? (
          <div className="card p-12 text-center text-brand-muted">No packages available at the moment.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {offers.map(offer => (
              <div key={offer.id} className="card-hover p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-white">{offer.name}</div>
                    <div className="text-brand-muted text-xs mt-0.5">{offer.business_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-bold text-brand-green">KES {offer.price}</div>
                    <div className="text-brand-muted text-xs capitalize">{offer.duration_type}</div>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-brand-muted">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{offer.speed_profile}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{offer.max_devices} device{offer.max_devices > 1 ? 's' : ''}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{offer.duration_hours}h</span>
                </div>
                <button onClick={() => handleBuy(offer)}
                  disabled={buying === offer.id}
                  className="btn-primary py-2.5 text-sm flex items-center justify-center gap-2">
                  <Wifi className="w-4 h-4" />
                  {buying === offer.id ? 'Processing…' : `Buy — KES ${offer.price}`}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <STKModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false)
          toast.success('WiFi activated! Check your active sessions.')
          window.location.reload()
        }}
        checkoutRequestId={checkoutId}
        amount={pendingInfo?.amount || 0}
        fee={pendingInfo?.fee || 0}
        description={pendingInfo?.name || 'WiFi Package'}
      />
    </div>
  )
}
