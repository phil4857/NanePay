// app/page.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Wifi,
  Shield,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Menu,
  X,
  TrendingUp,
  Globe,
  Smartphone,
  CreditCard,
  BarChart3,
  Lock,
  ChevronRight,
  DollarSign,
  Building2,
  LineChart,
  Repeat,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { href: '#features', label: 'Features' },
    { href: '#packages', label: 'Packages' },
    { href: '#merchants', label: 'Merchants' },
    { href: '#pricing', label: 'Pricing' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-dark/95 backdrop-blur-md border-b border-brand-border shadow-card'
          : 'bg-transparent'
      }`}
    >
      <div className="container-xl">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>

            <span className="font-display font-bold text-xl text-white">
              Nane<span className="gradient-text">Pay</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="btn-ghost text-sm"
            >
              Sign In
            </Link>

            <Link
              href="/auth/register"
              className="btn-primary text-sm py-2 px-5"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {open ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-brand-card border-t border-brand-border animate-fade-in">
          <div className="container-xl py-4 flex flex-col gap-1">

            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg font-medium transition-all"
              >
                {link.label}
              </a>
            ))}

            <div className="divider my-2" />

            <Link
              href="/auth/login"
              className="btn-ghost w-full text-center"
            >
              Sign In
            </Link>

            <Link
              href="/auth/register"
              className="btn-primary w-full text-center mt-1"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

// ─────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">

      {/* Glow */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-brand-green/5 blur-3xl pointer-events-none" />

      <div className="container-xl relative">

        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-green/10 border border-brand-green/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse-slow" />
            <span className="text-brand-green text-sm font-medium">
              Built for East Africa • M-Pesa Integrated
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
            Payments & Internet
            <br />
            <span className="gradient-text">
              Made Simple
            </span>
          </h1>

          {/* Subtitle */}
          <p className="section-subtitle max-w-3xl mx-auto mb-10 animate-slide-up">
            Send, receive, invest, exchange money, buy internet packages,
            manage subscriptions, and automate merchant billing —
            all in one fintech platform powered by M-Pesa.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link
              href="/auth/register"
              className="btn-primary flex items-center gap-2 text-base px-8 py-3.5 w-full sm:w-auto justify-center"
            >
              Open Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#features"
              className="btn-secondary flex items-center gap-2 text-base px-8 py-3.5 w-full sm:w-auto justify-center"
            >
              Explore Features
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-brand-muted animate-fade-in">
            {[
              '1% flat transfer fee',
              '0.8% merchant fee',
              'Instant M-Pesa payments',
              'Bank-grade security',
            ].map(item => (
              <span
                key={item}
                className="flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4 text-brand-green" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">

          {[
            {
              label: 'Active Users',
              value: '10K+',
              icon: Users,
            },
            {
              label: 'Transactions',
              value: '500K+',
              icon: TrendingUp,
            },
            {
              label: 'Merchants',
              value: '1,200+',
              icon: Globe,
            },
            {
              label: 'Uptime',
              value: '99.9%',
              icon: Shield,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="card p-5 text-center hover:border-brand-green/20 transition-all duration-300"
            >
              <Icon className="w-5 h-5 text-brand-green mx-auto mb-2" />

              <div className="font-display text-2xl font-bold text-white">
                {value}
              </div>

              <div className="text-brand-muted text-sm mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Features
// ─────────────────────────────────────────────────────────────
function Features() {

  const features = [
    {
      icon: CreditCard,
      title: 'M-Pesa Payments',
      desc: 'Deposit, withdraw, send and receive money instantly through M-Pesa STK Push.',
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      icon: Repeat,
      title: 'Instant Transfers',
      desc: 'Transfer funds between users instantly using phone numbers only.',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      icon: Wifi,
      title: 'Internet Packages',
      desc: 'Buy hourly, daily, weekly, midnight and monthly hotspot subscriptions instantly.',
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
    },
    {
      icon: Building2,
      title: 'Merchant Payments',
      desc: 'Accept customer payments via payment links with only 0.8% merchant fee.',
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
    {
      icon: Globe,
      title: 'Merchant Dashboard',
      desc: 'Manage packages, subscribers, sessions, withdrawals and earnings in real time.',
      color: 'text-orange-400',
      bg: 'bg-orange-400/10',
    },
    {
      icon: Smartphone,
      title: 'Device Management',
      desc: 'Control device limits, bandwidth profiles and active internet sessions.',
      color: 'text-pink-400',
      bg: 'bg-pink-400/10',
    },
    {
      icon: LineChart,
      title: 'Investments & Savings',
      desc: 'Invest wallet balances and earn up to 12.5% APY directly in-app.',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
    {
      icon: DollarSign,
      title: 'Forex Exchange',
      desc: 'Buy and sell USD, GBP and EUR at competitive exchange rates.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      icon: BarChart3,
      title: 'Live Analytics',
      desc: 'Track transactions, revenue, subscribers and bandwidth usage live.',
      color: 'text-red-400',
      bg: 'bg-red-400/10',
    },
    {
      icon: Lock,
      title: 'Bank-grade Security',
      desc: 'JWT auth, bcrypt encryption, rate limiting, SQL protection and audit logs.',
      color: 'text-indigo-400',
      bg: 'bg-indigo-400/10',
    },
  ]

  return (
    <section
      id="features"
      className="py-20 md:py-28"
    >
      <div className="container-xl">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="badge-green mb-4">
            ✦ Features
          </div>

          <h2 className="section-title mb-4">
            Everything in one platform
          </h2>

          <p className="section-subtitle">
            NanePay combines fintech, internet billing,
            investments and merchant tools into one modern ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {features.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="card-hover p-6 group"
            >
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>

              <h3 className="font-semibold text-white text-lg mb-2">
                {title}
              </h3>

              <p className="text-brand-muted text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Packages
// ─────────────────────────────────────────────────────────────
function Packages() {

  const plans = [
    {
      name: 'Hourly',
      price: '10',
      duration: '1 Hour',
      speed: '5 Mbps',
      devices: 1,
      popular: false,
    },
    {
      name: 'Daily',
      price: '50',
      duration: '24 Hours',
      speed: '10 Mbps',
      devices: 2,
      popular: true,
    },
    {
      name: 'Midnight',
      price: '30',
      duration: '12AM - 6AM',
      speed: '15 Mbps',
      devices: 2,
      popular: false,
    },
    {
      name: 'Weekly',
      price: '200',
      duration: '7 Days',
      speed: '20 Mbps',
      devices: 3,
      popular: false,
    },
    {
      name: 'Monthly',
      price: '600',
      duration: '30 Days',
      speed: '50 Mbps',
      devices: 5,
      popular: false,
    },
  ]

  return (
    <section
      id="packages"
      className="py-20 md:py-28 bg-gradient-to-b from-transparent via-brand-card/20 to-transparent"
    >
      <div className="container-xl">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="badge-green mb-4">
            ✦ Internet Packages
          </div>

          <h2 className="section-title mb-4">
            Flexible plans for everyone
          </h2>

          <p className="section-subtitle">
            Buy hotspot access instantly using M-Pesa with automatic activation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

          {plans.map(plan => (
            <div
              key={plan.name}
              className={`relative card p-6 flex flex-col gap-4 transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? 'border-brand-green shadow-glow-green'
                  : 'hover:border-brand-green/30'
              }`}
            >

              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-brand text-white text-xs font-bold px-3 py-1 rounded-full shadow-glow-sm">
                    POPULAR
                  </span>
                </div>
              )}

              <div>
                <div className="text-brand-muted text-sm font-medium mb-1">
                  {plan.name}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold text-white">
                    KSh {plan.price}
                  </span>
                </div>

                <div className="text-brand-muted text-xs mt-1">
                  {plan.duration}
                </div>
              </div>

              <div className="divider" />

              <ul className="flex flex-col gap-2.5 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                  {plan.speed} speed
                </li>

                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                  {plan.devices} device{plan.devices > 1 ? 's' : ''}
                </li>

                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                  Instant activation
                </li>

                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                  M-Pesa payment
                </li>
              </ul>

              <Link
                href="/auth/register"
                className={`mt-auto text-center font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-200 ${
                  plan.popular
                    ? 'bg-brand-green hover:bg-primary-600 text-white shadow-glow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-brand-border hover:border-brand-green/40'
                }`}
              >
                Buy Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Merchants
// ─────────────────────────────────────────────────────────────
function Merchants() {

  const benefits = [
    'Automated M-Pesa billing system',
    'Hotspot & ISP management dashboard',
    'Automatic withdrawals with 1% fee',
    'Real-time analytics and reporting',
    'MikroTik & Radius server integration',
    'Custom branding for your business',
    'Session & bandwidth management',
    'Instant merchant payouts',
  ]

  return (
    <section
      id="merchants"
      className="py-20 md:py-28"
    >
      <div className="container-xl">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div>

            <div className="badge-green mb-4">
              ✦ For Merchants & ISPs
            </div>

            <h2 className="section-title mb-4">
              Scale your internet business
            </h2>

            <p className="section-subtitle mb-8">
              NanePay helps hotspot operators, cybercafés and ISPs automate
              subscriptions, payments and customer management.
            </p>

            <ul className="flex flex-col gap-3 mb-10">

              {benefits.map(item => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-gray-300"
                >
                  <CheckCircle className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/auth/register?type=merchant"
              className="btn-primary inline-flex items-center gap-2"
            >
              Apply as Merchant
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative">

            <div className="absolute inset-0 bg-brand-green/10 blur-3xl rounded-full" />

            <div className="relative card p-6 animate-float">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="font-display font-bold text-white text-lg">
                    Merchant Dashboard
                  </div>

                  <div className="text-brand-muted text-sm">
                    Nairobi Hotspot Network
                  </div>
                </div>

                <div className="badge-green">
                  Active
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">

                {[
                  ['Monthly Revenue', 'KSh 48,200'],
                  ['Active Subs', '143'],
                  ['Total Users', '1,842'],
                  ['Avg Session', '2h 14m'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="bg-brand-dark rounded-xl p-3"
                  >
                    <div className="text-brand-muted text-xs mb-1">
                      {label}
                    </div>

                    <div className="font-semibold text-white">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  'Hourly · KSh 10',
                  'Daily · KSh 50',
                  'Midnight · KSh 30',
                  'Monthly · KSh 600',
                ].map(item => (
                  <span
                    key={item}
                    className="text-xs bg-brand-green/10 text-brand-green border border-brand-green/20 px-2.5 py-1 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────
function Testimonials() {

  const reviews = [
    {
      name: 'James Otieno',
      role: 'Hotspot Operator, Kisumu',
      text: 'NanePay automated my billing completely. Customers pay and internet activates instantly.',
    },
    {
      name: 'Amina Hassan',
      role: 'Cybercafé Owner, Mombasa',
      text: 'The dashboard is powerful and simple. I can track earnings and users live.',
    },
    {
      name: 'Kevin Mwangi',
      role: 'Regular User, Nairobi',
      text: 'Buying internet and sending money is extremely fast. Everything works in seconds.',
    },
  ]

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-transparent via-brand-card/20 to-transparent">
      <div className="container-xl">

        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="badge-green mb-4">
            ✦ Testimonials
          </div>

          <h2 className="section-title mb-4">
            Trusted across East Africa
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">

          {reviews.map(review => (
            <div
              key={review.name}
              className="card p-6 flex flex-col gap-4"
            >

              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                "{review.text}"
              </p>

              <div className="mt-auto">
                <div className="font-semibold text-white text-sm">
                  {review.name}
                </div>

                <div className="text-brand-muted text-xs">
                  {review.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// CTA
// ─────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-20 md:py-28">

      <div className="container-xl">

        <div className="relative card overflow-hidden p-10 md:p-16 text-center">

          <div className="absolute inset-0 bg-gradient-to-br from-brand-green/10 via-transparent to-primary-800/10" />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-brand rounded-full" />

          <div className="relative">

            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to start with NanePay?
            </h2>

            <p className="section-subtitle max-w-2xl mx-auto mb-10">
              Join thousands of users, merchants and hotspot providers already using NanePay every day.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

              <Link
                href="/auth/register"
                className="btn-primary flex items-center gap-2 text-base px-10 py-4 w-full sm:w-auto justify-center"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/auth/register?type=merchant"
                className="btn-secondary flex items-center gap-2 text-base px-10 py-4 w-full sm:w-auto justify-center"
              >
                Join as Merchant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────
function Footer() {

  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-brand-border py-12">

      <div className="container-xl">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

          <div className="col-span-2 md:col-span-1">

            <Link
              href="/"
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>

              <span className="font-display font-bold text-white">
                Nane<span className="gradient-text">Pay</span>
              </span>
            </Link>

            <p className="text-brand-muted text-sm leading-relaxed">
              Fast, secure fintech and internet billing platform for East Africa.
            </p>
          </div>

          {[
            {
              title: 'Product',
              links: ['Features', 'Packages', 'Merchants', 'Pricing'],
            },
            {
              title: 'Company',
              links: ['About', 'Blog', 'Careers', 'Contact'],
            },
            {
              title: 'Legal',
              links: ['Privacy Policy', 'Terms of Service', 'Compliance', 'Licenses'],
            },
          ].map(section => (
            <div key={section.title}>

              <div className="font-semibold text-white text-sm mb-4">
                {section.title}
              </div>

              <ul className="flex flex-col gap-2.5">

                {section.links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-brand-muted hover:text-white text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-brand-muted">
          <span>© {year} NanePay. All rights reserved.</span>
          <span>Built with ❤️ for East Africa</span>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="page-wrapper bg-pattern">
      <Navbar />
      <Hero />
      <Features />
      <Packages />
      <Merchants />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}
