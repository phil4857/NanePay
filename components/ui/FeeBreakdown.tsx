interface Props {
  amount: number
  feeRate?: number
  label?: string
  creditLabel?: string
}

export default function FeeBreakdown({
  amount,
  feeRate = 0.01,
  label = 'Amount',
  creditLabel,
}: Props) {
  if (!amount || amount <= 0) return null

  const fee = parseFloat((amount * feeRate).toFixed(2))
  const total = parseFloat((amount + fee).toFixed(2))
  const net = parseFloat((amount - fee).toFixed(2))

  return (
    <div
      style={{
        background: '#1A1A26',
        border: '1px solid #2A2A3E',
        borderRadius: 12,
        padding: '12px 16px',
        fontSize: 13,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <span style={{ color: '#8888AA' }}>{label}</span>

        <span style={{ color: '#F0F0FF' }}>
          KES{' '}
          {amount.toLocaleString('en-KE', {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <span style={{ color: '#8888AA' }}>
          Platform fee ({(feeRate * 100).toFixed(0)}%)
        </span>

        <span style={{ color: '#FF6B35' }}>
          KES {fee.toFixed(2)}
        </span>
      </div>

      <div
        style={{
          borderTop: '1px solid #2A2A3E',
          paddingTop: 8,
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 700,
        }}
      >
        <span style={{ color: '#F0F0FF' }}>
          {creditLabel ? creditLabel : 'Total charged'}
        </span>

        <span style={{ color: creditLabel ? '#00D4AA' : '#F0F0FF' }}>
          KES{' '}
          {(creditLabel ? net : total).toLocaleString('en-KE', {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  )
}
