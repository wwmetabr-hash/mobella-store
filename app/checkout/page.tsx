'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const MPCardBrick = dynamic(() => import('@/components/MPPaymentBrick'), { ssr: false })

function fmt(n: number) {
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

type PayTab = 'pix' | 'cartao' | 'boleto'
type PixResult = { qrCode: string; qrBase64: string }
type BoletoResult = { url: string }

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const router = useRouter()

  // Dados do cliente
  const [email, setEmail]     = useState('')
  const [nome, setNome]       = useState('')
  const [cpf, setCpf]         = useState('')
  const [shipping, setShipping] = useState('retirada')

  // UX
  const [payTab, setPayTab]           = useState<PayTab>('pix')
  const [preferenceId, setPreferenceId] = useState<string | null>(null)
  const [loading, setLoading]         = useState(false)
  const [erro, setErro]               = useState('')

  // Resultados de pagamento
  const [pixResult, setPixResult]     = useState<PixResult | null>(null)
  const [boletoResult, setBoletoResult] = useState<BoletoResult | null>(null)
  const [copied, setCopied]           = useState(false)
  const payRef = useRef<HTMLDivElement>(null)

  const shippingOpts = [
    { id: 'retirada',      name: 'Retirar em Curitiba',  desc: 'Combinar via WhatsApp · sem custo', price: 'Grátis' },
    { id: 'padrao',        name: 'Entrega padrão',        desc: '5–10 dias úteis · Curitiba e região', price: 'A combinar' },
    { id: 'transportadora', name: 'Transportadora',       desc: '10–20 dias úteis · todo o Brasil',   price: 'A combinar' },
  ]

  const isPaid = !!pixResult || !!boletoResult

  // ── Criar preferência (necessária para o brick de cartão) ──────────────────
  async function criarPreferencia() {
    const r = await fetch('/api/checkout/mp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, payer: { email } }),
    })
    const d = await r.json()
    if (!r.ok) throw new Error('Erro ao iniciar pagamento.')
    return d.id as string
  }

  // ── Pagar via Pix ─────────────────────────────────────────────────────────
  async function pagarPix() {
    if (!email) { setErro('Informe seu e-mail.'); return }
    setLoading(true); setErro('')
    try {
      const r = await fetch('/api/checkout/mp/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'pix', email, amount: total }),
      })
      const d = await r.json()
      if (!r.ok) { setErro(d.error || 'Erro ao gerar Pix.'); return }
      setPixResult({ qrCode: d.pixQrCode, qrBase64: d.pixQrBase64 })
      setTimeout(() => payRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch { setErro('Erro de conexão.') }
    finally { setLoading(false) }
  }

  // ── Pagar via Boleto ───────────────────────────────────────────────────────
  async function pagarBoleto() {
    if (!email) { setErro('Informe seu e-mail.'); return }
    if (!cpf) { setErro('Informe seu CPF para gerar o boleto.'); return }
    setLoading(true); setErro('')
    try {
      const r = await fetch('/api/checkout/mp/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'boleto', email, cpf, firstName: nome || 'Cliente', amount: total }),
      })
      const d = await r.json()
      if (!r.ok) { setErro(d.error || 'Erro ao gerar boleto.'); return }
      setBoletoResult({ url: d.boletoUrl })
      setTimeout(() => payRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch { setErro('Erro de conexão.') }
    finally { setLoading(false) }
  }

  // ── Ir para cartão ─────────────────────────────────────────────────────────
  async function irParaCartao() {
    if (!email) { setErro('Informe seu e-mail.'); return }
    setLoading(true); setErro('')
    try {
      const id = await criarPreferencia()
      setPreferenceId(id)
      setTimeout(() => payRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
    } catch { setErro('Erro ao iniciar pagamento.') }
    finally { setLoading(false) }
  }

  function copiarPix() {
    if (!pixResult) return
    navigator.clipboard.writeText(pixResult.qrCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  if (items.length === 0 && !isPaid) {
    return (
      <>
        <Header />
        <main><div className="container" style={{ padding: '80px 48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Sua sacola está vazia.</p>
          <Link href="/" className="btn btn-dark">Ver produtos <span className="btn-arrow">→</span></Link>
        </div></main>
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

              {/* 01 — Contato */}
              {!isPaid && (
                <div className="checkout-section">
                  <div className="checkout-num">01</div>
                  <h3>Contato</h3>
                  <div className="form-grid">
                    <div className="field span2">
                      <label>E-mail <span style={{ color: 'var(--terracotta)' }}>*</span></label>
                      <input type="email" placeholder="seu@email.com" value={email}
                        onChange={e => setEmail(e.target.value)} disabled={!!preferenceId} />
                    </div>
                    <div className="field">
                      <label>Nome (opcional)</label>
                      <input type="text" placeholder="Seu nome" value={nome}
                        onChange={e => setNome(e.target.value)} disabled={!!preferenceId} />
                    </div>
                    <div className="field">
                      <label>CPF {payTab === 'boleto' && <span style={{ color: 'var(--terracotta)' }}>*</span>}</label>
                      <input type="text" placeholder="000.000.000-00" value={cpf}
                        onChange={e => setCpf(e.target.value)} disabled={!!preferenceId} />
                    </div>
                  </div>
                </div>
              )}

              {/* 02 — Entrega */}
              {!isPaid && (
                <div className="checkout-section">
                  <div className="checkout-num">02</div>
                  <h3>Entrega</h3>
                  <div className="shipping-opts">
                    {shippingOpts.map(opt => (
                      <label key={opt.id}
                        className={`shipping-opt${shipping === opt.id ? ' selected' : ''}`}
                        style={{ opacity: preferenceId ? 0.6 : 1, cursor: preferenceId ? 'default' : 'pointer' }}>
                        <input type="radio" name="shipping" value={opt.id}
                          checked={shipping === opt.id} onChange={() => !preferenceId && setShipping(opt.id)} />
                        <div className="shipping-opt__info">
                          <div className="shipping-opt__name">{opt.name}</div>
                          <div className="shipping-opt__desc">{opt.desc}</div>
                        </div>
                        <div className="shipping-opt__price">{opt.price}</div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* 03 — Pagamento */}
              <div className="checkout-section" ref={payRef}>
                <div className="checkout-num">03</div>
                <h3>Pagamento</h3>

                {/* ── Resultado: Pix gerado ── */}
                {pixResult && (
                  <div>
                    <div style={{ background: 'var(--olive)', color: 'white', borderRadius: 4, padding: '12px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                      <span style={{ fontSize: 20 }}>✓</span> Pix gerado! Pague em até 30 minutos.
                    </div>
                    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      {pixResult.qrBase64 && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`data:image/png;base64,${pixResult.qrBase64}`} alt="QR Code Pix"
                          style={{ width: 180, height: 180, border: '1px solid #e8e6e0', borderRadius: 4, background: 'white', padding: 8, flexShrink: 0 }} />
                      )}
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.6 }}>
                          Escaneie o QR Code com o app do seu banco, ou copie o código abaixo:
                        </p>
                        <div style={{ background: '#f0f0ee', borderRadius: 3, padding: '10px 14px', fontSize: 11, fontFamily: 'var(--font-mono)', wordBreak: 'break-all', lineHeight: 1.5, marginBottom: 12 }}>
                          {pixResult.qrCode.slice(0, 100)}…
                        </div>
                        <button onClick={copiarPix} className="btn btn-dark" style={{ fontSize: 13, padding: '10px 20px' }}>
                          {copied ? '✓ Copiado!' : 'Copiar código Pix'}
                        </button>
                        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 16, lineHeight: 1.6 }}>
                          Assim que o pagamento for identificado, você receberá confirmação por e-mail. Dúvidas?{' '}
                          <a href="https://wa.me/5541995699560" target="_blank" rel="noopener" style={{ color: 'var(--terracotta)' }}>WhatsApp.</a>
                        </p>
                      </div>
                    </div>
                    <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
                      <Link href="/" className="btn btn-dark" onClick={() => clear?.()}>Ver mais produtos <span className="btn-arrow">→</span></Link>
                    </div>
                  </div>
                )}

                {/* ── Resultado: Boleto gerado ── */}
                {boletoResult && (
                  <div>
                    <div style={{ background: 'var(--olive)', color: 'white', borderRadius: 4, padding: '12px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                      <span style={{ fontSize: 20 }}>✓</span> Boleto gerado! Vence em 3 dias úteis.
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.6 }}>
                      Você também receberá o boleto por e-mail. Para pagar agora, clique abaixo:
                    </p>
                    <a href={boletoResult.url} target="_blank" rel="noopener" className="btn btn-dark">
                      Abrir boleto <span className="btn-arrow">→</span>
                    </a>
                    <div style={{ marginTop: 24 }}>
                      <Link href="/" className="btn" style={{ border: '1px solid var(--ink)', color: 'var(--ink)' }} onClick={() => clear?.()}>
                        Ver mais produtos
                      </Link>
                    </div>
                  </div>
                )}

                {/* ── Abas de pagamento ── */}
                {!isPaid && !preferenceId && (
                  <>
                    <div className="pay-tabs" style={{ marginBottom: 24 }}>
                      {(['pix', 'cartao', 'boleto'] as PayTab[]).map(tab => (
                        <button key={tab} className={`pay-tab${payTab === tab ? ' active' : ''}`} onClick={() => { setPayTab(tab); setErro('') }}>
                          {tab === 'pix' ? '⬡ Pix' : tab === 'cartao' ? '💳 Cartão' : '📋 Boleto'}
                        </button>
                      ))}
                    </div>

                    {payTab === 'pix' && (
                      <div>
                        <div style={{ background: '#f4f4f2', borderRadius: 4, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
                          <span style={{ fontSize: 28 }}>⬡</span>
                          <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Pix — pagamento instantâneo</div>
                            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>QR Code gerado na tela. Aprovação em segundos.</div>
                          </div>
                        </div>
                        {erro && <p style={{ color: 'var(--terracotta)', fontSize: 13, marginBottom: 16 }}>{erro}</p>}
                        <button className="btn btn-dark" style={{ opacity: loading ? 0.6 : 1 }} onClick={pagarPix} disabled={loading}>
                          {loading ? 'Gerando QR Code…' : <>Gerar QR Code Pix — {fmt(total)} <span className="btn-arrow">→</span></>}
                        </button>
                      </div>
                    )}

                    {payTab === 'cartao' && (
                      <div>
                        <div style={{ background: '#f4f4f2', borderRadius: 4, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
                          <span style={{ fontSize: 28 }}>💳</span>
                          <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Cartão de crédito ou débito</div>
                            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Até 12x. Visa, Mastercard, Elo e outros.</div>
                          </div>
                        </div>
                        {erro && <p style={{ color: 'var(--terracotta)', fontSize: 13, marginBottom: 16 }}>{erro}</p>}
                        <button className="btn btn-dark" style={{ opacity: loading ? 0.6 : 1 }} onClick={irParaCartao} disabled={loading}>
                          {loading ? 'Carregando…' : <>Pagar com cartão <span className="btn-arrow">→</span></>}
                        </button>
                      </div>
                    )}

                    {payTab === 'boleto' && (
                      <div>
                        <div style={{ background: '#f4f4f2', borderRadius: 4, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
                          <span style={{ fontSize: 28 }}>📋</span>
                          <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Boleto bancário</div>
                            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Vence em 3 dias úteis. CPF obrigatório.</div>
                          </div>
                        </div>
                        {erro && <p style={{ color: 'var(--terracotta)', fontSize: 13, marginBottom: 16 }}>{erro}</p>}
                        <button className="btn btn-dark" style={{ opacity: loading ? 0.6 : 1 }} onClick={pagarBoleto} disabled={loading}>
                          {loading ? 'Gerando boleto…' : <>Gerar boleto — {fmt(total)} <span className="btn-arrow">→</span></>}
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* ── Brick de cartão ── */}
                {!isPaid && preferenceId && (
                  <div>
                    {erro && <p style={{ color: 'var(--terracotta)', fontSize: 13, marginBottom: 16 }}>{erro}</p>}
                    <MPCardBrick
                      preferenceId={preferenceId}
                      amount={total}
                      onSuccess={() => { clear?.(); router.push('/obrigado') }}
                      onError={msg => setErro(msg)}
                    />
                    <button onClick={() => { setPreferenceId(null); setErro('') }}
                      style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                      ← Voltar
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
                      <Image src={item.photo.startsWith('http') ? item.photo : `/products/${item.photo}`}
                        alt={item.name} width={56} height={56}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    )}
                  </div>
                  <div>
                    <div className="checkout-summary__name">{item.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>
                      {item.color}{item.unit ? ` · ${item.unit}` : ''} · qtd {item.qty}
                    </div>
                    <div className="checkout-summary__price">{fmt(item.price * item.qty)}</div>
                  </div>
                </div>
              ))}
              <hr className="checkout-summary__divider" />
              <div className="checkout-summary__row"><span>Subtotal</span><span>{fmt(total)}</span></div>
              <div className="checkout-summary__row">
                <span>Frete</span>
                <span style={{ color: shipping === 'retirada' ? 'var(--olive)' : 'var(--muted)' }}>
                  {shipping === 'retirada' ? 'Grátis' : 'A combinar'}
                </span>
              </div>
              <div className="checkout-summary__total"><span>Total</span><span>{fmt(total)}</span></div>

              <div style={{ marginTop: 20, padding: '14px 16px', background: '#f4f4f2', borderRadius: 4 }}>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Precisa de ajuda?</div>
                <a href="https://wa.me/5541995699560?text=Olá! Preciso de ajuda com meu pedido na Mobella."
                  target="_blank" rel="noopener"
                  style={{ fontSize: 13, color: 'var(--terracotta)', textDecoration: 'none' }}>
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
