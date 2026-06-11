'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Save, X, ShoppingBag, Eye, DollarSign, Package, Loader2 } from 'lucide-react'

interface Product {
  id: string; title: string; slug: string; description: string; price: number
  cover_image_url: string; preview_url: string; gdrive_link: string
  category: string; tech: string; views: number; sales: number; is_published: boolean
}

const emptyProduct = {
  title: '', slug: '', description: '', price: 0,
  cover_image_url: '', preview_url: '', gdrive_link: '',
  category: 'Frontend', tech: '', is_published: true
}

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [stats, setStats] = useState({ totalProducts: 0, totalSales: 0, totalViews: 0, totalRevenue: 0 })

  // Simple password check (production → gunakan Supabase Auth)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const adminPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'benialandra2025'
    if (password === adminPw) {
      setIsAuthed(true)
      localStorage.setItem('admin_auth', 'true')
    } else {
      alert('Password salah!')
    }
  }

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') setIsAuthed(true)
  }, [])

  useEffect(() => {
    if (isAuthed) loadProducts()
  }, [isAuthed])

  const loadProducts = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      if (data.products) {
        setProducts(data.products)
        setStats({
          totalProducts: data.products.length,
          totalSales: data.products.reduce((sum: number, p: Product) => sum + p.sales, 0),
          totalViews: data.products.reduce((sum: number, p: Product) => sum + p.views, 0),
          totalRevenue: data.products.reduce((sum: number, p: Product) => sum + (p.price * p.sales), 0),
        })
      }
    } catch {}
    setIsLoading(false)
  }

  const handleSave = async () => {
    if (!editingProduct) return
    setSaveLoading(true)
    try {
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Gagal menyimpan.')
      } else {
        setEditingProduct(null)
        loadProducts()
      }
    } catch { alert('Gagal menghubungi server.') }
    setSaveLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return
    try {
      await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      loadProducts()
    } catch {}
  }

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  // Login Screen
  if (!isAuthed) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-[var(--foreground)] text-[var(--background)] mb-6">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Panel</h1>
            <p className="text-[var(--muted)]">Masukkan password untuk mengakses dashboard.</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white dark:bg-zinc-900/50 border border-[var(--border)] rounded-3xl p-8 shadow-xl space-y-6">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-4 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]" />
            <button type="submit" className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-medium hover:scale-[1.02] transition-transform shadow-lg">Masuk</button>
          </form>
        </div>
      </main>
    )
  }

  // Dashboard
  return (
    <main className="min-h-screen pt-24 pb-32 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-[var(--muted)] mt-1">Kelola produk dan pantau penjualan.</p>
          </div>
          <button onClick={() => { localStorage.removeItem('admin_auth'); setIsAuthed(false) }} className="px-4 py-2 text-sm border border-[var(--border)] rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Produk', value: stats.totalProducts, icon: Package, fmt: (v: number) => v.toString() },
            { label: 'Total Penjualan', value: stats.totalSales, icon: ShoppingBag, fmt: (v: number) => v.toLocaleString() },
            { label: 'Total Views', value: stats.totalViews, icon: Eye, fmt: (v: number) => v.toLocaleString() },
            { label: 'Total Revenue', value: stats.totalRevenue, icon: DollarSign, fmt: (v: number) => 'Rp ' + v.toLocaleString('id-ID') },
          ].map(s => (
            <div key={s.label} className="p-6 rounded-2xl border border-[var(--border)] bg-white dark:bg-zinc-900/50">
              <s.icon className="w-5 h-5 text-[var(--muted)] mb-3" />
              <p className="text-2xl font-bold">{s.fmt(s.value)}</p>
              <p className="text-sm text-[var(--muted)] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Products</h2>
          <button onClick={() => { setEditingProduct(emptyProduct); setIsNew(true) }} className="px-5 py-2.5 bg-[var(--foreground)] text-[var(--background)] rounded-xl text-sm font-medium flex items-center gap-2 hover:scale-105 transition-transform shadow-md">
            <Plus className="w-4 h-4" /> Tambah Produk
          </button>
        </div>

        {/* Edit Form */}
        {editingProduct && (
          <div className="mb-8 p-8 bg-white dark:bg-zinc-900/50 border border-[var(--border)] rounded-3xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">{isNew ? 'Tambah Produk Baru' : 'Edit Produk'}</h3>
              <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'title', label: 'Judul', type: 'text', onChange: (v: string) => setEditingProduct({ ...editingProduct, title: v, slug: generateSlug(v) }) },
                { key: 'slug', label: 'Slug (URL)', type: 'text' },
                { key: 'category', label: 'Kategori', type: 'text' },
                { key: 'tech', label: 'Tech Stack', type: 'text' },
                { key: 'price', label: 'Harga (Rp)', type: 'number' },
                { key: 'cover_image_url', label: 'Cover Image URL', type: 'url' },
                { key: 'preview_url', label: 'Preview URL (opsional)', type: 'url' },
                { key: 'gdrive_link', label: 'Google Drive Link', type: 'url' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={(editingProduct as any)[field.key] || ''}
                    onChange={e => field.onChange ? field.onChange(e.target.value) : setEditingProduct({ ...editingProduct, [field.key]: field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] text-sm"
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditingProduct(null)} className="px-6 py-2.5 border border-[var(--border)] rounded-xl text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Batal</button>
              <button onClick={handleSave} disabled={saveLoading} className="px-6 py-2.5 bg-[var(--foreground)] text-[var(--background)] rounded-xl text-sm font-medium flex items-center gap-2 hover:scale-105 transition-transform shadow-md disabled:opacity-70">
                {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--muted)]" /></div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-zinc-50 dark:bg-zinc-900/50">
                  <th className="text-left p-4 font-medium text-[var(--muted)]">Produk</th>
                  <th className="text-left p-4 font-medium text-[var(--muted)]">Kategori</th>
                  <th className="text-right p-4 font-medium text-[var(--muted)]">Harga</th>
                  <th className="text-right p-4 font-medium text-[var(--muted)]">Sales</th>
                  <th className="text-right p-4 font-medium text-[var(--muted)]">Views</th>
                  <th className="text-right p-4 font-medium text-[var(--muted)]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-[var(--border)] hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cover bg-center border border-[var(--border)] shrink-0" style={{ backgroundImage: `url(${p.cover_image_url})` }} />
                        <div>
                          <p className="font-medium">{p.title}</p>
                          <p className="text-xs text-[var(--muted)]">{p.tech}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><span className="px-2 py-1 rounded-md border border-[var(--border)] text-xs bg-zinc-50 dark:bg-zinc-800">{p.category}</span></td>
                    <td className="p-4 text-right font-medium">Rp {p.price.toLocaleString('id-ID')}</td>
                    <td className="p-4 text-right">{p.sales}</td>
                    <td className="p-4 text-right">{p.views.toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditingProduct(p); setIsNew(false) }} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
