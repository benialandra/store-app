// Tipe data yang sinkron dengan skema database Supabase
export interface Product {
  id: string
  title: string
  slug: string
  description: string
  long_description?: string
  price: number
  cover_image_url: string
  preview_url?: string
  gdrive_link?: string // hanya terekspos di server-side
  category: string
  tech: string
  views: number
  sales: number
  is_published: boolean
  created_at: string
}

export interface Order {
  id: string
  order_code: string // Kode Akses Rahasia (dikirim ke pembeli)
  customer_email: string
  product_id: string
  amount: number
  status: 'pending' | 'success' | 'failed' | 'expired'
  created_at: string
  // Relasi
  products?: Pick<Product, 'title' | 'price' | 'cover_image_url'>
}

export interface DownloadToken {
  token_id: string
  order_id: string
  is_used: boolean
  expires_at: string
  created_at: string
  // Relasi
  orders?: Order & { products?: Pick<Product, 'gdrive_link' | 'title'> }
}

// Tipe untuk produk yang ditampilkan di frontend (tanpa gdrive_link)
export type PublicProduct = Omit<Product, 'gdrive_link'>
