import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = { title: 'Como Escolhemos — Mobella Móveis' }

const etapas = [
  { n: '01', titulo: 'Seleção de materiais', texto: 'Antes de qualquer coisa, testamos. Escolhemos tecidos e estruturas que provam durabilidade e conforto no uso diário. Nada entra no catálogo sem aprovação prévia.' },
  { n: '02', titulo: 'Estrutura e resistência', texto: 'Avaliamos a estrutura interna de cada peça — parafusos, reforços, densidade do enchimento. Uma poltrona bonita que não aguenta dois anos não é opção.' },
  { n: '03', titulo: 'Espuma e enchimento', texto: 'Espuma de alta densidade em todas as peças. O assento precisa manter a forma por anos, não por meses — e é isso que verificamos antes de colocar no catálogo.' },
  { n: '04', titulo: 'Acabamento e costura', texto: 'Emendas escondidas, cantos reforçados, tecido bem tensionado. Analisamos o acabamento com atenção porque é ele que define se a peça vai envelhecer bem ou não.' },
  { n: '05', titulo: 'Curadoria final', texto: 'Cada modelo passa por uma revisão completa: nivelamento dos pés, teste de assento, conferência do revestimento. Só aprovamos o que aprovamos para nós mesmos.' },
  { n: '06', titulo: 'Entrega em Curitiba', texto: 'Entregamos em Curitiba e região com nossa própria equipe. Sem terceiros, sem surpresas na entrega.' },
]

export default function ComoFazemos() {
  return (
    <>
      <Header />
      <main>
        <div className="container" style={{ padding: '72px 48px 96px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 20 }}>Nossa curadoria</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px,5vw,72px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 64 }}>
              Como<br /><em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, textTransform: 'none', fontSize: '1.15em' }}>escolhemos</em>
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {etapas.map((e, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '0 32px', paddingBottom: 48, paddingTop: i === 0 ? 0 : 48, borderTop: i === 0 ? 'none' : '1px solid rgba(27,32,37,.08)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', color: 'var(--terracotta)', paddingTop: 4 }}>{e.n}</div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>{e.titulo}</h3>
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 300, color: 'var(--muted)', lineHeight: 1.75 }}>{e.texto}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 56, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/#produtos" className="btn btn-dark">Ver a coleção <span className="btn-arrow">→</span></Link>
              <a href="https://wa.me/5541995699560" target="_blank" rel="noopener" className="btn" style={{ border: '1px solid var(--ink)', color: 'var(--ink)' }}>Falar no WhatsApp</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
