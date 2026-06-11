import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProductDetailClient from '@/components/ProductDetailClient'
import { getProductBySlug } from '@/lib/products'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

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
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  return <ProductDetailClient product={product} />
}
