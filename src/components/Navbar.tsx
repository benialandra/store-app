import Link from 'next/link'
import { ShoppingBag, Search, Menu } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tighter text-xl">
            <div className="bg-[var(--brand)] text-[var(--brand-foreground)] p-1.5 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span>DevStore</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-[var(--muted)]">
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Marketplace</Link>
            <Link href="/track" className="hover:text-[var(--foreground)] transition-colors">Track Order</Link>
            <Link href="/history" className="hover:text-[var(--foreground)] transition-colors">My Library</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors hidden md:block">
            <Search className="w-5 h-5" />
          </button>
          <Link href="/history" className="hidden md:flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full border border-[var(--border)] hover:bg-[var(--border)] transition-colors">
            Access Library
          </Link>
          <button className="md:hidden p-2 text-[var(--foreground)]">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
