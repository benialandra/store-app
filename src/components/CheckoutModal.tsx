'use client'

import { useState } from 'react'
import type { PublicProduct } from '@/lib/types'
import { useLanguage } from '@/context/LanguageProvider'

export default function CheckoutModal({
  isOpen,
  onClose,
  product
}: {
  isOpen: boolean
  onClose: () => void
  product: PublicProduct | null
}) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'processing' | 'success' | 'error'>('form')
  const [orderCode, setOrderCode] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const { t } = useLanguage()

  if (!isOpen || !product) return null

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStep('processing')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          email,
          title: product.title,
          price: product.price
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Terjadi kesalahan.')
        setStep('error')
        setIsLoading(false)
        return
      }

      if (data.token && typeof window !== 'undefined' && (window as any).snap) {
        // Midtrans Snap tersedia → buka popup pembayaran
        setOrderCode(data.order_code)
        ;(window as any).snap.pay(data.token, {
          onSuccess: () => {
            setStep('success')
            setIsLoading(false)
          },
          onPending: () => {
            setStep('success')
            setIsLoading(false)
          },
          onError: () => {
            setErrorMsg('Pembayaran gagal. Silakan coba lagi.')
            setStep('error')
            setIsLoading(false)
          },
          onClose: () => {
            // User menutup popup tanpa bayar
            setStep('form')
            setIsLoading(false)
          }
        })
      } else if (data.redirect_url) {
        // Fallback: redirect ke halaman Midtrans
        setOrderCode(data.order_code)
        window.location.href = data.redirect_url
      } else {
        // Midtrans belum dikonfigurasi → simulasi sukses
        setOrderCode(data.order_code || 'DS-DEMO01')
        setStep('success')
        setIsLoading(false)
      }
    } catch {
      setErrorMsg('Gagal menghubungi server. Pastikan koneksi internet Anda.')
      setStep('error')
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep('form')
    setEmail('')
    setErrorMsg('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[var(--background)] rounded-3xl border border-[var(--border)] shadow-2xl p-8 md:p-10">

        {/* STEP: Form */}
        {step === 'form' && (
          <>
            <button onClick={handleClose} className="absolute top-6 right-6 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-3xl leading-none">&times;</button>
            <h2 className="text-3xl font-bold tracking-tight mb-2">{t('checkout.title')}</h2>
            <p className="text-[var(--muted)] mb-8">{t('checkout.subtitle')}</p>
            <div className="p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-[var(--border)] mb-8 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-lg">{product.title}</h4>
                <p className="text-[var(--muted)] text-sm mt-1">{t('checkout.lifetime')}</p>
              </div>
              <p className="font-bold text-xl">Rp {product.price.toLocaleString('id-ID')}</p>
            </div>
            <form onSubmit={handleCheckout} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t('checkout.email_label')}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-4 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] transition-shadow"
                />
                <p className="text-sm text-[var(--muted)] mt-2">{t('checkout.email_hint')}</p>
              </div>
              <button type="submit" className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-medium hover:scale-[1.02] transition-transform shadow-lg">
                {t('checkout.proceed')}
              </button>
            </form>
          </>
        )}

        {/* STEP: Processing */}
        {step === 'processing' && (
          <div className="text-center py-10">
            <svg className="animate-spin h-12 w-12 mx-auto mb-6 text-[var(--muted)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">{t('checkout.processing')}</h2>
            <p className="text-[var(--muted)]">{t('checkout.processing_wait')}</p>
          </div>
        )}

        {/* STEP: Success */}
        {step === 'success' && (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">{t('checkout.success')}</h2>
            <p className="text-[var(--muted)] mb-8">{t('checkout.success_msg')}</p>
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-[var(--border)] mb-8 text-left">
              <p className="text-sm text-[var(--muted)] mb-1">{t('checkout.code_label')}</p>
              <div className="flex items-center justify-between">
                <p className="font-mono text-2xl font-bold tracking-wider">{orderCode}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(orderCode)}
                  className="px-4 py-2 text-sm bg-white dark:bg-zinc-800 border border-[var(--border)] rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm text-amber-600 dark:text-amber-500 mt-4 bg-amber-50 dark:bg-amber-500/10 p-3 rounded-xl border border-amber-200 dark:border-amber-500/20">
                ⚠️ {t('checkout.code_warning')}
              </p>
            </div>
            <button onClick={handleClose} className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-medium hover:scale-[1.02] transition-transform shadow-lg">
              {t('checkout.done')}
            </button>
          </div>
        )}

        {/* STEP: Error */}
        {step === 'error' && (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">{t('checkout.failed')}</h2>
            <p className="text-[var(--muted)] mb-8">{errorMsg}</p>
            <button onClick={() => setStep('form')} className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-medium hover:scale-[1.02] transition-transform shadow-lg">
              {t('checkout.retry')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
