'use client'

import { useState, useRef } from 'react'
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

type PixData = { qrCode: string; qrBase64: string }

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [shipping, setShipping] = useState('retirada')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [preferenceId, setPreferenceId] = useState<string | null>(null)
  const [pixData, setPixData] = useState<PixData | null>(null)
  const [copied, setCopied] = useState(false)
  const brickRef = useRef<HTMLDivElement>(null)

  const shippingOpts = [
    { id: 'retirada', name: 'Retirar em Curitiba', desc: 'Combinar via WhatsApp · sem custo', price: 'Grátis' },
    { id: 'padrao', name: 'Entrega padrão', desc: '5–10 dias úteis · Curitiba e região', price: 'A combinar' },
    { id: 'transportadora', name: 'Transportadora', desc: '10–20 dias úteis · todo o Brasil', price: 'A combinar' },
  ]

  async function handleIrPagar() {
    if (!email) { setErro('Informe seu e-mail para continuar.'); return }
    if (items.length === 0) return
    setLoading(true)
    setErro('')
    try {
      const r = await fetch('/api/checkout/mp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          payer: { email },
        }),
      })
      const data = await r.json()
      if (!r.ok) { setErro('Erro ao iniciar pagamento. Tente novamente.'); return }
      setPreferenceId(data.id)
      setTimeout(() => brickRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
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

  function handlePix(data: PixData) {
    setPixData(data)
    setTimeout(() => brickRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  function copiarCodigo() {
    if (!pixData) return
    navigator.clipboard.writeText(pixData.qrCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  if (items.length === 0 && !pixData) {
    return (
      <>
        <Header />
        <main>
          <div className="container" style={{ padding: '80px 48px', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Sua sacola está vazia.</p>
            <Link href="/" className="btn btn-dark">Ver produtos <span className="btn-arrow">→</span></Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="checkout-page">
        <div className="container">
          <h1>finalizar <em>pedido.</em></h1>

          <div className="checkout-layout">
            {/* ── Coluna esquerda ── */}
            <div>

              {/* Bloco 1: e-mail */}
              <div className="checkout-section">
                <div className="checkout-num">01</div>
                <h3>Seu e-mail</h3>
                <div className="field" style={{ maxWidth: 400 }}>
                  <label>E-mail <span style={{ color: 'var(--terracotta)' }}>*</span></label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={!!preferenceId}
                    style={{ opacity: preferenceId ? 0.6 : 1 }}
                  />
                  <p className="admin-field-hint" style={{ marginTop: 6 }}>Usado para confirmação e recibo do pagamento.</p>
                </div>
              </div>

              {/* Bloco 2: frete */}
              <div className="checkout-section">
                <div className="checkout-num">02</div>
                <h3>Entrega</h3>
                <div className="shipping-opts">
                  {shippingOpts.map(opt => (
                    <label
                      key={opt.id}
                      className={`shipping-opt${shipping === opt.id ? ' selected' : ''}`}
                      onClick={() => !preferenceId && setShipping(opt.id)}
                      style={{ opacity: preferenceId ? 0.6 : 1, cursor: preferenceId ? 'default' : 'pointer' }}
                    >
                      <input type="radio" name="shipping" value={opt.id} checked={shipping === opt.id} onChange={() => setShipping(opt.id)} disabled={!!preferenceId} />
                      <div className="shipping-opt__info">
                        <div className="shipping-opt__name">{opt.name}</div>
                        <div className="shipping-opt__desc">{opt.desc}</div>
                      </div>
                      <div className="shipping-opt__price">{opt.price}</div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bloco 3: pagamento */}
              <div className="checkout-section" ref={brickRef}>
                <div className="checkout-num">03</div>
                <h3>Pagamento</h3>

                {!preferenceId && (
                  <>
                    {erro && <p style={{ color: 'var(--terracotta)', fontSize: 13, marginBottom: 16 }}>{erro}</p>}
                    <button
                      className="btn btn-dark"
                      style={{ opacity: loading ? 0.6 : 1 }}
                      onClick={handleIrPagar}
                      disabled={loading}
                    >
                      {loading ? 'Carregando…' : <>Escolher forma de pagamento <span className="btn-arrow">→</span></>}
                    </button>
                    <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>
                      Você escolherá cartão, Pix ou boleto no próximo passo.
                    </p>
                  </>
                )}

                {/* Pix QR code inline */}
                {pixData && (
                  <div style={{ maxWidth: 480 }}>
                    <div style={{ background: 'var(--olive)', color: 'white', borderRadius: 4, padding: '12px 20px', marginBottom: 24, fontSize: 14, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 20 }}>✓</span> Pix gerado! Pague dentro de 30 minutos.
                    </div>

                    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      {pixData.qrBase64 && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`data:image/png;base64,${pixData.qrBase64}`}
                          alt="QR Code Pix"
                          style={{ width: 180, height: 180, border: '1px solid #e8e6e0', borderRadius: 4, background: 'white', padding: 8 }}
                        />
                      )}
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.6 }}>
                          Escaneie o QR code com o app do seu banco ou copie o código abaixo:
                        </p>
                        <div style={{ background: '#f4f4f2', borderRadius: 3, padding: '10px 14px', fontSize: 11, fontFamily: 'var(--font-mono)', wordBreak: 'break-all', color: 'var(--ink)', marginBottom: 12, lineHeight: 1.5 }}>
                          {pixData.qrCode.slice(0, 80)}…
                        </div>
                        <button
                          onClick={copiarCodigo}
                          className="btn btn-dark"
                          style={{ fontSize: 13, padding: '10px 20px' }}
                        >
                          {copied ? '✓ Copiado!' : 'Copiar código Pix'}
                        </button>
                        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 12, lineHeight: 1.5 }}>
                          Após o pagamento, você receberá confirmação por e-mail. Dúvidas?{' '}
                          <a href="https://wa.me/5541995699560" target="_blank" rel="noopener" style={{ color: 'var(--terracotta)' }}>Fale no WhatsApp.</a>
                        </p>
                      </div>
                    </div>

                    <div style={{ marginTop: 32, borderTop: '1px solid rgba(27,32,37,.06)', paddingTop: 24, display: 'flex', gap: 12 }}>
                      <Link href="/" className="btn btn-dark" onClick={() => clear?.()}>
                        Ver mais produtos <span className="btn-arrow">→</span>
                      </Link>
                      <a href="https://wa.me/5541995699560" target="_blank" rel="noopener" className="btn" style={{ border: '1px solid var(--ink)', color: 'var(--ink)' }}>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                {/* Payment Brick */}
                {preferenceId && !pixData && (
                  <div style={{ marginTop: 8 }}>
                    {erro && <p style={{ color: 'var(--terracotta)', fontSize: 13, marginBottom: 16 }}>{erro}</p>}
                    <MPPaymentBrick
                      preferenceId={preferenceId}
                      amount={total}
                      onSuccess={handleSuccess}
                      onPix={handlePix}
                      onError={msg => setErro(msg)}
                    />
                    <button
                      onClick={() => { setPreferenceId(null); setErro('') }}
                      style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      ← Editar e-mail ou entrega
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Resumo ── */}
            <div className="checkout-summary">
              <h3>Seu pedido</h3>
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
                    <div className="checkout-summary__name">{item.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>{item.color}{item.unit ? ` · ${item.unit}` : ''} · qtd {item.qty}</div>
                    <div className="checkout-summary__price">{formatPrice(item.price * item.qty)}</div>
                  </div>
                </div>
              ))}

              <hr className="checkout-summary__divider" />
              <div className="checkout-summary__row"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
              <div className="checkout-summary__row">
                <span>Frete</span>
                <span style={{ color: shipping === 'retirada' ? 'var(--olive)' : 'var(--muted)' }}>
                  {shipping === 'retirada' ? 'Grátis' : 'A combinar'}
                </span>
              </div>
              <div className="checkout-summary__total"><span>Total</span><span>{formatPrice(total)}</span></div>

              <div style={{ marginTop: 20, padding: '14px 16px', background: '#f4f4f2', borderRadius: 4 }}>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Precisa de ajuda?</div>
                <a
                  href={`https://wa.me/5541995699560?text=Olá! Estou finalizando um pedido na Mobella e preciso de ajuda.`}
                  target="_blank"
                  rel="noopener"
                  style={{ fontSize: 13, color: 'var(--terracotta)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  💬 Falar no WhatsApp
                </a>
              </div>

              <div className="ssl-badge">🔒 Pagamento seguro · Mercado Pago</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
