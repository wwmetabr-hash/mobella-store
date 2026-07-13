'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/cart'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

function formatPrice(n: number) {
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function CartPage() {
  const { items, remove, update, total } = useCart()

  return (
    <>
      <Header />
      <main className="cart-page">
        <div className="container">
          <h1>Sua <em>sacola.</em></h1>

          {items.length === 0 ? (
            <div className="cart-empty">
              <p>Sua sacola está vazia.</p>
              <Link href="/" className="btn btn-dark">
                Ver produtos <span className="btn-arrow">→</span>
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              <div>
                {items.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item__img">
                      {item.photo && (
                        <Image
                          src={`/products/${item.photo}`}
                          alt={item.name}
                          width={160} height={160}
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                      )}
                    </div>
                    <div>
                      <div className="cart-item__name">{item.name}</div>
                      <div className="cart-item__ref">
                        {item.color}
                        {item.unit && ` · ${item.unit}`}
                      </div>
                      <div className="qty-ctrl" style={{ marginBottom: 12 }}>
                        <button onClick={() => update(item.id, item.qty - 1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => update(item.id, item.qty + 1)}>+</button>
                      </div>
                      <button className="cart-item__remove" onClick={() => remove(item.id)}>
                        Remover
                      </button>
                    </div>
                    <div className="cart-item__price">
                      {formatPrice(item.price * item.qty)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h3>Resumo do pedido</h3>
                <div className="cart-summary__row">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="cart-summary__row">
                  <span>Frete</span>
                  <span style={{ color: 'var(--muted)' }}>a calcular</span>
                </div>
                <div className="coupon-row">
                  <input type="text" placeholder="Código de cupom" />
                  <button>Aplicar</button>
                </div>
                <div className="cart-summary__total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <Link href="/checkout" className="btn btn-dark">
                  Finalizar compra <span className="btn-arrow">→</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
