'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const MPPaymentBrick = dynamic(() => import('@/components/MPPaymentBrick'), { ssr: false })

function formatPrice(n: number) {
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const SHIPPING_OPTS = [
  { id: 'padrao', name: 'Entrega padrão', desc: '5 a 10 dias úteis · Curitiba e região', price: 'A combinar' },
  { id: 'transportadora', name: 'Transportadora', desc: '10 a 20 dias úteis · todo o Brasil', price: 'A combinar' },
  { id: 'retirada', name: 'Retirar em Curitiba', desc: 'Combinar local e horário via WhatsApp', price: 'Grátis' },
]

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const router = useRouter()
  const [shipping, setShipping] = useState('retirada')
  const [email, setEmail]         = useState('')
  const [nome, setNome]           = useState('')
  const [sobrenome, setSobrenome] = useState('')
  const [cpf, setCpf]             = useState('')
  const [tel, setTel]             = useState('')
  const [loading, setLoading]     = useState(false)
  const [erro, setErro]           = useState('')
  const [preferenceId, setPreferenceId] = useState<string | null>(null)

  async function handleContinuar() {
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
      if (!r.ok) { setErro('Erro ao iniciar pagamento. Tente novamente.'); return }
      setPreferenceId(data.id)
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleSuccess() {
    clear?.()
    router.push('/obrigado')
  }

  const step = preferenceId ? 2 : 1

  return (
    <>
      <Header />
      <main className="checkout-page">
        <div className="container">
          <h1>finalize em <em>3 passos.</em></h1>

          <div className="stepper">
            <div className={`stepper__step${step > 1 ? ' done' : ' active'}`}>{step > 1 ? '✓' : '01'} Seus dados</div>
            <span className="stepper__sep">›</span>
            <div className={`stepper__step${step === 2 ? ' active' : ''}`}>02 Pagamento</div>
            <span className="stepper__sep">›</span>
            <div className="stepper__step">03 Confirmação</div>
          </div>

          <div className="checkout-layout">
            <div>
              {/* ── Passo 1: dados ── */}
              {step === 1 && (
                <>
                  <div className="checkout-section">
                    <div className="checkout-num">01</div>
                    <h3>Seus dados</h3>
                    <div className="form-grid">
                      <div className="field span2">
                        <label>E-mail <span style={{ color: '#c00' }}>*</span></label>
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

                  <div className="checkout-section">
                    <div className="checkout-num">02</div>
                    <h3>Endereço de entrega</h3>
                    <div className="form-grid">
                      <div className="field"><label>CEP</label><input type="text" placeholder="80000-000" /></div>
                      <div className="field"><label>Estado</label><input type="text" defaultValue="PR" /></div>
                      <div className="field span2"><label>Rua / Avenida</label><input type="text" placeholder="Nome da rua" /></div>
                      <div className="field"><label>Número</label><input type="text" placeholder="123" /></div>
                      <div className="field"><label>Complemento</label><input type="text" placeholder="Apto, bloco..." /></div>
                      <div className="field"><label>Bairro</label><input type="text" placeholder="Bairro" /></div>
                      <div className="field"><label>Cidade</label><input type="text" defaultValue="Curitiba" /></div>
                    </div>
                  </div>

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
                      O valor do frete será combinado via WhatsApp antes da confirmação.
                    </p>
                  </div>
                </>
              )}

              {/* ── Passo 2: pagamento ── */}
              {step === 2 && preferenceId && (
                <div className="checkout-section">
                  <div className="checkout-num">04</div>
                  <h3>Pagamento</h3>
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.6 }}>
                    Escolha a forma de pagamento. Cartão, Pix e boleto disponíveis.
                  </p>
                  <MPPaymentBrick
                    preferenceId={preferenceId}
                    amount={total}
                    onSuccess={handleSuccess}
                    onError={msg => setErro(msg)}
                  />
                  {erro && <p style={{ color: '#c00', fontSize: 13, marginTop: 16 }}>{erro}</p>}
                  <button
                    onClick={() => { setPreferenceId(null); setErro('') }}
                    style={{ marginTop: 16, fontSize: 12, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    ← Voltar e editar dados
                  </button>
                </div>
              )}
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
                  <div className="checkout-summary__total"><span>Total</span><span>{formatPrice(total)}</span></div>
                </>
              )}

              {step === 1 && (
                <>
                  {erro && <p style={{ color: '#c00', fontSize: 13, marginTop: 12 }}>{erro}</p>}
                  <button
                    className="btn btn-terra"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 20, opacity: loading || items.length === 0 ? 0.6 : 1 }}
                    onClick={handleContinuar}
                    disabled={loading || items.length === 0}
                  >
                    {loading ? 'Aguarde…' : <>Ir para pagamento <span className="btn-arrow">→</span></>}
                  </button>
                  <div className="ssl-badge">🔒 Pagamento seguro</div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
