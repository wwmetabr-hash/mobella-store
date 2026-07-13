import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <h3>mo<em>bella</em><span style={{ color: 'var(--terracotta)' }}>.</span></h3>
            <p>Móveis pequenos, bem feitos.<br />Fabricação e entrega em Curitiba, PR.</p>
          </div>
          <div className="footer__col">
            <h5>Produtos</h5>
            <ul>
              <li><Link href="/?cat=poltronas">Poltronas</Link></li>
              <li><Link href="/?cat=sofas">Sofás</Link></li>
              <li><Link href="/?cat=cadeiras">Cadeiras</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h5>Atendimento</h5>
            <ul>
              <li><a href="https://wa.me/5541999999999" target="_blank" rel="noopener">WhatsApp</a></li>
              <li><a href="mailto:contato@mobella.com.br">E-mail</a></li>
              <li><Link href="/sacola">Minha sacola</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h5>Empresa</h5>
            <ul>
              <li><a href="#">Quem somos</a></li>
              <li><a href="#">Como fazemos</a></li>
              <li><a href="#">Showroom</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h5>Legal</h5>
            <ul>
              <li><a href="#">Trocas e devoluções</a></li>
              <li><a href="#">Privacidade</a></li>
              <li><a href="#">Termos de uso</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Mobella · Curitiba, PR · CNPJ 00.000.000/0001-00</span>
          <span>Feito com cuidado — como os móveis.</span>
        </div>
      </div>
    </footer>
  )
}
