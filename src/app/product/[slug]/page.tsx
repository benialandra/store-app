import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProductDetailClient from '@/components/ProductDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data: product } = await supabase
    .from('products')
    .select('title, description, cover_image_url')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!product) return { title: 'Product Not Found' }

  return {
    title: `${product.title} | benialandra`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.cover_image_url ? [product.cover_image_url] : [],
    }
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  const { data: product } = await supabase
    .from('products')
    .select('id, title, slug, description, long_description, price, cover_image_url, preview_url, category, tech, views, sales, is_published, created_at')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!product) notFound()

  // Increment views (fire & forget)
  supabase
    .from('products')
    .update({ views: (product.views || 0) + 1 })
    .eq('slug', slug)
    .then(() => {})

  return <ProductDetailClient product={product} />
}
