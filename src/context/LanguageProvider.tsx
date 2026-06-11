'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Locale = 'id' | 'en'

interface LanguageContextType {
  locale: Locale
  toggleLocale: () => void
  t: (key: string) => string
}

const translations: Record<Locale, Record<string, string>> = {
  id: {
    // Navbar
    'nav.marketplace': 'Marketplace',
    'nav.track': 'Lacak Pesanan',
    'nav.library': 'Library Saya',
    'nav.access_library': 'Akses Library',

    // Hero
    'hero.badge': 'Template baru setiap minggu',
    'hero.title_1': 'Kirim Lebih Cepat',
    'hero.title_2': 'Dengan Kode Premium',
    'hero.subtitle': 'Percepat workflow Anda dengan source code berkualitas tinggi dan siap produksi. Bayar sekali, unduh langsung dengan aman.',
    'hero.explore': 'Jelajahi Template',
    'hero.track': 'Lacak Pesanan Saya',

    // Features
    'feat.ready': 'Siap Produksi',
    'feat.ready_desc': 'Kode bersih dan terdokumentasi mengikuti standar industri.',
    'feat.instant': 'Akses Instan',
    'feat.instant_desc': 'Dapatkan link download aman melalui email setelah pembayaran.',
    'feat.onetime': 'Bayar Sekali',
    'feat.onetime_desc': 'Tanpa langganan. Bayar sekali, gunakan source code selamanya.',

    // Products
    'products.title': 'Rilis Terbaru',
    'products.subtitle': 'Template premium untuk mempercepat project Anda.',
    'products.search': 'Cari template, script...',
    'products.empty': 'Tidak ada produk yang cocok dengan pencarian Anda.',
    'products.reset': 'Reset Filter',
    'products.purchase': 'Beli',
    'products.preview': 'Preview',
    'products.views': 'dilihat',
    'products.sold': 'terjual',
    'products.prev': 'Sebelumnya',
    'products.next': 'Berikutnya',

    // Checkout
    'checkout.title': 'Checkout',
    'checkout.subtitle': 'Dapatkan source code premium dalam satu langkah.',
    'checkout.lifetime': 'Lisensi Seumur Hidup',
    'checkout.email_label': 'Alamat Email',
    'checkout.email_hint': 'Kode Akses & link download dikirim ke email ini.',
    'checkout.proceed': 'Lanjutkan ke Pembayaran',
    'checkout.processing': 'Memproses Pembayaran...',
    'checkout.processing_wait': 'Mohon tunggu, jangan tutup halaman ini.',
    'checkout.success': 'Pembayaran Berhasil!',
    'checkout.success_msg': 'Terima kasih! Cek email Anda untuk link download.',
    'checkout.code_label': 'Kode Akses Pesanan:',
    'checkout.code_warning': 'Simpan kode ini! Anda memerlukan kode ini untuk melacak pesanan dan mengunduh produk.',
    'checkout.done': 'Selesai',
    'checkout.failed': 'Gagal',
    'checkout.retry': 'Coba Lagi',

    // Track
    'track.title': 'Lacak Pesanan',
    'track.subtitle': 'Masukkan Kode Akses yang Anda terima setelah pembayaran berhasil.',
    'track.label': 'Kode Akses Pesanan',
    'track.submit': 'Cek Pesanan',
    'track.searching': 'Mencari...',

    // Product Detail
    'detail.back': 'Kembali ke Marketplace',
    'detail.price': 'Harga',
    'detail.onetime': 'Bayar sekali · Lisensi seumur hidup',
    'detail.buy': 'Beli Sekarang',
    'detail.live_preview': 'Live Preview',
    'detail.about': 'Tentang Template Ini',

    // Footer
    'footer.desc': 'Source code dan template UI premium untuk mempercepat workflow Anda. Bangun lebih cepat, rilis lebih awal.',
    'footer.support': 'Dukungan',
    'footer.legal': 'Legal',
    'footer.track_order': 'Lacak Pesanan',
    'footer.faq': 'FAQ',
    'footer.contact': 'Kontak',
    'footer.terms': 'Ketentuan Layanan',
    'footer.privacy': 'Kebijakan Privasi',
    'footer.refund': 'Kebijakan Pengembalian',
  },
  en: {
    // Navbar
    'nav.marketplace': 'Marketplace',
    'nav.track': 'Track Order',
    'nav.library': 'My Library',
    'nav.access_library': 'Access Library',

    // Hero
    'hero.badge': 'New templates added weekly',
    'hero.title_1': 'Ship Faster With',
    'hero.title_2': 'Premium Code',
    'hero.subtitle': 'Supercharge your workflow with high-quality, production-ready source code. One-time payment, instant secure download.',
    'hero.explore': 'Explore Templates',
    'hero.track': 'Track My Order',

    // Features
    'feat.ready': 'Production Ready',
    'feat.ready_desc': 'Clean, well-documented code that follows industry best practices.',
    'feat.instant': 'Instant Access',
    'feat.instant_desc': 'Get immediate secure download link via email after payment.',
    'feat.onetime': 'One-Time Payment',
    'feat.onetime_desc': 'No subscriptions. Pay once and own the source code forever.',

    // Products
    'products.title': 'Latest Releases',
    'products.subtitle': 'Premium templates to accelerate your next project.',
    'products.search': 'Search templates, scripts...',
    'products.empty': 'No products match your search.',
    'products.reset': 'Reset Filter',
    'products.purchase': 'Purchase',
    'products.preview': 'Preview',
    'products.views': 'views',
    'products.sold': 'sold',
    'products.prev': 'Previous',
    'products.next': 'Next',

    // Checkout
    'checkout.title': 'Checkout',
    'checkout.subtitle': 'Secure your premium source code in one step.',
    'checkout.lifetime': 'Lifetime License',
    'checkout.email_label': 'Email Address',
    'checkout.email_hint': 'Access Code & download link will be sent to this email.',
    'checkout.proceed': 'Proceed to Payment',
    'checkout.processing': 'Processing Payment...',
    'checkout.processing_wait': 'Please wait, do not close this page.',
    'checkout.success': 'Payment Successful!',
    'checkout.success_msg': 'Thank you! Check your email for the download link.',
    'checkout.code_label': 'Your Order Access Code:',
    'checkout.code_warning': 'Save this code! You need it to track your order and download the product.',
    'checkout.done': 'Done',
    'checkout.failed': 'Failed',
    'checkout.retry': 'Try Again',

    // Track
    'track.title': 'Track Order',
    'track.subtitle': 'Enter the Access Code you received after a successful payment.',
    'track.label': 'Order Access Code',
    'track.submit': 'Check Order',
    'track.searching': 'Searching...',

    // Product Detail
    'detail.back': 'Back to Marketplace',
    'detail.price': 'Price',
    'detail.onetime': 'One-time payment · Lifetime license',
    'detail.buy': 'Purchase Now',
    'detail.live_preview': 'Live Preview',
    'detail.about': 'About This Template',

    // Footer
    'footer.desc': 'Premium source code and UI templates to supercharge your workflow. Build faster, launch sooner.',
    'footer.support': 'Support',
    'footer.legal': 'Legal',
    'footer.track_order': 'Track Order',
    'footer.faq': 'FAQ',
    'footer.contact': 'Contact',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.refund': 'Refund Policy',
  }
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'id',
  toggleLocale: () => {},
  t: (key: string) => key,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('id')

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null
    if (saved) setLocale(saved)
  }, [])

  const toggleLocale = () => {
    const next = locale === 'id' ? 'en' : 'id'
    setLocale(next)
    localStorage.setItem('locale', next)
  }

  const t = (key: string): string => {
    return translations[locale][key] || key
  }

  return (
    <LanguageContext.Provider value={{ locale, toggleLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
