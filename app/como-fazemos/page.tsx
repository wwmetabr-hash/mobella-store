import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = { title: 'Como Fazemos — Mobella Móveis' }

const etapas = [
  { n: '01', titulo: 'Seleção de materiais', texto: 'Escolhemos madeira certificada e tecidos testados para durabilidade e conforto. Nada passa pela nossa produção sem aprovação prévia.' },
  { n: '02', titulo: 'Estrutura e madeira', texto: 'A estrutura interna é cortada e montada aqui em Curitiba. Usamos parafusos e cola de marcenaria — sem grampos que soltam com o tempo.' },
  { n: '03', titulo: 'Espuma e enchimento', texto: 'Espuma de alta densidade em todas as peças. O assento mantém a forma por anos, não meses.' },
  { n: '04', titulo: 'Costura e revestimento', texto: 'O tecido é cortado e costurado à mão por profissionais especializados. Cada emenda é escondida, cada canto é reforçado.' },
  { n: '05', titulo: 'Revisão final', texto: 'Antes de sair da fábrica, cada peça passa por revisão de acabamento, nivelamento dos pés e teste de assento. Só aprovamos o que aprovamos para nós mesmos.' },
  { n: '06', titulo: 'Entrega em Curitiba', texto: 'Entregamos em Curitiba e região com nossa própria equipe. Sem terceiros, sem surpresas na entrega.' },
]

export default function ComoFazemos() {
  return (
    <>
      <Header />
      <main>
        <div className="container" style={{ padding: '72px 48px 96px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 20 }}>Processo</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px,5vw,72px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 64 }}>
              Como<br /><em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, textTransform: 'none', fontSize: '1.15em' }}>fazemos</em>
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
              <a href="https://wa.me/5541995699860" target="_blank" rel="noopener" className="btn" style={{ border: '1px solid var(--ink)', color: 'var(--ink)' }}>Falar no WhatsApp</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
