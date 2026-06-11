'use client'

import { useState } from 'react'

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  product 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  product: { title: string, price: number } | null;
}) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [orderId, setOrderId] = useState('')

  if (!isOpen || !product) return null

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulasi UI/UX tanpa memanggil backend API Midtrans untuk sekarang
    setTimeout(() => {
      setIsLoading(false)
      setOrderId('CODE-' + Math.random().toString(36).substring(2, 8).toUpperCase())
      setStep('success')
    }, 2000)
  }

  const handleClose = () => {
    setStep('form');
    setEmail('');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[var(--background)] rounded-3xl border border-[var(--border)] shadow-2xl p-8 md:p-10 animate-in slide-in-from-bottom-8 duration-300">
        
        {step === 'form' ? (
          <>
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-3xl leading-none"
            >
              &times;
            </button>
            
            <h2 className="text-3xl font-bold tracking-tight mb-2">Checkout</h2>
            <p className="text-[var(--muted)] mb-8">Secure your premium source code in one step.</p>

            <div className="p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-[var(--border)] mb-8 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-lg">{product.title}</h4>
                <p className="text-[var(--muted)] text-sm mt-1">Lifetime License</p>
              </div>
              <p className="font-bold text-xl">Rp {product.price.toLocaleString('id-ID')}</p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-4 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] transition-shadow"
                />
                <p className="text-sm text-[var(--muted)] mt-2">
                  Kode Akses unik akan dikirimkan ke email ini.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-medium hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-70 disabled:hover:scale-100 relative overflow-hidden"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-[var(--background)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses Pembayaran...
                  </span>
                ) : 'Proceed to Payment'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Pembayaran Berhasil!</h2>
            <p className="text-[var(--muted)] mb-8">
              Terima kasih atas pembelian Anda. Pesanan telah berhasil diproses.
            </p>
            
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-[var(--border)] mb-8 text-left">
              <p className="text-sm text-[var(--muted)] mb-1">Kode Akses Pesanan Anda:</p>
              <div className="flex items-center justify-between">
                <p className="font-mono text-2xl font-bold tracking-wider">{orderId}</p>
                <button 
                  onClick={() => navigator.clipboard.writeText(orderId)}
                  className="px-4 py-2 text-sm bg-white dark:bg-zinc-800 border border-[var(--border)] rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm text-amber-600 dark:text-amber-500 mt-4 bg-amber-50 dark:bg-amber-500/10 p-3 rounded-xl border border-amber-200 dark:border-amber-500/20">
                ⚠️ <strong>Simpan kode ini baik-baik!</strong> Anda membutuhkan kode ini untuk melacak pesanan dan mengunduh produk di masa mendatang.
              </p>
            </div>

            <button 
              onClick={handleClose}
              className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-medium hover:scale-[1.02] transition-transform shadow-lg"
            >
              Selesai
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
