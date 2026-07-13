import Link from 'next/link'

const CNPJ = '67.234.688/0001-45'
const WHATSAPP = '5541995699560'
const EMAIL = 'mobellabr@gmail.com'
const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <h3>mo<em>bella</em><span style={{ color: 'var(--terracotta)' }}>.</span></h3>
            <p>Móveis pequenos, bem feitos.<br />Fabricação e entrega em Curitiba, PR.<br /><br />CNPJ {CNPJ}</p>
          </div>

          <div className="footer__col">
            <h5>Produtos</h5>
            <ul>
              <li><Link href="/#poltronas">Poltronas</Link></li>
              <li><Link href="/#cadeiras">Cadeiras</Link></li>
              <li><Link href="/#sofas">Sofás</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h5>Atendimento</h5>
            <ul>
              <li><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener">WhatsApp</a></li>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li><Link href="/sacola">Minha sacola</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h5>Empresa</h5>
            <ul>
              <li><Link href="/quem-somos">Quem somos</Link></li>
              <li><Link href="/como-fazemos">Como fazemos</Link></li>
              <li><a href={`https://instagram.com/mobellabr`} target="_blank" rel="noopener">@mobellabr</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h5>Legal</h5>
            <ul>
              <li><Link href="/politica-de-trocas">Trocas e devoluções</Link></li>
              <li><Link href="/privacidade">Privacidade (LGPD)</Link></li>
              <li><Link href="/termos-de-uso">Termos de uso</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {YEAR} Mobella Móveis · Curitiba, PR · CNPJ {CNPJ}</span>
          <span>Feito com cuidado — como os móveis.</span>
        </div>
      </div>
    </footer>
  )
}
