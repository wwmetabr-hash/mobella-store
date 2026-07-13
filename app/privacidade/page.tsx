import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Política de Privacidade — Mobella Móveis' }

export default function Privacidade() {
  return (
    <>
      <Header />
      <main>
        <div className="container" style={{ padding: '72px 48px 96px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 20 }}>Legal · LGPD</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4vw,56px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 48 }}>
              Política de<br /><em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, textTransform: 'none' }}>privacidade</em>
            </h1>

            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 300, lineHeight: 1.85, color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: 32 }}>

              <section>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>Quem somos</h2>
                <p>Mobella Móveis, CNPJ 67.234.688/0001-45, com sede em Curitiba, PR, é responsável pelo tratamento dos dados pessoais coletados neste site, conforme a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados — LGPD).</p>
              </section>

              <section>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>Dados que coletamos</h2>
                <ul style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li><strong>Dados de contato:</strong> nome, e-mail e telefone fornecidos voluntariamente ao entrar em contato conosco ou ao realizar uma compra.</li>
                  <li><strong>Dados de entrega:</strong> endereço para fins logísticos.</li>
                  <li><strong>Dados de navegação:</strong> informações técnicas como IP, navegador e páginas visitadas, coletados automaticamente para fins de segurança e melhoria do site.</li>
                </ul>
              </section>

              <section>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>Como usamos seus dados</h2>
                <ul style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li>Processar e entregar pedidos</li>
                  <li>Responder a dúvidas e solicitações de suporte</li>
                  <li>Melhorar o funcionamento do site</li>
                  <li>Cumprir obrigações legais e fiscais</li>
                </ul>
                <p style={{ marginTop: 12 }}>Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing.</p>
              </section>

              <section>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>Seus direitos</h2>
                <p>Conforme a LGPD, você tem direito a: confirmar se tratamos seus dados, acessar seus dados, corrigir dados incompletos ou incorretos, solicitar a exclusão de dados desnecessários e revogar consentimentos. Para exercer esses direitos, entre em contato pelo e-mail <a href="mailto:mobellabr@gmail.com" style={{ color: 'var(--terracotta)' }}>mobellabr@gmail.com</a>.</p>
              </section>

              <section>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 14 }}>Segurança</h2>
                <p>Adotamos medidas técnicas para proteger seus dados contra acesso não autorizado. O site utiliza HTTPS e os dados de pagamento são processados exclusivamente pelo gateway de pagamento, sem armazenamento em nossos servidores.</p>
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
