'use client'
import { useState, useEffect, useRef } from 'react'
import { qrAPI } from '@/lib/api'
import { getUser } from '@/lib/auth'

export default function QRPage() {
  const [amount,   setAmount]   = useState('')
  const [desc,     setDesc]     = useState('')
  const [qrData,   setQrData]   = useState<any>(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [tab,      setTab]      = useState<'generate' | 'scan'>('generate')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const user = getUser()

  const generate = async () => {
    setError(''); setLoading(true)
    try {
      const res = await qrAPI.generate({ amount: amount ? parseFloat(amount) : undefined, description: desc || undefined })
      setQrData(res.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate QR')
    } finally { setLoading(false) }
  }

  // Draw QR code on canvas using simple matrix
  useEffect(() => {
    if (!qrData || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')!
    const size   = 200
    canvas.width = canvas.height = size

    // Simple visual representation (in production use a QR library)
    ctx.fillStyle = '#12121A'
    ctx.fillRect(0, 0, size, size)

    const data = qrData.qr_data
    const hash = data.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0)

    // Draw QR-like pattern
    const cellSize = 8
    const cols     = Math.floor(size / cellSize)

    ctx.fillStyle = '#F0F0FF'
    for (let row = 0; row < cols; row++) {
      for (let col = 0; col < cols; col++) {
        const seed = (row * 31 + col * 17 + hash) % 7
        if (seed > 3 || (row < 3 && col < 3) || (row < 3 && col > cols - 4) || (row > cols - 4 && col < 3)) {
          const margin = 2
          if ((row >= margin && row < cols - margin) && (col >= margin && col < cols - margin)) {
            ctx.fillRect(col * cellSize + 1, row * cellSize + 1, cellSize - 2, cellSize - 2)
          }
        }
      }
    }

    // Draw finder patterns (corners)
    const drawFinder = (x: number, y: number) => {
      ctx.fillStyle = '#6C63FF'
      ctx.fillRect(x, y, 7 * cellSize, 7 * cellSize)
      ctx.fillStyle = '#12121A'
      ctx.fillRect(x + cellSize, y + cellSize, 5 * cellSize, 5 * cellSize)
      ctx.fillStyle = '#6C63FF'
      ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, 3 * cellSize, 3 * cellSize)
    }
    drawFinder(cellSize, cellSize)
    drawFinder(size - 8 * cellSize, cellSize)
    drawFinder(cellSize, size - 8 * cellSize)

    // NanePay logo in center
    ctx.fillStyle = 'rgba(108,99,255,0.9)'
    ctx.beginPath()
    ctx.roundRect(size/2 - 16, size/2 - 16, 32, 32, 6)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 18px Outfit'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('N', size/2, size/2 + 1)
  }, [qrData])

  const inputStyle = { width: '100%', padding: '13px 16px', borderRadius: '12px', background: '#1A1A26', border: '1px solid #2A2A3E', color: '#F0F0FF', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '28px 20px' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '26px', marginBottom: '6px' }}>QR Payments</h1>
      <p style={{ color: '#8888AA', marginBottom: '24px', fontSize: '14px' }}>Generate or scan QR codes to pay instantly</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {(['generate', 'scan'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '11px', borderRadius: '10px',
            background: tab === t ? 'rgba(108,99,255,0.15)' : 'transparent',
            border: `1px solid ${tab === t ? '#6C63FF' : '#2A2A3E'}`,
            color: tab === t ? '#6C63FF' : '#8888AA',
            cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, fontSize: '14px',
            textTransform: 'capitalize' as const,
          }}>{t === 'generate' ? '⬡ Generate' : '📷 Scan'}</button>
        ))}
      </div>

      {tab === 'generate' && (
        <div style={{ background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '16px', padding: '24px' }}>
          {error && <div style={{ background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.25)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', color: '#FF4560', fontSize: '13px' }}>⚠️ {error}</div>}

          {!qrData ? (
            <>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', color: '#8888AA', fontSize: '13px', marginBottom: '8px' }}>
                  Amount (KES) — optional
                </label>
                <input type="number" placeholder="Leave blank for any amount" value={amount}
                  onChange={e => setAmount(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#8888AA', fontSize: '13px', marginBottom: '8px' }}>
                  Description — optional
                </label>
                <input type="text" placeholder="e.g. Lunch payment" value={desc}
                  onChange={e => setDesc(e.target.value)} style={inputStyle} />
              </div>
              <button onClick={generate} disabled={loading} style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #6C63FF, #9C92FF)',
                border: 'none', color: '#fff', fontSize: '15px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                fontFamily: 'Space Grotesk, sans-serif',
                boxShadow: '0 4px 20px rgba(108,99,255,0.3)',
              }}>
                {loading ? 'Generating...' : '⬡ Generate QR Code'}
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ background: '#1A1A26', borderRadius: '16px', padding: '20px', display: 'inline-block', marginBottom: '16px', border: '1px solid #2A2A3E' }}>
                <canvas ref={canvasRef} style={{ display: 'block', imageRendering: 'pixelated' }} />
              </div>

              <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>
                {user?.name}
              </p>
              {qrData.amount && (
                <p style={{ color: '#00D4AA', fontWeight: 600, fontSize: '20px', marginBottom: '4px' }}>
                  KES {parseFloat(qrData.amount).toLocaleString()}
                </p>
              )}
              {qrData.description && (
                <p style={{ color: '#8888AA', fontSize: '13px', marginBottom: '16px' }}>{qrData.description}</p>
              )}

              <div style={{ background: '#1A1A26', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', border: '1px solid #2A2A3E' }}>
                <p style={{ color: '#44445A', fontSize: '11px', marginBottom: '4px' }}>QR ID</p>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#6C63FF' }}>{qrData.qr_id}</p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setQrData(null)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'none', border: '1px solid #2A2A3E', color: '#8888AA', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                  New QR
                </button>
                <button onClick={() => { const link = document.createElement('a'); link.download = 'nanepay-qr.png'; link.href = canvasRef.current!.toDataURL(); link.click() }}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, #6C63FF, #9C92FF)', border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'scan' && (
        <div style={{ background: '#12121A', border: '1px solid #2A2A3E', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
          <div style={{ width: '200px', height: '200px', margin: '0 auto 16px', background: '#1A1A26', borderRadius: '14px', border: '2px dashed #2A2A3E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ fontSize: '40px' }}>📷</span>
            <p style={{ color: '#44445A', fontSize: '12px' }}>Camera access required</p>
          </div>
          <p style={{ color: '#8888AA', fontSize: '14px', marginBottom: '16px' }}>
            Point your camera at a NanePay QR code to pay
          </p>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', color: '#8888AA', fontSize: '13px', marginBottom: '8px' }}>
              Or enter QR ID manually
            </label>
            <input type="text" placeholder="e.g. A3F9B2C8D4E6" style={inputStyle} />
          </div>
          <button style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #00D4AA, #00F5C3)',
            border: 'none', color: '#fff', fontSize: '15px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
          }}>Look Up QR Code</button>
        </div>
      )}
    </div>
  )
}
