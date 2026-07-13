import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Política de Trocas e Devoluções — Mobella Móveis' }

export default function PoliticaDeTrocas() {
  return (
    <>
      <Header />
      <main>
        <div className="container" style={{ padding: '72px 48px 96px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 20 }}>Legal</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4vw,56px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 48 }}>
              Trocas e<br /><em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, textTransform: 'none' }}>devoluções</em>
            </h1>

            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 300, lineHeight: 1.85, color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: 32 }}>

              <section>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>Direito de arrependimento</h2>
                <p>Conforme o Art. 49 do Código de Defesa do Consumidor (Lei nº 8.078/1990), o consumidor pode desistir de compras feitas fora do estabelecimento comercial — inclusive pela internet — no prazo de <strong>7 (sete) dias corridos</strong> a contar da data de entrega do produto, sem necessidade de justificativa.</p>
                <p style={{ marginTop: 12 }}>Para exercer o direito de arrependimento, entre em contato pelos canais abaixo. O produto deve ser devolvido em perfeito estado, sem sinais de uso, com embalagem original (quando aplicável).</p>
              </section>

              <section>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>Produtos com defeito</h2>
                <p>Caso o produto apresente defeito de fabricação, o consumidor tem direito à troca, reparo ou devolução integral do valor pago, nos termos do Art. 26 do CDC:</p>
                <ul style={{ paddingLeft: 24, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li><strong>30 dias</strong> para produtos não duráveis</li>
                  <li><strong>90 dias</strong> para produtos duráveis (como móveis)</li>
                </ul>
                <p style={{ marginTop: 12 }}>O prazo conta a partir da data de entrega. Defeitos causados por mau uso, acidentes ou desgaste natural não são cobertos por esta garantia.</p>
              </section>

              <section>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>Como solicitar</h2>
                <p>Entre em contato por um dos canais abaixo, informando: número do pedido, motivo da solicitação e fotos do produto (quando aplicável).</p>
                <ul style={{ paddingLeft: 24, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li><strong>WhatsApp:</strong> <a href="https://wa.me/5541995699560" style={{ color: 'var(--terracotta)' }}>(41) 99569-9860</a></li>
                  <li><strong>E-mail:</strong> <a href="mailto:mobellabr@gmail.com" style={{ color: 'var(--terracotta)' }}>mobellabr@gmail.com</a></li>
                </ul>
                <p style={{ marginTop: 12 }}>Respondemos em até 2 dias úteis. Após análise, orientaremos sobre os próximos passos para devolução ou troca.</p>
              </section>

              <section>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>Reembolso</h2>
                <p>Após confirmação da devolução, o reembolso será processado em até <strong>10 dias úteis</strong>, pelo mesmo meio de pagamento utilizado na compra.</p>
              </section>

              <p style={{ fontSize: 13, color: 'var(--muted)', borderTop: '1px solid rgba(27,32,37,.08)', paddingTop: 24 }}>
                Última atualização: julho de 2026 · Mobella Móveis · CNPJ 67.234.688/0001-45
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
