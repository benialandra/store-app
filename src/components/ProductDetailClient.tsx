'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, ShoppingCart, ExternalLink } from 'lucide-react'
import CheckoutModal from '@/components/CheckoutModal'
import type { PublicProduct } from '@/lib/types'
import { useLanguage } from '@/context/LanguageProvider'

export default function ProductDetailClient({ product }: { product: PublicProduct }) {
  const [showCheckout, setShowCheckout] = useState(false)
  const { t } = useLanguage()

  return (
    <main className="min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Back */}
        <Link href="/#products" className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-10 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> {t('detail.back')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Image */}
          <div className="lg:col-span-3">
            <div
              className="aspect-[16/10] w-full rounded-3xl bg-cover bg-center border border-[var(--border)] shadow-lg"
              style={{ backgroundImage: `url(${product.cover_image_url})` }}
            />
          </div>

          {/* Info */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 text-xs font-medium rounded-full border border-[var(--border)] bg-zinc-50 dark:bg-zinc-800">{product.category}</span>
              <span className="px-3 py-1 text-xs font-medium rounded-full border border-[var(--border)] bg-zinc-50 dark:bg-zinc-800">{product.tech}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{product.title}</h1>
            <p className="text-[var(--muted)] leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center gap-6 text-sm text-[var(--muted)] font-medium mb-8">
              <span className="flex items-center gap-2"><Eye className="w-4 h-4" /> {product.views.toLocaleString()} {t('products.views')}</span>
              <span className="flex items-center gap-2 text-amber-600 dark:text-amber-500"><ShoppingCart className="w-4 h-4" /> {product.sales.toLocaleString()} {t('products.sold')}</span>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--border)] bg-zinc-50 dark:bg-zinc-900/50 mb-6">
              <p className="text-sm text-[var(--muted)] mb-1">{t('detail.price')}</p>
              <p className="text-3xl font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
              <p className="text-sm text-[var(--muted)] mt-1">{t('detail.onetime')}</p>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-medium hover:scale-[1.02] transition-transform shadow-lg text-lg"
            >
              {t('detail.buy')}
            </button>

            {product.preview_url && (
              <a
                href={product.preview_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 mt-3 border border-[var(--border)] rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-center flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" /> {t('detail.live_preview')}
              </a>
            )}
          </div>
        </div>

        {/* Long Description */}
        {product.long_description && (
          <div className="mt-16 pt-16 border-t border-[var(--border)]">
            <h2 className="text-2xl font-bold mb-6">{t('detail.about')}</h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-[var(--muted)] leading-relaxed whitespace-pre-line">
              {product.long_description}
            </div>
          </div>
        )}
      </div>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        product={product}
      />
    </main>
  )
}
