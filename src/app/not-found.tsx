import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center py-20 px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-[var(--muted)] opacity-20 mb-4">404</p>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Halaman Tidak Ditemukan</h1>
        <p className="text-[var(--muted)] mb-8 max-w-md mx-auto">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link href="/" className="px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-medium hover:scale-105 transition-transform shadow-lg inline-block">
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  )
}
