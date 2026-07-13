import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = { title: 'Quem Somos — Mobella Móveis' }

export default function QuemSomos() {
  return (
    <>
      <Header />
      <main>
        <div className="container" style={{ padding: '72px 48px 96px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 20 }}>A Mobella</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px,5vw,72px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 48 }}>
              Quem<br /><em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, textTransform: 'none', fontSize: '1.15em' }}>somos</em>
            </h1>

            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 300, lineHeight: 1.8, color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: 24 }}>
              <p>A Mobella nasceu da crença simples de que um móvel bem feito não precisa ser caro, importado ou esperar meses para chegar.</p>
              <p>Somos uma fábrica de Curitiba, PR. Fabricamos poltronas, cadeiras e sofás com matéria-prima selecionada, costura à mão e acabamento conferido peça a peça antes de sair da nossa produção.</p>
              <p>Vendemos direto para quem vai sentar. Sem distribuidor, sem atravessador, sem depósito no interior do estado. Isso significa preço justo, prazo real e alguém para responder quando você precisar.</p>
              <p>Nosso compromisso é simples: entregar um móvel que você vai usar por anos, que vai envelhecer bem e que vai caber na sua sala — não no showroom de um shopping.</p>
            </div>

            <div style={{ marginTop: 56, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/como-fazemos" className="btn btn-dark">Como fazemos <span className="btn-arrow">→</span></Link>
              <a href="https://wa.me/5541995699860" target="_blank" rel="noopener" className="btn" style={{ border: '1px solid var(--ink)', color: 'var(--ink)' }}>Falar no WhatsApp</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
