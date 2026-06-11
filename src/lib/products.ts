import { supabase } from './supabase'
import type { PublicProduct } from './types'

// Ambil semua produk publik (tanpa gdrive_link)
export async function getProducts(): Promise<PublicProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, title, slug, description, price, cover_image_url, preview_url, category, tech, views, sales, is_published, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

// Ambil satu produk berdasarkan slug
export async function getProductBySlug(slug: string): Promise<PublicProduct | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
    return FALLBACK_PRODUCTS.find(p => p.slug === slug) || null
  }

  const timeoutPromise = new Promise<null>((_, reject) => {
    setTimeout(() => reject(new Error('timeout')), 4500)
  })

  const fetchPromise = supabase
    .from('products')
    .select('id, title, slug, description, long_description, price, cover_image_url, preview_url, category, tech, views, sales, is_published, created_at')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  try {
    const response = await Promise.race([fetchPromise, timeoutPromise]) as { data: any, error: any }
    const { data, error } = response

    if (error || !data) return null

    // Increment view count (fire and forget)
    supabase
      .from('products')
      .update({ views: (data.views || 0) + 1 })
      .eq('slug', slug)
      .then(() => {})

    return data
  } catch (err) {
    console.warn('Fetch product timed out or failed:', err)
    return null
  }
}

// Ambil daftar kategori unik
export async function getCategories(): Promise<string[]> {
  const { data } = await supabase
    .from('products')
    .select('category')
    .eq('is_published', true)

  if (!data) return []
  const unique = [...new Set(data.map(d => d.category))]
  return unique.sort()
}

// Fallback data jika database belum disetup
export const FALLBACK_PRODUCTS: PublicProduct[] = [
  { id: '1', title: 'SaaS Dashboard UI Kit', slug: 'saas-dashboard-ui-kit', category: 'UI Kit', description: 'A complete React dashboard template with charts, tables, and auth flows.', price: 250000, tech: 'Next.js 14', views: 14500, sales: 342, cover_image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop', is_published: true, created_at: '' },
  { id: '2', title: 'E-Commerce API Backend', slug: 'ecommerce-api-backend', category: 'Backend', description: 'Robust Node.js Express REST API with Stripe integration and order management.', price: 450000, tech: 'Node.js', views: 8900, sales: 124, cover_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop', is_published: true, created_at: '' },
  { id: '3', title: 'AI Landing Page Template', slug: 'ai-landing-page-template', category: 'Frontend', description: 'High-converting landing page optimized for AI startups with Framer Motion animations.', price: 150000, tech: 'React', views: 22100, sales: 890, cover_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', is_published: true, created_at: '' },
  { id: '4', title: 'Real-time Chat App', slug: 'realtime-chat-app', category: 'Fullstack', description: 'WhatsApp clone built with Socket.io, React, and MongoDB.', price: 300000, tech: 'MERN Stack', views: 11200, sales: 210, cover_image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop', is_published: true, created_at: '' },
  { id: '5', title: 'Mobile App Wireframes', slug: 'mobile-app-wireframes', category: 'UI Kit', description: 'Over 100+ mobile app wireframe screens for Figma.', price: 90000, tech: 'Figma', views: 34000, sales: 1200, cover_image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop', is_published: true, created_at: '' },
  { id: '6', title: 'GraphQL Auth Server', slug: 'graphql-auth-server', category: 'Backend', description: 'Ready-to-use GraphQL boilerplate with JWT authentication and Prisma.', price: 200000, tech: 'GraphQL', views: 5600, sales: 89, cover_image_url: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop', is_published: true, created_at: '' },
  { id: '7', title: 'Portfolio Template', slug: 'portfolio-template-pro', category: 'Frontend', description: 'Minimalist developer portfolio with dark mode and blog MDX support.', price: 100000, tech: 'Next.js', views: 45000, sales: 2300, cover_image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop', is_published: true, created_at: '' },
  { id: '8', title: 'Admin Panel Vue 3', slug: 'admin-panel-vue3', category: 'Frontend', description: 'Vite powered Vue 3 admin template using Tailwind CSS.', price: 180000, tech: 'Vue.js', views: 8000, sales: 150, cover_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop', is_published: true, created_at: '' },
  { id: '9', title: 'Microservices Boilerplate', slug: 'microservices-boilerplate', category: 'Backend', description: 'Go and gRPC microservices architecture starter kit.', price: 500000, tech: 'Golang', views: 4200, sales: 45, cover_image_url: 'https://images.unsplash.com/photo-1607799279861-4dddf8db53ea?q=80&w=800&auto=format&fit=crop', is_published: true, created_at: '' },
  { id: '10', title: 'Kanban Board Clone', slug: 'kanban-board-clone', category: 'Fullstack', description: 'Trello-like Kanban board with drag and drop functionality.', price: 280000, tech: 'React', views: 9500, sales: 180, cover_image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=800&auto=format&fit=crop', is_published: true, created_at: '' },
  { id: '11', title: 'Crypto Dashboard App', slug: 'crypto-dashboard-app', category: 'Fullstack', description: 'Web3 wallet dashboard with wallet-connect integration.', price: 600000, tech: 'Web3.js', views: 18000, sales: 420, cover_image_url: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=800&auto=format&fit=crop', is_published: true, created_at: '' },
  { id: '12', title: 'Design System Tokens', slug: 'design-system-tokens', category: 'UI Kit', description: 'Comprehensive design tokens ready for Tailwind and CSS variables.', price: 120000, tech: 'CSS', views: 12000, sales: 500, cover_image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop', is_published: true, created_at: '' },
]
