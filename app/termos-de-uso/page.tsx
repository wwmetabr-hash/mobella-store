import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Termos de Uso — Mobella Móveis' }

export default function TermosDeUso() {
  return (
    <>
      <Header />
      <main>
        <div className="container" style={{ padding: '72px 48px 96px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 20 }}>Legal</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4vw,56px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 48 }}>
              Termos de<br /><em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, textTransform: 'none' }}>uso</em>
            </h1>

            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 300, lineHeight: 1.85, color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: 32 }}>

              <section>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>Aceitação dos termos</h2>
                <p>Ao acessar e utilizar o site <strong>mobellamoveis.com.br</strong>, você concorda com estes Termos de Uso. Se não concordar, pedimos que não utilize o site.</p>
              </section>

              <section>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>Sobre a Mobella</h2>
                <p>Mobella Móveis, CNPJ 67.234.688/0001-45, é uma empresa fabricante e varejista de móveis estofados com sede em Curitiba, PR. Vendemos diretamente ao consumidor final.</p>
              </section>

              <section>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>Produtos e preços</h2>
                <p>Os produtos exibidos no site estão sujeitos a disponibilidade de estoque. Preços podem ser alterados sem aviso prévio. O preço válido é o exibido no momento da finalização do pedido. Eventuais erros de preço serão comunicados antes da confirmação.</p>
              </section>

              <section>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>Compras e pagamento</h2>
                <p>As compras são realizadas de forma eletrônica. O consumidor é responsável pelas informações fornecidas no cadastro e no pedido. Reservamo-nos o direito de cancelar pedidos em caso de suspeita de fraude ou inconsistência nos dados.</p>
              </section>

              <section>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>Propriedade intelectual</h2>
                <p>Todo o conteúdo deste site — textos, imagens, marca e design — é de propriedade exclusiva da Mobella Móveis. É proibida a reprodução sem autorização expressa.</p>
              </section>

              <section>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>Limitação de responsabilidade</h2>
                <p>A Mobella não se responsabiliza por danos indiretos decorrentes do uso do site. Em caso de falhas técnicas, faremos o possível para restabelecer o funcionamento no menor prazo possível.</p>
              </section>

              <section>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>Foro</h2>
                <p>Fica eleito o foro da comarca de Curitiba, PR, para dirimir quaisquer controvérsias oriundas destes termos, com renúncia a qualquer outro, por mais privilegiado que seja.</p>
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
