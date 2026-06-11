import Link from 'next/link'

export default function Home() {
  return (
    <main className="container page-transition-enter page-transition-enter-active" style={{ paddingTop: '10vh' }}>
      <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Exclusive Digital Art
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Discover curated digital artworks for your creative projects, directly from the artist.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
        {/* Mock Product Card */}
        <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '8px', transition: 'all 0.3s ease' }}>
          <div style={{ backgroundColor: 'var(--accent)', aspectRatio: '4/3', borderRadius: '4px', marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Ethereal Landscape</h3>
          <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>High-res digital download (4K)</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
            <span style={{ fontWeight: '500', fontSize: '1.25rem' }}>Rp 150.000</span>
            <button className="btn-primary">Add to Cart</button>
          </div>
        </div>
        
        {/* Mock Product Card 2 */}
        <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '8px', transition: 'all 0.3s ease' }}>
          <div style={{ backgroundColor: 'var(--accent-dark)', aspectRatio: '4/3', borderRadius: '4px', marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Midnight Symphony</h3>
          <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>High-res digital download (8K)</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
            <span style={{ fontWeight: '500', fontSize: '1.25rem' }}>Rp 250.000</span>
            <button className="btn-primary">Add to Cart</button>
          </div>
        </div>
      </section>
    </main>
  )
}
