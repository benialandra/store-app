import { z } from 'zod'

export const checkoutSchema = z.object({
  productId: z.string().uuid('Product ID harus berupa UUID yang valid'),
  email: z.string().email('Format email tidak valid'),
  title: z.string().min(1).max(100),
  price: z.number().int().positive('Harga harus lebih dari 0')
})

export const trackOrderSchema = z.object({
  code: z.string().min(6, 'Kode Akses minimal 6 karakter').max(20)
})

export const adminProductSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter').max(100),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan strip'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter').max(500),
  long_description: z.string().max(5000).optional(),
  price: z.number().int().min(10000, 'Harga minimal Rp 10.000'),
  cover_image_url: z.string().url('URL gambar tidak valid'),
  preview_url: z.string().url('URL preview tidak valid').optional().or(z.literal('')),
  gdrive_link: z.string().url('URL Google Drive tidak valid'),
  category: z.string().min(1),
  tech: z.string().min(1),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
export type TrackOrderInput = z.infer<typeof trackOrderSchema>
export type AdminProductInput = z.infer<typeof adminProductSchema>
