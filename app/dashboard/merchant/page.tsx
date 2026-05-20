'use client'
import { useEffect, useState } from 'react'
import { merchantAPI, packageAPI } from '@/lib/api'
import { fmtKES } from '@/lib/auth'

type View = 'profile' | 'register' | 'packages' | 'links' | 'analytics'

export default function MerchantPage() {
  const [merchant, setMerchant] = useState<any>(null)
  const [loading,  setLoading]  = useState(true)
  const [view,     setView]     = useState<View>('profile')
  const [packages, setPackages] = useState<any[]>([])
  const [links,    setLinks]    = useState<any[]>([])
  const [analytics,setAnalytics]= useState<any>(null)
  const [regForm,  setRegForm]  = useState({ business_name: '', business_type: '' })
  const [pkgForm,  setPkgForm]  = useState({ name: '', description: '', category: 'WIFI', duration_type: 'HOURS', duration_value: '', price: '', speed_profile: '', device_limit: '1' })
  const [linkForm, setLinkForm] = useState({ title: '', amount: '' })
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    merchantAPI.profile()
      .then(res => { setMerchant(res.data); loadAll() })
      .catch(() => setMerchant(null))
      .finally(() => setLoading(false))
  }, [])

  const loadAll = () => {
    packageAPI.list().then(r => setPackages(r.data.packages || [])).catch(() => {})
    merchantAPI.links().then(r => setLinks(r.data.links || [])).catch(() => {})
    merchantAPI.analytics().then(r => setAnalytics(r.data)).catch(() => {})
  }

  const register = async () => {
    if (!regForm.business_name || !regForm.business_type) return setError('All fields required')
    setError(''); setSubmitting(true)
    try {
      const res = await merchantAPI.register(regForm)
      setMerchant(res.data.merchant); setView('profile')
      setSuccess('Merchant account created! Waiting for approval.')
    } catch (err: any) { setError(err.response?.data?.error || 'Failed') }
    finally { setSubmitting(false) }
  }

  const createPackage = async () => {
    if (!pkgForm.name || !pkgForm.duration_value || !pkgForm.price) return setError('Name, duration and price required')
    setError(''); setSubmitting(true)
    try {
      await packageAPI.create(pkgForm)
      setPkgForm({ name: '', description: '', category: 'WIFI', duration_type: 'HOURS', duration_value: '', price: '', speed_profile: '', device_limit: '1' })
      setSuccess('Package created successfully!')
      packageAPI.list().then(r => setPackages(r.data.packages || []))
    } catch (err: any) { setError(err.response?.data?.error || 'Failed') }
    finally { setSubmitting(false) }
  }

  const createLink = async () => {
    if (!linkForm.title) return setError('Title required')
    setError(''); setSubmitting(true)
    try {
      await merchantAPI.createLink(linkForm)
      setLinkForm({ title: '', amount: '' })
      setSuccess('Payment link created!')
      merchantAPI.links().then(r => setLinks(r.data.links || []))
    } catch (err: any) { setError(err.response?.data?.error || 'Failed') }
    finally { setSubmitting(false) }
  }

  const s = {
    input: { width: '100%', padding: '12px 14px', borderRadius: '10px', background: '#1A1A26', border: '1px solid #2A2A3E', color: '#F0F0FF', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const },
    label: { display: 'block', color: '#8888AA', fontSize: '13px', marginBottom: '6px' } as const,
    card:  { background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '16px', padding: '20px' },
  }

  if (loading) return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '28px 20px' }}>
      {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '80px', marginBottom: '12px', borderRadius: '12px' }} />)}
    </div>
  )

  if (!merchant) return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '28px 20px' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '26px', marginBottom: '6px' }}>Become a Merchant</h1>
      <p style={{ color: '#8888AA', marginBottom: '24px', fontSize: '14px' }}>
        Accept payments, create packages, and manage subscriptions
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {[
          { icon: '📶', title: 'WiFi Packages', desc: 'Sell hourly to monthly internet' },
          { icon: '💳', title: 'Payment Links', desc: 'Accept any payment instantly' },
          { icon: '📊', title: 'Analytics', desc: 'Track revenue and growth' },
          { icon: '💰', title: 'Earn More', desc: 'NanePay handles billing' },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{ ...s.card, borderTop: '2px solid #6C63FF' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
            <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{title}</p>
            <p style={{ color: '#44445A', fontSize: '12px' }}>{desc}</p>
          </div>
        ))}
      </div>

      <div style={s.card}>
        {error && <div style={{ background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.25)', borderRadius: '10px', padding: '10px', marginBottom: '14px', color: '#FF4560', fontSize: '13px' }}>⚠️ {error}</div>}
        {success && <div style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: '10px', padding: '10px', marginBottom: '14px', color: '#00D4AA', fontSize: '13px' }}>✅ {success}</div>}

        <div style={{ marginBottom: '14px' }}>
          <label style={s.label}>Business Name</label>
          <input placeholder="e.g. Zawadi Hotspot" value={regForm.business_name}
            onChange={e => setRegForm({ ...regForm, business_name: e.target.value })} style={s.input} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={s.label}>Business Type</label>
          <select value={regForm.business_type} onChange={e => setRegForm({ ...regForm, business_type: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
            <option value="">Select type...</option>
            {['WiFi / Hotspot Provider', 'Internet Service Provider', 'School', 'Real Estate / Rent', 'Utility Provider', 'Retail / Shop', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button onClick={register} disabled={submitting} style={{
          width: '100%', padding: '14px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #6C63FF, #9C92FF)',
          border: 'none', color: '#fff', fontSize: '15px', fontWeight: 600,
          cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
          boxShadow: '0 4px 20px rgba(108,99,255,0.3)',
        }}>
          {submitting ? 'Registering...' : 'Register as Merchant →'}
        </button>
      </div>
    </div>
  )

  const STATUS_COLOR: any = { PENDING: '#FFD700', APPROVED: '#00D4AA', SUSPENDED: '#FF4560', REJECTED: '#FF4560' }
  const tabs = [
    { id: 'profile',   label: 'Profile'   },
    { id: 'packages',  label: 'Packages'  },
    { id: 'links',     label: 'Pay Links' },
    { id: 'analytics', label: 'Analytics' },
  ]

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '28px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #6C63FF, #00D4AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, color: '#fff' }}>
          {merchant.business_name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '22px', marginBottom: '2px' }}>
            {merchant.business_name}
          </h1>
          <span style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '20px', background: STATUS_COLOR[merchant.status] + '18', color: STATUS_COLOR[merchant.status], fontWeight: 600 }}>
            {merchant.status}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', overflowX: 'auto' as const }}>
        {tabs.map(({ id, label }) => (
          <button key={id} onClick={() => setView(id as View)} style={{
            padding: '9px 18px', borderRadius: '10px', whiteSpace: 'nowrap' as const,
            background: view === id ? 'rgba(108,99,255,0.15)' : 'transparent',
            border: `1px solid ${view === id ? '#6C63FF' : '#2A2A3E'}`,
            color: view === id ? '#6C63FF' : '#8888AA',
            cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: '13px',
          }}>{label}</button>
        ))}
      </div>

      {error   && <div style={{ background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.25)', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', color: '#FF4560', fontSize: '13px' }}>⚠️ {error}</div>}
      {success && <div style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', color: '#00D4AA', fontSize: '13px' }}>✅ {success}</div>}

      {/* Profile */}
      {view === 'profile' && (
        <div style={s.card}>
          {[
            ['Business Name',  merchant.business_name],
            ['Business Type',  merchant.business_type],
            ['Status',         merchant.status],
            ['Merchant Slug',  merchant.slug],
            ['Fee Rate',       `${(merchant.fee_rate * 100).toFixed(1)}%`],
            ['Payment Link',   merchant.payment_link],
            ['Wallet Balance', fmtKES(merchant.wallet_balance || 0)],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2A2A3E', fontSize: '14px' }}>
              <span style={{ color: '#8888AA' }}>{k}</span>
              <span style={{ color: k === 'Wallet Balance' ? '#00D4AA' : '#F0F0FF', fontWeight: k === 'Wallet Balance' ? 600 : 400, fontFamily: k === 'API Key' || k === 'Merchant Slug' ? 'JetBrains Mono, monospace' : 'inherit', fontSize: k === 'API Key' ? '11px' : 'inherit', wordBreak: 'break-all' as const }}>{v}</span>
            </div>
          ))}
          {merchant.status === 'PENDING' && (
            <div style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '10px', padding: '12px', marginTop: '16px' }}>
              <p style={{ color: '#FFD700', fontSize: '13px' }}>⏳ Your merchant account is pending admin approval. You can set up packages while waiting.</p>
            </div>
          )}
        </div>
      )}

      {/* Packages */}
      {view === 'packages' && (
        <div>
          <div style={{ ...s.card, marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '16px' }}>Create New Package</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={s.label}>Package Name</label>
                <input placeholder="e.g. 1 Hour WiFi" value={pkgForm.name}
                  onChange={e => setPkgForm({ ...pkgForm, name: e.target.value })} style={s.input} />
              </div>
              <div>
                <label style={s.label}>Category</label>
                <select value={pkgForm.category} onChange={e => setPkgForm({ ...pkgForm, category: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                  {['WIFI', 'ELECTRICITY', 'WATER', 'SCHOOL', 'RENT', 'CUSTOM'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Duration Type</label>
                <select value={pkgForm.duration_type} onChange={e => setPkgForm({ ...pkgForm, duration_type: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                  {['MINUTES', 'HOURS', 'DAYS', 'MONTHS'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Duration Value</label>
                <input type="number" placeholder="e.g. 1" value={pkgForm.duration_value}
                  onChange={e => setPkgForm({ ...pkgForm, duration_value: e.target.value })} style={s.input} />
              </div>
              <div>
                <label style={s.label}>Price (KES)</label>
                <input type="number" placeholder="e.g. 50" value={pkgForm.price}
                  onChange={e => setPkgForm({ ...pkgForm, price: e.target.value })} style={s.input} />
              </div>
              <div>
                <label style={s.label}>Speed Profile</label>
                <input placeholder="e.g. 5Mbps" value={pkgForm.speed_profile}
                  onChange={e => setPkgForm({ ...pkgForm, speed_profile: e.target.value })} style={s.input} />
              </div>
              <div>
                <label style={s.label}>Device Limit</label>
                <input type="number" placeholder="1" value={pkgForm.device_limit}
                  onChange={e => setPkgForm({ ...pkgForm, device_limit: e.target.value })} style={s.input} />
              </div>
              <div>
                <label style={s.label}>Description</label>
                <input placeholder="Optional" value={pkgForm.description}
                  onChange={e => setPkgForm({ ...pkgForm, description: e.target.value })} style={s.input} />
              </div>
            </div>
            <button onClick={createPackage} disabled={submitting} style={{
              width: '100%', padding: '13px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6C63FF, #9C92FF)',
              border: 'none', color: '#fff', fontWeight: 600, fontSize: '14px',
              cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
            }}>
              {submitting ? 'Creating...' : '+ Create Package'}
            </button>
          </div>

          {packages.length > 0 && (
            <div style={s.card}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '14px' }}>Your Packages</h3>
              {packages.map((pkg, i) => (
                <div key={pkg.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < packages.length - 1 ? '1px solid #2A2A3E' : 'none' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{pkg.name}</p>
                    <p style={{ color: '#44445A', fontSize: '12px' }}>{pkg.duration_value} {pkg.duration_type} · {pkg.speed_profile || 'No speed set'} · {pkg.device_limit} device(s)</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#00D4AA', fontWeight: 600 }}>KES {pkg.price}</p>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: pkg.is_active ? 'rgba(0,212,170,0.1)' : 'rgba(255,69,96,0.1)', color: pkg.is_active ? '#00D4AA' : '#FF4560' }}>
                      {pkg.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payment Links */}
      {view === 'links' && (
        <div>
          <div style={{ ...s.card, marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '16px' }}>Create Payment Link</h3>
            <div style={{ marginBottom: '10px' }}>
              <label style={s.label}>Title</label>
              <input placeholder="e.g. Product Payment" value={linkForm.title}
                onChange={e => setLinkForm({ ...linkForm, title: e.target.value })} style={s.input} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={s.label}>Fixed Amount — optional (leave blank for customer to set)</label>
              <input type="number" placeholder="0.00" value={linkForm.amount}
                onChange={e => setLinkForm({ ...linkForm, amount: e.target.value })} style={s.input} />
            </div>
            <button onClick={createLink} disabled={submitting} style={{
              width: '100%', padding: '13px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #00D4AA, #00F5C3)',
              border: 'none', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
            }}>
              {submitting ? 'Creating...' : '+ Create Link'}
            </button>
          </div>

          {links.length > 0 && (
            <div style={s.card}>
              {links.map((link, i) => (
                <div key={link.id} style={{ padding: '12px 0', borderBottom: i < links.length - 1 ? '1px solid #2A2A3E' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{link.title}</p>
                      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#6C63FF', marginBottom: '4px' }}>{link.url}</p>
                      <p style={{ color: '#44445A', fontSize: '12px' }}>Collected: {fmtKES(link.collected || 0)}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {link.amount ? <p style={{ color: '#00D4AA', fontWeight: 600 }}>{fmtKES(link.amount)}</p> : <p style={{ color: '#44445A', fontSize: '12px' }}>Any amount</p>}
                      <button onClick={() => navigator.clipboard.writeText(link.url)} style={{ marginTop: '6px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '6px', padding: '4px 10px', color: '#6C63FF', fontSize: '11px', cursor: 'pointer' }}>
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analytics */}
      {view === 'analytics' && analytics && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: 'Total Volume',    value: fmtKES(analytics.total_volume || 0),   color: '#6C63FF', icon: '💰' },
            { label: 'Total Payments',  value: analytics.total_payments || 0,          color: '#00D4AA', icon: '📊' },
            { label: 'Total Fees Paid', value: fmtKES(analytics.total_fees || 0),     color: '#FF6B35', icon: '💸' },
            { label: 'Wallet Balance',  value: fmtKES(merchant.wallet_balance || 0),  color: '#FFD700', icon: '💳' },
          ].map(({ label, value, color, icon }) => (
            <div key={label} style={{ ...s.card, borderTop: `3px solid ${color}` }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
              <p style={{ color: '#44445A', fontSize: '12px', marginBottom: '4px' }}>{label}</p>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '20px', color }}>{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
