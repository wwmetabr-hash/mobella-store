'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const TICKER_ITEMS = [
  { text: '@mobellabr', href: 'https://instagram.com/mobellabr' },
  { text: 'pouco, mas inteiro', href: null },
  { text: 'mobellamoveis.com.br', href: null },
  { text: 'selecionado, entregue em Curitiba', href: null },
]

export default function Header() {
  const { count } = useCart()
  const router = useRouter()
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS]
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function goToCategory(slug: string) {
    setMenuOpen(false)
    const el = document.getElementById(slug)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else router.push(`/#${slug}`)
  }

  return (
    <header className="header">
      <div className="container">
        <nav className="header__nav">
          {/* Desktop nav */}
          <ul className="header__links">
            <li><button className="header__navbtn" onClick={() => goToCategory('poltronas')}>Poltronas</button></li>
            <li><button className="header__navbtn" onClick={() => goToCategory('cadeiras')}>Cadeiras</button></li>
            <li><button className="header__navbtn" onClick={() => goToCategory('sofas')}>Sofás</button></li>
            <li><Link href="/quem-somos" className="header__navlink">Quem somos</Link></li>
          </ul>

          {/* Hamburger */}
          <button className="header__burger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span className={`header__burger-bar ${menuOpen ? 'open' : ''}`} />
          </button>

          <Link href="/" className="header__logo" onClick={() => setMenuOpen(false)}>
            mo<em>bella</em><span className="header__logo-dot">.</span>
          </Link>

          <div className="header__utils">
            <a href="https://wa.me/5541995699560" target="_blank" rel="noopener">WhatsApp</a>
            <Link href="/sacola">
              Sacola
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="header__mobile-overlay" onClick={() => setMenuOpen(false)}>
          <div className="header__mobile-menu" onClick={e => e.stopPropagation()}>
            <button className="header__navbtn" onClick={() => goToCategory('poltronas')}>Poltronas</button>
            <button className="header__navbtn" onClick={() => goToCategory('cadeiras')}>Cadeiras</button>
            <button className="header__navbtn" onClick={() => goToCategory('sofas')}>Sofás</button>
            <Link href="/quem-somos" className="header__navlink" onClick={() => setMenuOpen(false)}>Quem somos</Link>
            <Link href="/como-fazemos" className="header__navlink" onClick={() => setMenuOpen(false)}>Como escolhemos</Link>
            <div className="header__mobile-divider" />
            <a href="https://wa.me/5541995699560" target="_blank" rel="noopener" className="header__navlink">(41) 99569-9560</a>
            <Link href="/sacola" className="header__navlink" onClick={() => setMenuOpen(false)}>
              Sacola {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
          </div>
        </div>
      )}

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
