'use client'
import { useState } from 'react'
import api from '@/lib/api'

// ── WIFI PROVIDERS ────────────────────────────────────────────
const WIFI_PROVIDERS = [
  {
    id: 'safaricom', name: 'Safaricom Home Fibre', logo: '📶', color: '#00b050',
    packages: [
      { id: 'saf_1hr',   label: '1 Hour',   price: 20,   validity: '1 hour',   speed: '5 Mbps'  },
      { id: 'saf_3hr',   label: '3 Hours',  price: 50,   validity: '3 hours',  speed: '5 Mbps'  },
      { id: 'saf_6hr',   label: '6 Hours',  price: 80,   validity: '6 hours',  speed: '10 Mbps' },
      { id: 'saf_12hr',  label: '12 Hours', price: 130,  validity: '12 hours', speed: '10 Mbps' },
      { id: 'saf_24hr',  label: '24 Hours', price: 200,  validity: '24 hours', speed: '20 Mbps' },
      { id: 'saf_7day',  label: '7 Days',   price: 900,  validity: '7 days',   speed: '20 Mbps' },
      { id: 'saf_30day', label: '30 Days',  price: 2999, validity: '30 days',  speed: '40 Mbps' },
    ],
  },
  {
    id: 'zuku', name: 'Zuku Fibre', logo: '📶', color: '#0057b7',
    packages: [
      { id: 'zuku_1hr',   label: '1 Hour',   price: 15,   validity: '1 hour',   speed: '4 Mbps'  },
      { id: 'zuku_3hr',   label: '3 Hours',  price: 40,   validity: '3 hours',  speed: '4 Mbps'  },
      { id: 'zuku_6hr',   label: '6 Hours',  price: 70,   validity: '6 hours',  speed: '8 Mbps'  },
      { id: 'zuku_12hr',  label: '12 Hours', price: 110,  validity: '12 hours', speed: '8 Mbps'  },
      { id: 'zuku_24hr',  label: '24 Hours', price: 180,  validity: '24 hours', speed: '15 Mbps' },
      { id: 'zuku_7day',  label: '7 Days',   price: 750,  validity: '7 days',   speed: '15 Mbps' },
      { id: 'zuku_30day', label: '30 Days',  price: 2499, validity: '30 days',  speed: '30 Mbps' },
    ],
  },
  {
    id: 'faiba', name: 'Faiba 4G', logo: '📶', color: '#e63946',
    packages: [
      { id: 'faiba_1hr',   label: '1 Hour',   price: 10,   validity: '1 hour',   speed: '3 Mbps'  },
      { id: 'faiba_3hr',   label: '3 Hours',  price: 25,   validity: '3 hours',  speed: '3 Mbps'  },
      { id: 'faiba_6hr',   label: '6 Hours',  price: 50,   validity: '6 hours',  speed: '5 Mbps'  },
      { id: 'faiba_12hr',  label: '12 Hours', price: 90,   validity: '12 hours', speed: '5 Mbps'  },
      { id: 'faiba_24hr',  label: '24 Hours', price: 150,  validity: '24 hours', speed: '10 Mbps' },
      { id: 'faiba_7day',  label: '7 Days',   price: 600,  validity: '7 days',   speed: '10 Mbps' },
      { id: 'faiba_30day', label: '30 Days',  price: 1999, validity: '30 days',  speed: '20 Mbps' },
    ],
  },
  {
    id: 'airtel', name: 'Airtel Home', logo: '📶', color: '#d62828',
    packages: [
      { id: 'airtel_1hr',   label: '1 Hour',   price: 15,   validity: '1 hour',   speed: '4 Mbps'  },
      { id: 'airtel_3hr',   label: '3 Hours',  price: 35,   validity: '3 hours',  speed: '4 Mbps'  },
      { id: 'airtel_6hr',   label: '6 Hours',  price: 65,   validity: '6 hours',  speed: '8 Mbps'  },
      { id: 'airtel_12hr',  label: '12 Hours', price: 100,  validity: '12 hours', speed: '8 Mbps'  },
      { id: 'airtel_24hr',  label: '24 Hours', price: 170,  validity: '24 hours', speed: '15 Mbps' },
      { id: 'airtel_7day',  label: '7 Days',   price: 700,  validity: '7 days',   speed: '15 Mbps' },
      { id: 'airtel_30day', label: '30 Days',  price: 2299, validity: '30 days',  speed: '25 Mbps' },
    ],
  },
  {
    id: 'custom', name: 'Custom Hotspot', logo: '📶', color: '#c8602a',
    packages: [
      { id: 'custom_30min', label: '30 Mins',  price: 5,   validity: '30 mins',  speed: 'Varies' },
      { id: 'custom_1hr',   label: '1 Hour',   price: 10,  validity: '1 hour',   speed: 'Varies' },
      { id: 'custom_2hr',   label: '2 Hours',  price: 20,  validity: '2 hours',  speed: 'Varies' },
      { id: 'custom_3hr',   label: '3 Hours',  price: 30,  validity: '3 hours',  speed: 'Varies' },
      { id: 'custom_6hr',   label: '6 Hours',  price: 50,  validity: '6 hours',  speed: 'Varies' },
      { id: 'custom_12hr',  label: '12 Hours', price: 80,  validity: '12 hours', speed: 'Varies' },
      { id: 'custom_24hr',  label: '24 Hours', price: 120, validity: '24 hours', speed: 'Varies' },
    ],
  },
]

