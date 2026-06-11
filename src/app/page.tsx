'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import CheckoutModal from '@/components/CheckoutModal'
import { ArrowRight, Code, Shield, Zap, Eye, ShoppingCart, Search, Loader2 } from 'lucide-react'
import { FALLBACK_PRODUCTS } from '@/lib/products'
import type { PublicProduct } from '@/lib/types'

const ITEMS_PER_PAGE = 9

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<PublicProduct | null>(null)
  const [products, setProducts] = useState<PublicProduct[]>(FALLBACK_PRODUCTS)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch produk dari database
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products)
        }
        // Jika kosong atau error, tetap gunakan FALLBACK
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  // Daftar kategori unik dari data produk
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))]
    return ['All', ...cats.sort()]
  }, [products])

  // Filter + Search
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tech.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [products, searchQuery, selectedCategory])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleCategory = (cat: string) => {
    setSelectedCategory(cat)
    setCurrentPage(1)
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(100%_50%_at_50%_0%,rgba(120,115,106,0.1)_0,transparent_50%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] bg-white/50 dark:bg-black/50 backdrop-blur-sm text-sm text-[var(--muted)] mb-8 animate-fade-up">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            New templates added weekly
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 animate-fade-up">
            Ship Faster With<br />
            <span className="font-serif italic font-normal text-[var(--muted)]">Premium Code</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--muted)] mb-10 animate-fade-up leading-relaxed">
            Supercharge your workflow with high-quality, production-ready source code. One-time payment, instant secure download.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up">
            <a href="#products" className="w-full sm:w-auto px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-medium flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-xl">
              Explore Templates <ArrowRight className="w-4 h-4" />
            </a>
            <Link href="/track" className="w-full sm:w-auto px-8 py-4 border border-[var(--border)] rounded-full font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              Track My Order
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-y border-[var(--border)] bg-zinc-50 dark:bg-zinc-900/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {[
              { icon: Code, title: 'Production Ready', desc: 'Clean, well-documented code that follows industry best practices.' },
              { icon: Zap, title: 'Instant Access', desc: 'Get immediate secure download link via email after payment.' },
              { icon: Shield, title: 'One-Time Payment', desc: 'No subscriptions. Pay once and own the source code forever.' },
            ].map(f => (
              <div key={f.title} className="flex flex-col items-center md:items-start gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-[var(--border)] shadow-sm">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">{f.title}</h3>
                <p className="text-[var(--muted)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/20" id="products">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Latest Releases</h2>
            <p className="text-[var(--muted)] text-lg">Premium templates to accelerate your next project.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-12">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-[var(--foreground)] text-[var(--background)] shadow-md scale-105'
                      : 'bg-white dark:bg-zinc-800 border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
              <input
                type="text"
                placeholder="Search templates, scripts..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-[var(--border)] bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] transition-shadow shadow-sm"
              />
            </div>
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--muted)]" />
            </div>
          ) : paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map(product => (
                <div key={product.id} className="group flex flex-col rounded-3xl border border-[var(--border)] bg-white dark:bg-zinc-900/80 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--muted)]">
                  <Link href={`/product/${product.slug}`} className="overflow-hidden">
                    <div
                      className="aspect-[16/10] w-full bg-cover bg-center border-b border-[var(--border)] group-hover:scale-105 transition-transform duration-700"
                      style={{ backgroundImage: `url(${product.cover_image_url})` }}
                    />
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="text-xl font-bold tracking-tight hover:underline">{product.title}</h3>
                    </Link>
                    <p className="text-[var(--muted)] text-sm mb-6 mt-2 line-clamp-2 leading-relaxed flex-1">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center text-xs text-[var(--muted)] mb-6 font-medium">
                      <span className="inline-flex items-center rounded-md border border-[var(--border)] px-2 py-1 bg-zinc-50 dark:bg-zinc-800">{product.tech}</span>
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1.5" title="Views">
                          <Eye className="w-3.5 h-3.5" /> {product.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500" title="Sales">
                          <ShoppingCart className="w-3.5 h-3.5" /> {product.sales.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-5 border-t border-[var(--border)] mt-auto">
                      <span className="text-xl font-semibold">Rp {product.price.toLocaleString('id-ID')}</span>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="px-5 py-2.5 bg-[var(--foreground)] text-[var(--background)] rounded-xl text-sm font-medium hover:scale-105 transition-transform shadow-md"
                      >
                        Purchase
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-[var(--muted)]">Tidak ada produk yang cocok dengan pencarian Anda.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All') }}
                className="mt-4 px-6 py-2 border border-[var(--border)] rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-16">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-[var(--border)] rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? 'bg-[var(--foreground)] text-[var(--background)] shadow-md'
                      : 'border border-[var(--border)] hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-[var(--border)] rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <CheckoutModal
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </main>
  )
}
