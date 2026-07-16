import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsletterForm from '@/components/NewsletterForm'
import { getActiveProducts, getOrderedCategories, formatPrice } from '@/lib/products'

export default async function Home() {
  const products   = await getActiveProducts()
  const categories = await getOrderedCategories()
  const featured   = products.find(p => p.id === 'mirella') || products[0]

  return (
    <>
      <Header />

      <main>
        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero__left">
            <p className="hero__eyebrow">Curitiba, PR · escolhidos a dedo, entregues aqui</p>
            <h1 className="hero__title">
              senta,<br />e <em>fica.</em>
            </h1>
            <p className="hero__lede">
              Poltronas, cadeiras e sofás selecionados com cuidado.
              Entrega em Curitiba sem complicação, sem frete absurdo, sem esperar meses.
            </p>
            <Link href="#produtos" className="btn btn-dark">
              Ver coleção <span className="btn-arrow">→</span>
            </Link>
          </div>

          {featured?.photos[0] && (
            <div className="hero__right">
              <Image
                src={`/products/${featured.photos[0]}`}
                alt={`${featured.cat} ${featured.name}`}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              <div className="hero__price-badge">
                <small>{featured.cat} {featured.name}</small>
                <strong>{formatPrice(featured.price)}</strong>
              </div>
              <div className="hero__badge-spin" aria-hidden="true">Curitiba, PR</div>
            </div>
          )}
        </section>

        {/* ── Categorias ── */}
        <div className="container">
          <div className="section-intro">
            <h2>por <em>categoria</em></h2>
            <p>{products.length} peças disponíveis</p>
          </div>

          <div className="cat-grid">
            {categories.slice(0, 3).map(cat => {
              const first = products.find(p => p.cat === cat.id && p.photos[0])
              return first ? (
                <Link key={cat.id} href={`#${cat.slug}`} className="cat-card">
                  <Image
                    src={`/products/${first.photos[0]}`}
                    alt={cat.label}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="cat-card__label">
                    <h3>{cat.label}</h3>
                    <span>{products.filter(p => p.cat === cat.id).length} peças</span>
                  </div>
                </Link>
              ) : null
            })}
            <a
              href="https://wa.me/5541995699560"
              target="_blank"
              rel="noopener"
              className="cat-card"
              style={{ background: 'var(--charcoal)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
            >
              <div style={{ textAlign: 'center', color: 'var(--sand)', padding: '40px 32px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px', opacity: 0.6 }}>Atendimento</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '12px' }}>Orçamento personalizado</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 300, opacity: 0.65, lineHeight: 1.6 }}>Medidas especiais, tecidos exclusivos e combinações sob pedido via WhatsApp.</div>
              </div>
            </a>
          </div>
        </div>

        {/* ── Editorial ── */}
        <section className="editorial">
          {featured?.photos[1] && (
            <div className="editorial__img">
              <Image
                src={`/products/${featured.photos[1]}`}
                alt="Mobella — curadoria de móveis em Curitiba"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          <div className="editorial__text">
            <p className="editorial__kicker">Nossa curadoria</p>
            <h2>como <em>escolhemos</em></h2>
            <p>
              Cada peça que entra na Mobella passa por uma seleção rigorosa de materiais e acabamento. Chenille, veludo, linho — testados para durar e envelhecer bem.
            </p>
            <p>
              Você compra com clareza: sem intermediários desnecessários, sem prazo inventado. Só o móvel que vai sentar de verdade na sua sala.
            </p>
          </div>
        </section>

        {/* ── Grade de Produtos ── */}
        <div className="container" id="produtos">
          <div className="section-intro" id="novidades">
            <h2>toda a <em>coleção</em></h2>
            <p>{products.length} peças disponíveis</p>
          </div>

          <div className="product-grid">
            {categories.map(cat => {
              const items = products.filter(p => p.cat === cat.id)
              if (!items.length) return null
              return (
                <div key={cat.id} style={{ display: 'contents' }}>
                  <div className="pc-group" id={cat.slug}>
                    <span className="pc-group__t">
                      {cat.label.slice(0, -1)}<em>{cat.label.slice(-1)}</em>
                    </span>
                    <span className="pc-group__n">{String(items.length).padStart(2, '0')} peças</span>
                  </div>
                  {items.map(p => (
                    <Link key={p.id} href={`/produto/${p.id}`} className="pc">
                      <div className="pc__img">
                        {p.photos[0] ? (
                          <Image
                            src={`/products/${p.photos[0]}`}
                            alt={`${p.cat} ${p.name}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        ) : (
                          <div style={{ position: 'absolute', inset: 0, background: 'var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>foto em breve</div>
                        )}
                        <span className="pc__fav" aria-hidden="true">
                          <svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z"/></svg>
                        </span>
                      </div>
                      <div className="pc__meta">
                        <span>{p.cat}</span>
                        <span className="pc__price">{formatPrice(p.price)}{p.unit ? ` ${p.unit}` : ''}</span>
                      </div>
                      <h4 className="pc__name">{p.name}</h4>
                      <div className="pc__sub">{p.colors[0]}</div>
                    </Link>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Values ── */}
        <section className="values">
          <div className="container">
            <div className="values__grid">
              <div className="values__item">
                <h4>Entrega em Curitiba</h4>
                <p>Baseados em Curitiba, entregamos com nossa própria equipe. Sem surpresas no prazo.</p>
              </div>
              <div className="values__item">
                <h4>Tecido à escolha</h4>
                <p>Chenille, veludo, linho ou couro — você decide antes de confirmar o pedido.</p>
              </div>
              <div className="values__item">
                <h4>Cabe no apartamento</h4>
                <p>Todas as peças pensadas para espaços reais, não para showrooms de luxo.</p>
              </div>
              <div className="values__item">
                <h4>Conforto testado</h4>
                <p>Nenhuma peça sai sem aprovação. Cada modelo passa por teste de uso real.</p>
              </div>
            </div>
          </div>
        </section>

        {/* newsletter removida temporariamente */}
      </main>

      <Footer />
    </>
  )
}
