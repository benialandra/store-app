'use client'

import Link from 'next/link'
import { ShoppingBag, Search, Menu, Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from '@/context/ThemeProvider'
import { useLanguage } from '@/context/LanguageProvider'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { locale, toggleLocale, t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tighter text-xl">
            <div className="bg-[var(--brand)] text-[var(--brand-foreground)] p-1.5 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span>benialandra</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-[var(--muted)]">
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">{t('nav.marketplace')}</Link>
            <Link href="/track" className="hover:text-[var(--foreground)] transition-colors">{t('nav.track')}</Link>
            <Link href="/history" className="hover:text-[var(--foreground)] transition-colors">{t('nav.library')}</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={toggleLocale}
            className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1"
            title="Toggle Language"
          >
            <Globe className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">{locale}</span>
          </button>
          
          <button 
            onClick={toggleTheme}
            className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <Link href="/history" className="hidden md:flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full border border-[var(--border)] hover:bg-[var(--border)] transition-colors">
            {t('nav.access_library')}
          </Link>
          <button className="md:hidden p-2 text-[var(--foreground)]">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
