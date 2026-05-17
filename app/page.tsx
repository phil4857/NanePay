'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-pattern">
      {/* Navbar */}
      <nav style={{ background: '#161210', borderBottom: '1px solid #2a211a' }}
        className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #c8602a, #d4a853)' }}>N</div>
          <span className="font-display font-bold text-lg">NanePay</span>
        </div>
        <div className="flex gap-3">
          <Link href="/auth/login"
            className="px-5 py-2 rounded-xl text-sm border text-soft transition-all hover:text-white"
            style={{ border: '1px solid #2a211a' }}>Login</Link>
          <Link href="/auth/register"
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #c8602a, #d4a853)' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-8 py-24 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full text-sm mb-6"
          style={{ background: 'rgba(200,96,42,0.12)', border: '1px solid rgba(200,96,42,0.3)', color: '#c8602a' }}>
          🌍 Built for East Africa
        </div>

        <h1 className="font-display font-extrabold text-6xl leading-tight mb-6 tracking-tight">
          Money that{' '}
          <span className="text-gradient">moves with you.</span>
        </h1>

        <p className="text-soft text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Send, receive, invest and exchange money across East Africa.
          M-Pesa integrated. 1% flat fee. Built for everyone.
        </p>

        <div className="flex gap-4 justify-center mb-20">
          <Link href="/auth/register"
            className="px-8 py-4 rounded-xl font-semibold text-white text-lg hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #c8602a, #d4a853)' }}>
            Open Free Account
          </Link>
          <Link href="/auth/login"
            className="px-8 py-4 rounded-xl text-soft text-lg hover:text-white transition-all"
            style={{ border: '1px solid #2a211a' }}>
            Sign In →
          </Link>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: '📱', title: 'M-Pesa Connected', desc: 'Deposit and withdraw directly from your M-Pesa in seconds.' },
            { icon: '⚡', title: 'Instant Transfers', desc: 'Send money to any NanePay user with just their phone number.' },
            { icon: '📈', title: 'Earn While You Save', desc: 'Invest your balance and earn up to 12.5% APY.' },
            { icon: '💱', title: 'Forex Exchange', desc: 'Buy and sell USD, GBP, EUR at competitive rates.' },
            { icon: '🏪', title: 'Merchant Payments', desc: 'Accept payments with a simple payment link. 0.8% fee.' },
            { icon: '🔒', title: 'Bank-Grade Security', desc: 'JWT auth, bcrypt passwords, rate limiting, audit logs.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="rounded-2xl p-6 text-left"
              style={{ background: '#161210', border: '1px solid #2a211a' }}>
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-display font-bold text-base mb-2">{title}</h3>
              <p className="text-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-16 mt-16">
          {[['1%', 'Flat transfer fee'], ['0.8%', 'Merchant fee'], ['12.5%', 'Max APY'], ['2%', 'Forex spread']].map(([v, l]) => (
            <div key={l}>
              <div className="font-display font-bold text-3xl text-gradient">{v}</div>
              <div className="text-muted text-sm mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
