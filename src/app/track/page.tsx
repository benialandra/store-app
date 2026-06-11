'use client'

import { Search, Lock, Package, Clock, CheckCircle, XCircle, Download, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface OrderResult {
  order_code: string
  email: string
  product: { title: string; cover_image_url: string; price: number }
  amount: number
  status: 'pending' | 'success' | 'failed' | 'expired'
  created_at: string
  download_available: boolean
  download_expired: boolean
}

const statusConfig = {
  pending: { label: 'Menunggu Pembayaran', icon: Clock, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-500/20' },
  success: { label: 'Berhasil', icon: CheckCircle, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-500/20' },
  failed: { label: 'Gagal', icon: XCircle, color: 'text-red-600 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-500/20' },
  expired: { label: 'Kedaluwarsa', icon: XCircle, color: 'text-zinc-500 bg-zinc-100 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-500/20' },
}

export default function TrackOrder() {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [order, setOrder] = useState<OrderResult | null>(null)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setOrder(null)

    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Terjadi kesalahan.')
      } else {
        setOrder(data)
      }
    } catch {
      setError('Gagal menghubungi server.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Lacak Pesanan</h1>
          <p className="text-[var(--muted)] text-lg">
            Masukkan <strong>Kode Akses</strong> yang Anda terima setelah pembayaran berhasil.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-zinc-900/50 border border-[var(--border)] rounded-3xl p-8 md:p-10 shadow-xl">
          <form onSubmit={handleTrack} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Kode Akses Pesanan</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DS-A1B2C3"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-[var(--border)] bg-zinc-50 dark:bg-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] transition-shadow font-mono tracking-wider"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-medium hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-70 disabled:hover:scale-100 flex justify-center"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Cek Pesanan'}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-700 dark:text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Order Result */}
        {order && (
          <div className="mt-8 bg-white dark:bg-zinc-900/50 border border-[var(--border)] rounded-3xl p-8 shadow-xl">
            {/* Status Badge */}
            {(() => {
              const cfg = statusConfig[order.status]
              const Icon = cfg.icon
              return (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${cfg.color} mb-6`}>
                  <Icon className="w-4 h-4" />
                  {cfg.label}
                </div>
              )
            })()}

            {/* Product Info */}
            <div className="flex items-center gap-4 mb-6">
              {order.product?.cover_image_url && (
                <div
                  className="w-16 h-16 rounded-xl bg-cover bg-center border border-[var(--border)] shrink-0"
                  style={{ backgroundImage: `url(${order.product.cover_image_url})` }}
                />
              )}
              <div>
                <h3 className="font-bold text-lg">{order.product?.title || 'Produk'}</h3>
                <p className="text-[var(--muted)] text-sm">Rp {order.amount.toLocaleString('id-ID')}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm border-t border-[var(--border)] pt-6">
              <div className="flex justify-between"><span className="text-[var(--muted)]">Kode Akses</span><span className="font-mono font-bold">{order.order_code}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Email</span><span>{order.email}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Tanggal</span><span>{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
            </div>

            {/* Download Button */}
            {order.status === 'success' && order.download_available && (
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <p className="text-sm text-green-600 dark:text-green-500 mb-3 font-medium">✅ Link download Anda masih aktif. Cek email Anda atau klik tombol di bawah.</p>
              </div>
            )}

            {order.status === 'success' && order.download_expired && (
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <p className="text-sm text-amber-600 dark:text-amber-500 mb-3">⚠️ Link download Anda sudah kedaluwarsa atau sudah digunakan. Hubungi admin untuk mendapatkan link baru.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
