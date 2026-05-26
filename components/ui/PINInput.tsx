'use client'

import { useRef, useState } from 'react'

interface Props {
  onComplete: (pin: string) => void
  disabled?: boolean
  label?: string
}

export default function PINInput({ onComplete, disabled, label }: Props) {
  const [pin, setPin] = useState(['', '', '', ''])

  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const handle = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return

    const np = [...pin]
    np[i] = val
    setPin(np)

    if (val && i < 3) refs[i + 1].current?.focus()

    if (np.every(d => d) && np.join('').length === 4) {
      onComplete(np.join(''))
    }
  }

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[i] && i > 0) {
      refs[i - 1].current?.focus()
    }
  }

  return (
    <div>
      {label && (
        <p
          style={{
            color: '#8888AA',
            fontSize: 13,
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          {label}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
        }}
      >
        {pin.map((d, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="password"
            maxLength={1}
            value={d}
            disabled={disabled}
            onChange={(e) => handle(i, e.target.value)}
            onKeyDown={(e) => handleKey(i, e)}
            style={{
              width: 54,
              height: 54,
              textAlign: 'center',
              fontSize: 22,
              fontWeight: 700,
              borderRadius: 14,
              outline: 'none',
              background: '#1A1A26',
              border: `2px solid ${d ? '#6C63FF' : '#2A2A3E'}`,
              color: '#F0F0FF',
              transition: 'border 0.2s',
              boxShadow: d
                ? '0 0 0 3px rgba(108,99,255,0.15)'
                : 'none',
            }}
          />
        ))}
      </div>
    </div>
  )
}
