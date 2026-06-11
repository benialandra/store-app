import { Mail, Library } from 'lucide-react'

export default function OrderHistory() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 mb-6">
            <Library className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">My Library</h1>
          <p className="text-[var(--muted)] text-lg">
            Since we use secure Guest Checkout, simply enter your email address and we'll send you a magic link to view all your past purchases.
          </p>
        </div>
        
        <div className="bg-white dark:bg-zinc-900/50 border border-[var(--border)] rounded-3xl p-8 md:p-10 shadow-xl">
          <form className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
                <input 
                  type="email" 
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-[var(--border)] bg-zinc-50 dark:bg-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] transition-shadow"
                />
              </div>
            </div>
            <button type="button" className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-medium hover:scale-[1.02] transition-transform shadow-lg">
              Send Magic Link
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
