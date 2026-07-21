'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/cart'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

function formatPrice(n: number) {
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const SHIPPING_OPTS = [
  { id: 'padrao', name: 'Entrega padrão', desc: '5 a 10 dias úteis · Curitiba e região', price: 'A calcular' },
  { id: 'transportadora', name: 'Transportadora', desc: '10 a 20 dias úteis · todo o Brasil', price: 'A calcular' },
  { id: 'retirada', name: 'Retirar em Curitiba', desc: 'Combinar local e horário via WhatsApp', price: 'Grátis' },
]

export default function CheckoutPage() {
  const { items, total } = useCart()
  const [shipping, setShipping] = useState('retirada')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const [email, setEmail]         = useState('')
  const [nome, setNome]           = useState('')
  const [sobrenome, setSobrenome] = useState('')
  const [cpf, setCpf]             = useState('')
  const [tel, setTel]             = useState('')

  async function handlePagar() {
    if (items.length === 0) return
    setLoading(true)
    setErro('')

    try {
      const payer = email || nome ? {
        email: email || undefined,
        first_name: nome || undefined,
        last_name: sobrenome || undefined,
        identification: cpf ? { type: 'CPF', number: cpf.replace(/\D/g, '') } : undefined,
        phone: tel ? { number: tel.replace(/\D/g, '') } : undefined,
      } : undefined

      const r = await fetch('/api/checkout/mp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, payer }),
      })

      const data = await r.json()

      if (!r.ok) {
        setErro('Erro ao iniciar pagamento. Tente novamente.')
        return
      }

      // sandbox_init_point em teste, init_point em produção
      const url = data.sandbox_init_point || data.init_point
      window.location.href = url
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="checkout-page">
        <div className="container">
          <h1>finalize em <em>3 passos.</em></h1>

          <div className="stepper">
            <div className="stepper__step done">✓ Sacola</div>
            <span className="stepper__sep">›</span>
            <div className="stepper__step active">Entrega & pagamento</div>
            <span className="stepper__sep">›</span>
            <div className="stepper__step">Confirmação</div>
          </div>

          <div className="checkout-layout">
            {/* Esquerda */}
            <div>
              {/* 01 — Dados */}
              <div className="checkout-section">
                <div className="checkout-num">01</div>
                <h3>Seus dados</h3>
                <div className="form-grid">
                  <div className="field span2">
                    <label>E-mail</label>
                    <input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Nome</label>
                    <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Sobrenome</label>
                    <input type="text" placeholder="Sobrenome" value={sobrenome} onChange={e => setSobrenome(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>CPF</label>
                    <input type="text" placeholder="000.000.000-00" value={cpf} onChange={e => setCpf(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Celular</label>
                    <input type="tel" placeholder="(41) 99999-9999" value={tel} onChange={e => setTel(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* 02 — Endereço */}
              <div className="checkout-section">
                <div className="checkout-num">02</div>
                <h3>Endereço de entrega</h3>
                <div className="form-grid">
                  <div className="field">
                    <label>CEP</label>
                    <input type="text" placeholder="80000-000" />
                  </div>
                  <div className="field">
                    <label>Estado</label>
                    <input type="text" defaultValue="PR" />
                  </div>
                  <div className="field span2">
                    <label>Rua / Avenida</label>
                    <input type="text" placeholder="Nome da rua" />
                  </div>
                  <div className="field">
                    <label>Número</label>
                    <input type="text" placeholder="123" />
                  </div>
                  <div className="field">
                    <label>Complemento</label>
                    <input type="text" placeholder="Apto, bloco..." />
                  </div>
                  <div className="field">
                    <label>Bairro</label>
                    <input type="text" placeholder="Bairro" />
                  </div>
                  <div className="field">
                    <label>Cidade</label>
                    <input type="text" defaultValue="Curitiba" />
                  </div>
                </div>
              </div>

              {/* 03 — Frete */}
              <div className="checkout-section">
                <div className="checkout-num">03</div>
                <h3>Frete</h3>
                <div className="shipping-opts">
                  {SHIPPING_OPTS.map(opt => (
                    <label key={opt.id} className={`shipping-opt${shipping === opt.id ? ' selected' : ''}`} onClick={() => setShipping(opt.id)}>
                      <input type="radio" name="shipping" value={opt.id} checked={shipping === opt.id} onChange={() => setShipping(opt.id)} />
                      <div className="shipping-opt__info">
                        <div className="shipping-opt__name">{opt.name}</div>
                        <div className="shipping-opt__desc">{opt.desc}</div>
                      </div>
                      <div className="shipping-opt__price">{opt.price}</div>
                    </label>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12, lineHeight: 1.5 }}>
                  O valor do frete será combinado via WhatsApp antes da confirmação do pedido.
                </p>
              </div>
            </div>

            {/* Resumo */}
            <div className="checkout-summary">
              <h3>Seu pedido</h3>
              {items.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: 13 }}>
                  Sacola vazia. <Link href="/" style={{ textDecoration: 'underline' }}>Ver produtos</Link>
                </p>
              ) : (
                <>
                  {items.map(item => (
                    <div key={item.id} className="checkout-summary__item">
                      <div className="checkout-summary__img">
                        {item.photo && (
                          <Image
                            src={item.photo.startsWith('http') ? item.photo : `/products/${item.photo}`}
                            alt={item.name}
                            width={56} height={56}
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                          />
                        )}
                      </div>
                      <div>
                        <div className="checkout-summary__name">{item.name} × {item.qty}</div>
                        <div className="checkout-summary__price">{formatPrice(item.price * item.qty)}</div>
                      </div>
                    </div>
                  ))}
                  <hr className="checkout-summary__divider" />
                  <div className="checkout-summary__row"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
                  <div className="checkout-summary__row"><span>Frete</span><span>{shipping === 'retirada' ? 'Grátis' : 'A combinar'}</span></div>
                  <div className="checkout-summary__total">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </>
              )}

              {erro && <p style={{ color: '#c00', fontSize: 13, marginTop: 12 }}>{erro}</p>}

              <button
                className="btn btn-terra"
                style={{ width: '100%', justifyContent: 'center', marginTop: '20px', opacity: loading || items.length === 0 ? 0.6 : 1 }}
                onClick={handlePagar}
                disabled={loading || items.length === 0}
              >
                {loading ? 'Aguarde…' : <>Pagar {formatPrice(total)} <span className="btn-arrow">→</span></>}
              </button>
              <div className="ssl-badge">🔒 Pagamento seguro via Mercado Pago</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
