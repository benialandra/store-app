'use client'

import { Search, Lock } from 'lucide-react'
import { useState } from 'react'

export default function TrackOrder() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate tracking
    setTimeout(() => {
      alert(`Mencari pesanan dengan kode Akses Rahasia: ${code}`);
      setIsLoading(false);
    }, 1500);
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
            Hanya pembeli yang memiliki <strong>Kode Akses Rahasia</strong> yang dapat mengecek status pesanan dan mengunduh produk.
          </p>
        </div>
        
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
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. CODE-A1B2C3"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-[var(--border)] bg-zinc-50 dark:bg-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] transition-shadow font-mono"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-medium hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-70 disabled:hover:scale-100 flex justify-center"
            >
               {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-[var(--background)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mencari...
                  </span>
                ) : 'Cek Pesanan'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
