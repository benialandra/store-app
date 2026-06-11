'use client'

import { useLanguage } from '@/context/LanguageProvider'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)] py-12 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-bold text-lg mb-4">benialandra</h3>
            <p className="text-[var(--muted)] text-sm max-w-sm mx-auto md:mx-0 leading-relaxed">
              {t('footer.desc')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[var(--foreground)]">{t('footer.support')}</h4>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">{t('footer.track_order')}</a></li>
              <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">{t('footer.faq')}</a></li>
              <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">{t('footer.contact')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[var(--foreground)]">{t('footer.legal')}</h4>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">{t('footer.terms')}</a></li>
              <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">{t('footer.privacy')}</a></li>
              <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">{t('footer.refund')}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[var(--border)] text-sm text-[var(--muted)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} benialandra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
