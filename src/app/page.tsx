'use client'

import { useState } from 'react'
import Link from 'next/link'
import CheckoutModal from '@/components/CheckoutModal'
import { ArrowRight, Code, Shield, Zap, Eye, ShoppingCart } from 'lucide-react'

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<{title: string, price: number} | null>(null)

  const products = [
    {
      id: 1,
      title: 'SaaS Dashboard UI Kit',
      description: 'A complete React dashboard template with charts, tables, and auth flows.',
      price: 250000,
      tech: 'Next.js 14',
      views: 14500,
      sales: 342,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'E-Commerce API Backend',
      description: 'Robust Node.js Express REST API with Stripe integration and order management.',
      price: 450000,
      tech: 'Node.js',
      views: 8900,
      sales: 124,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'AI Landing Page Template',
      description: 'High-converting landing page optimized for AI startups with Framer Motion animations.',
      price: 150000,
      tech: 'React',
      views: 22100,
      sales: 890,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop'
    }
  ]

  return (
    <main className="min-h-screen bg-[var(--background)] selection:bg-[var(--foreground)] selection:text-[var(--background)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[var(--background)] bg-[radial-gradient(100%_50%_at_50%_0%,rgba(120,115,106,0.1)_0,transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] bg-white/50 dark:bg-black/50 backdrop-blur-sm text-sm text-[var(--muted)] mb-8 animate-fade-up">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            New templates added weekly
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 animate-fade-up delay-[100ms]">
            Ship Faster With <br />
            <span className="font-serif italic font-normal text-[var(--muted)]">Premium Code</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--muted)] mb-10 animate-fade-up delay-[200ms] leading-relaxed">
            Supercharge your workflow with high-quality, production-ready source code. One-time payment, instant secure download.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-[300ms]">
            <button className="w-full sm:w-auto px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-medium flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-xl">
              Explore Templates <ArrowRight className="w-4 h-4" />
            </button>
            <Link href="/history" className="w-full sm:w-auto px-8 py-4 border border-[var(--border)] rounded-full font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              Access My Library
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-y border-[var(--border)] bg-zinc-50 dark:bg-zinc-900/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-[var(--border)] shadow-sm">
                <Code className="w-6 h-6 text-[var(--foreground)]" />
              </div>
              <h3 className="text-xl font-semibold">Production Ready</h3>
              <p className="text-[var(--muted)] leading-relaxed">Clean, well-documented code that follows industry best practices.</p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-[var(--border)] shadow-sm">
                <Zap className="w-6 h-6 text-[var(--foreground)]" />
              </div>
              <h3 className="text-xl font-semibold">Instant Access</h3>
              <p className="text-[var(--muted)] leading-relaxed">Get immediate access to your purchased source code securely.</p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-[var(--border)] shadow-sm">
                <Shield className="w-6 h-6 text-[var(--foreground)]" />
              </div>
              <h3 className="text-xl font-semibold">One-Time Payment</h3>
              <p className="text-[var(--muted)] leading-relaxed">No recurring subscriptions. Pay once and use forever in your projects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-32" id="products">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Latest Releases</h2>
              <p className="text-[var(--muted)] text-lg">Premium templates to accelerate your next project.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group flex flex-col rounded-[2rem] border border-[var(--border)] bg-white dark:bg-zinc-900/50 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                <div className="overflow-hidden">
                  <div 
                    className="aspect-[16/10] w-full bg-cover bg-center border-b border-[var(--border)] group-hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                </div>
                <div className="p-8 lg:p-10 relative bg-white dark:bg-zinc-900/50 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold tracking-tight">{product.title}</h3>
                    <span className="inline-flex items-center rounded-full border border-[var(--border)] px-4 py-1 text-sm font-medium bg-zinc-50 dark:bg-zinc-800 whitespace-nowrap ml-4">
                      {product.tech}
                    </span>
                  </div>
                  <p className="text-[var(--muted)] text-lg mb-6 line-clamp-2 leading-relaxed flex-1">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-[var(--muted)] mb-8 font-medium">
                    <span className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[var(--foreground)] opacity-70" /> {product.views.toLocaleString()} views
                    </span>
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-[var(--foreground)] opacity-70" /> {product.sales.toLocaleString()} sold
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-8 border-t border-[var(--border)] mt-auto">
                    <span className="text-2xl font-semibold">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    <div className="flex gap-3">
                      <a href="#" className="px-6 py-3 rounded-full font-medium border border-[var(--border)] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        Preview
                      </a>
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-medium hover:scale-105 transition-transform shadow-md"
                      >
                        Purchase
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checkout Modal Overlay */}
      <CheckoutModal 
        isOpen={selectedProduct !== null} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />
    </main>
  )
}
