'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'

const TICKER_ITEMS = [
  { text: '@mobellabr', href: 'https://instagram.com/mobellabr' },
  { text: 'pouco, mas inteiro', href: null },
  { text: 'mobellamoveis.com.br', href: null },
  { text: 'feito e entregue em Curitiba', href: null },
]

export default function Header() {
  const { count } = useCart()
  const router = useRouter()
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS]

  function goToCategory(slug: string) {
    const el = document.getElementById(slug)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push(`/#${slug}`)
    }
  }

  return (
    <header className="header">
      <div className="container">
        <nav className="header__nav">
          <ul className="header__links">
            <li><button onClick={() => goToCategory('poltronas')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', transition: 'color 150ms' }}>Poltronas</button></li>
            <li><button onClick={() => goToCategory('cadeiras')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', transition: 'color 150ms' }}>Cadeiras</button></li>
            <li><button onClick={() => goToCategory('sofas')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', transition: 'color 150ms' }}>Sofás</button></li>
            <li><Link href="/quem-somos">Quem somos</Link></li>
          </ul>

          <Link href="/" className="header__logo">
            mo<em>bella</em><span className="header__logo-dot">.</span>
          </Link>

          <div className="header__utils">
            <a href="https://wa.me/5541995699860" target="_blank" rel="noopener">WhatsApp</a>
            <Link href="/sacola">
              Sacola
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
          </div>
        </nav>
      </div>

      <div className="ticker">
        <div className="ticker__track" aria-hidden="true">
          {items.map((t, i) =>
            t.href
              ? <a key={i} href={t.href} target="_blank" rel="noopener" style={{ color: 'inherit', textDecoration: 'none' }}>{t.text}</a>
              : <span key={i}>{t.text}</span>
          )}
        </div>
      </div>
    </header>
  )
}