const OTHER_BILLS = [
  { type: 'ELECTRICITY', icon: '⚡', label: 'Electricity', color: '#d4a853',
    hint: 'Meter Number', placeholder: 'e.g. 12345678',
    providers: ['KPLC Prepaid Token', 'KPLC Postpaid'] },
  { type: 'WATER', icon: '💧', label: 'Water', color: '#52b788',
    hint: 'Account Number', placeholder: 'e.g. WTR-001234',
    providers: ['Nairobi Water', 'Mombasa Water', 'Kisumu Water'] },
  { type: 'SCHOOL', icon: '🎓', label: 'School Fees', color: '#9b59b6',
    hint: 'Student / Admission Number', placeholder: 'e.g. STU-2024-001',
    providers: ['Primary School', 'Secondary School', 'University / TVET'] },
  { type: 'RENT', icon: '🏠', label: 'Rent', color: '#c8602a',
    hint: 'Tenant / Reference Number', placeholder: 'e.g. RENT-APT-001',
    providers: ['Residential Rent', 'Commercial Rent'] },
]

type View = 'menu' | 'wifi-providers' | 'wifi-packages' | 'other-form' | 'done'

export default function BillsPage() {
  const [view,      setView]      = useState<View>('menu')
  const [wifiProv,  setWifiProv]  = useState<any>(null)
  const [wifiPkg,   setWifiPkg]   = useState<any>(null)
  const [otherBill, setOtherBill] = useState<any>(null)
  const [account,   setAccount]   = useState('')
  const [amount,    setAmount]    = useState('')
  const [provider,  setProvider]  = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [done,      setDone]      = useState<any>(null)

  const FEE_RATE = 0.01

  const calcFee   = (amt: number) => parseFloat((amt * FEE_RATE).toFixed(2))
  const calcTotal = (amt: number) => parseFloat((amt + calcFee(amt)).toFixed(2))

  const reset = () => {
    setView('menu'); setWifiProv(null); setWifiPkg(null)
    setOtherBill(null); setAccount(''); setAmount('')
    setProvider(''); setError(''); setDone(null)
  }

  const payWifi = async () => {
    if (!account) return setError('Enter your account/customer number')
    setError(''); setLoading(true)
    try {
      const res = await api.post('/bills/wifi', {
        provider_id:    wifiProv.id,
        package_id:     wifiPkg.id,
        account_number: account,
      })
      setDone(res.data); setView('done')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payment failed.')
    } finally { setLoading(false) }
  }

  const payOther = async () => {
    if (!account || !amount || !provider) return setError('Fill in all fields')
    setError(''); setLoading(true)
    try {
      const res = await api.post('/bills/pay', {
        type:           otherBill.type,
        provider_id:    provider,
        account_number: account,
        amount:         parseFloat(amount),
      })
      setDone(res.data); setView('done')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payment failed.')
    } finally { setLoading(false) }
  }

  const card = (style?: any) => ({
    background: '#161210',
    border: '1px solid #2a211a',
    borderRadius: '16px',
    padding: '20px',
    ...style,
  })

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: '12px',
    background: '#1c1714', border: '1px solid #2a211a',
    color: '#f0e6dc', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const btn = (disabled = false) => ({
    width: '100%', padding: '14px', borderRadius: '12px',
    background: disabled ? '#2a211a' : 'linear-gradient(135deg, #c8602a, #d4a853)',
    border: 'none', color: '#fff', fontSize: '15px',
    fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  })

  const backBtn = (onClick: () => void) => (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', color: '#a8917f',
      cursor: 'pointer', fontSize: '14px', marginBottom: '20px',
      display: 'flex', alignItems: 'center', gap: '6px', padding: 0,
    }}>← Back</button>
  )

  // ── SUCCESS SCREEN ────────────────────────────────────────
  if (view === 'done' && done) return (
    <div className="max-w-md mx-auto p-8">
      <div style={card({ textAlign: 'center' })}>
        <div style={{ fontSize: '52px', marginBottom: '12px' }}>✅</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '24px', marginBottom: '6px' }}>
          Payment Successful!
        </h2>
        <p style={{ color: '#a8917f', marginBottom: '24px', fontSize: '14px' }}>
          {done.provider || done.bill_type} · {done.validity || done.account_number}
        </p>

        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #2a211a', marginBottom: '20px' }}>
          {[
            ['Reference',     done.reference],
            ['Provider',      done.provider || done.bill_type],
            done.package ? ['Package', `${done.package} (${done.validity})`] : null,
            done.speed    ? ['Speed',   done.speed]   : null,
            ['Account',       done.account_number],
            ['Amount',        `KES ${done.amount?.toLocaleString()}`],
            ['NanePay Fee (1%)', `KES ${done.fee}`],
            ['Total Charged', `KES ${done.total_charged?.toLocaleString()}`],
          ].filter(Boolean).map(([k, v]: any, i, arr) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '11px 16px', fontSize: '13px',
              background: i % 2 === 0 ? '#1c1714' : '#161210',
              borderBottom: i < arr.length - 1 ? '1px solid #2a211a' : 'none',
            }}>
              <span style={{ color: '#6b5a4e' }}>{k}</span>
              <span style={{ color: k === 'Total Charged' ? '#d4a853' : '#f0e6dc', fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>

        <button onClick={reset} style={btn()}>Pay Another Bill</button>
      </div>
    </div>
  )

  // ── MAIN MENU ─────────────────────────────────────────────
  if (view === 'menu') return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', marginBottom: '6px' }}>
        Bill Payments
      </h1>
      <p style={{ color: '#a8917f', marginBottom: '28px', fontSize: '14px' }}>
        All payments charged 1% NanePay fee
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* WiFi Card */}
        <div onClick={() => setView('wifi-providers')}
          style={{ ...card(), cursor: 'pointer', borderTop: '3px solid #00b4d8' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#00b4d8')}
          onMouseLeave={e => (e.currentTarget.style.borderTopColor = '#00b4d8')}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📶</div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
            WiFi / Hotspot
          </h3>
          <p style={{ color: '#6b5a4e', fontSize: '12px', marginBottom: '10px' }}>
            Hourly, daily & monthly plans
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {['Safaricom', 'Zuku', 'Faiba', 'Airtel', 'Custom'].map(p => (
              <span key={p} style={{
                fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
                background: 'rgba(0,180,216,0.1)', color: '#00b4d8',
              }}>{p}</span>
            ))}
          </div>
        </div>

        {/* Other Bills */}
        {OTHER_BILLS.map(bill => (
          <div key={bill.type}
            onClick={() => { setOtherBill(bill); setView('other-form') }}
            style={{ ...card(), cursor: 'pointer', borderTop: `3px solid ${bill.color}` }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>{bill.icon}</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
              {bill.label}
            </h3>
            <p style={{ color: '#6b5a4e', fontSize: '12px', marginBottom: '10px' }}>
              {bill.providers.join(', ')}
            </p>
            <span style={{
              fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
              background: bill.color + '18', color: bill.color,
            }}>1% fee</span>
          </div>
        ))}
      </div>
    </div>
  )

  // ── WIFI PROVIDER SELECTION ───────────────────────────────
  if (view === 'wifi-providers') return (
    <div className="max-w-3xl mx-auto p-8">
      {backBtn(() => setView('menu'))}
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '26px', marginBottom: '6px' }}>
        Select WiFi Provider
      </h1>
      <p style={{ color: '#a8917f', marginBottom: '24px', fontSize: '14px' }}>
        Choose your internet provider
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {WIFI_PROVIDERS.map(p => (
          <div key={p.id}
            onClick={() => { setWifiProv(p); setView('wifi-packages') }}
            style={{ ...card(), cursor: 'pointer', borderLeft: `3px solid ${p.color}` }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1c1714')}
            onMouseLeave={e => (e.currentTarget.style.background = '#161210')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '28px' }}>{p.logo}</div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px' }}>{p.name}</p>
                <p style={{ color: '#6b5a4e', fontSize: '12px' }}>
                  {p.packages.length} packages · From KES {Math.min(...p.packages.map(pk => pk.price))}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ── WIFI PACKAGE SELECTION ────────────────────────────────
  if (view === 'wifi-packages' && wifiProv) return (
    <div className="max-w-2xl mx-auto p-8">
      {backBtn(() => setView('wifi-providers'))}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ fontSize: '28px' }}>{wifiProv.logo}</div>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '24px' }}>
            {wifiProv.name}
          </h1>
          <p style={{ color: '#a8917f', fontSize: '13px' }}>Select a package</p>
        </div>
      </div>

      {/* Hourly packages */}
      {['30 Mins', '1 Hour', '2 Hours', '3 Hours', '6 Hours', '12 Hours', '24 Hours'].some(
        label => wifiProv.packages.some((p: any) => p.label === label)
      ) && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: '#6b5a4e', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Short Term
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {wifiProv.packages
              .filter((p: any) => ['30 Mins','1 Hour','2 Hours','3 Hours','6 Hours','12 Hours','24 Hours'].includes(p.label))
              .map((pkg: any) => (
                <div key={pkg.id}
                  onClick={() => { setWifiPkg(pkg); setError('') }}
                  style={{
                    ...card({ padding: '14px', cursor: 'pointer' }),
                    border: `1px solid ${wifiPkg?.id === pkg.id ? wifiProv.color : '#2a211a'}`,
                    background: wifiPkg?.id === pkg.id ? wifiProv.color + '15' : '#161210',
                  }}>
                  <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', marginBottom: '2px', color: wifiPkg?.id === pkg.id ? wifiProv.color : '#f0e6dc' }}>
                    {pkg.label}
                  </p>
                  <p style={{ color: '#d4a853', fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>
                    KES {pkg.price}
                  </p>
                  <p style={{ color: '#6b5a4e', fontSize: '11px' }}>{pkg.speed}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Long term packages */}
      {wifiProv.packages.some((p: any) => ['7 Days', '30 Days'].includes(p.label)) && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: '#6b5a4e', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Long Term
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {wifiProv.packages
              .filter((p: any) => ['7 Days', '30 Days'].includes(p.label))
              .map((pkg: any) => (
                <div key={pkg.id}
                  onClick={() => { setWifiPkg(pkg); setError('') }}
                  style={{
                    ...card({ padding: '16px', cursor: 'pointer' }),
                    border: `1px solid ${wifiPkg?.id === pkg.id ? wifiProv.color : '#2a211a'}`,
                    background: wifiPkg?.id === pkg.id ? wifiProv.color + '15' : '#161210',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: wifiPkg?.id === pkg.id ? wifiProv.color : '#f0e6dc' }}>
                        {pkg.label}
                      </p>
                      <p style={{ color: '#6b5a4e', fontSize: '12px' }}>{pkg.speed}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: '#d4a853', fontWeight: 700, fontSize: '18px' }}>
                        KES {pkg.price.toLocaleString()}
                      </p>
                      {wifiPkg?.id === pkg.id && <span style={{ color: wifiProv.color, fontSize: '12px' }}>✓ Selected</span>}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Account number + confirm */}
      {wifiPkg && (
        <div style={card()}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '16px' }}>
            Complete Payment
          </h3>

          {error && (
            <div style={{
              background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.2)',
              borderRadius: '10px', padding: '10px 14px', marginBottom: '14px',
              color: '#e74c3c', fontSize: '13px',
            }}>⚠️ {error}</div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', color: '#a8917f', fontSize: '13px', marginBottom: '8px' }}>
              Account / Customer Number
            </label>
            <input
              type="text"
              placeholder="Your account number"
              value={account}
              onChange={e => setAccount(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Fee Summary */}
          <div style={{
            background: '#1c1714', border: '1px solid #2a211a',
            borderRadius: '10px', padding: '12px 14px', marginBottom: '14px',
          }}>
            {[
              ['Provider',        wifiProv.name],
              ['Package',         `${wifiPkg.label} (${wifiPkg.validity})`],
              ['Speed',           wifiPkg.speed],
              ['Package Price',   `KES ${wifiPkg.price}`],
              ['NanePay Fee (1%)',`KES ${calcFee(wifiPkg.price)}`],
              ['Total',           `KES ${calcTotal(wifiPkg.price)}`],
            ].map(([k, v], i, arr) => (
              <div key={k} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '6px 0', fontSize: '13px',
                borderBottom: i < arr.length - 1 ? '1px solid #2a211a' : 'none',
              }}>
                <span style={{ color: '#6b5a4e' }}>{k}</span>
                <span style={{ color: k === 'Total' ? '#d4a853' : '#f0e6dc', fontWeight: k === 'Total' ? 700 : 400 }}>{v}</span>
              </div>
            ))}
          </div>

          <button
            onClick={payWifi}
            disabled={loading || !account}
            style={btn(loading || !account)}>
            {loading ? '⏳ Processing...' : `Pay KES ${calcTotal(wifiPkg.price)}`}
          </button>
        </div>
      )}
    </div>
  )

  // ── OTHER BILL FORM ───────────────────────────────────────
  if (view === 'other-form' && otherBill) return (
    <div className="max-w-md mx-auto p-8">
      {backBtn(() => setView('menu'))}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: otherBill.color + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px',
        }}>{otherBill.icon}</div>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '22px' }}>
            {otherBill.label}
          </h1>
          <p style={{ color: '#a8917f', fontSize: '13px' }}>1% NanePay fee</p>
        </div>
      </div>

      <div style={card()}>
        {error && (
          <div style={{
            background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.2)',
            borderRadius: '10px', padding: '10px 14px', marginBottom: '14px',
            color: '#e74c3c', fontSize: '13px',
          }}>⚠️ {error}</div>
        )}

        {/* Provider */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', color: '#a8917f', fontSize: '13px', marginBottom: '8px' }}>
            Provider
          </label>
          <select value={provider} onChange={e => setProvider(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="">Select provider...</option>
            {otherBill.providers.map((p: string) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Account */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', color: '#a8917f', fontSize: '13px', marginBottom: '8px' }}>
            {otherBill.hint}
          </label>
          <input
            type="text"
            placeholder={otherBill.placeholder}
            value={account}
            onChange={e => setAccount(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Amount */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', color: '#a8917f', fontSize: '13px', marginBottom: '8px' }}>
            Amount (KES)
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Fee Preview */}
        {parseFloat(amount) > 0 && (
          <div style={{
            background: '#1c1714', border: '1px solid #2a211a',
            borderRadius: '10px', padding: '12px 14px', marginBottom: '14px',
          }}>
            {[
              ['Amount',          `KES ${parseFloat(amount).toLocaleString()}`],
              ['NanePay Fee (1%)',`KES ${calcFee(parseFloat(amount))}`],
              ['Total',           `KES ${calcTotal(parseFloat(amount)).toLocaleString()}`],
            ].map(([k, v], i) => (
              <div key={k} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '6px 0', fontSize: '13px',
                borderBottom: i < 2 ? '1px solid #2a211a' : 'none',
              }}>
                <span style={{ color: '#6b5a4e' }}>{k}</span>
                <span style={{ color: k === 'Total' ? '#d4a853' : '#f0e6dc', fontWeight: k === 'Total' ? 700 : 400 }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={payOther}
          disabled={loading || !account || !amount || !provider}
          style={btn(loading || !account || !amount || !provider)}>
          {loading ? '⏳ Processing...' : `Pay ${amount ? `KES ${calcTotal(parseFloat(amount)).toLocaleString()}` : 'Now'}`}
        </button>
      </div>
    </div>
  )

  return null
}
