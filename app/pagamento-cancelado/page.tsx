import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Pagamento não concluído — Mobella Móveis' }

export default function PagamentoCancelado() {
  return (
    <>
      <Header />
      <main>
        <div className="container" style={{ padding: '96px 48px', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 24 }}>Pagamento não concluído</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 24 }}>
            Não foi<br /><em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, textTransform: 'none' }}>desta vez.</em>
          </h1>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 300, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 40 }}>
            O pagamento foi cancelado ou não foi concluído. Sua sacola ainda está salva — você pode tentar novamente ou nos chamar no WhatsApp.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/checkout" className="btn btn-dark">Tentar novamente <span className="btn-arrow">→</span></Link>
            <a href="https://wa.me/5541995699560" target="_blank" rel="noopener" className="btn" style={{ border: '1px solid var(--ink)', color: 'var(--ink)' }}>Falar no WhatsApp</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
