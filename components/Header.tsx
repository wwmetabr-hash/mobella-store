'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart'

const TICKER_ITEMS = ['@mobellabr', 'pouco, mas inteiro', 'mobella.com.br', 'feito e entregue em Curitiba']

export default function Header() {
  const { count } = useCart()
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <header className="header">
      <div className="container">
        <nav className="header__nav">
          <ul className="header__links">
            <li><Link href="/?cat=poltronas">Poltronas</Link></li>
            <li><Link href="/?cat=sofas">Sofás</Link></li>
            <li><Link href="/?cat=cadeiras">Cadeiras</Link></li>
            <li><Link href="/#novidades">Novidades</Link></li>
          </ul>

          <Link href="/" className="header__logo">
            mo<em>bella</em><span className="header__logo-dot">.</span>
          </Link>

          <div className="header__utils">
            <Link href="/sacola">
              Sacola
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
          </div>
        </nav>
      </div>

      <div className="ticker">
        <div className="ticker__track" aria-hidden="true">
          {items.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
          {items.map((t, i) => (
            <span key={`r-${i}`}>{t}</span>
          ))}
        </div>
      </div>
    </header>
  )
}
