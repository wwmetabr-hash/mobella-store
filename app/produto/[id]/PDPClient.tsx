'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/products'
import { useCart } from '@/lib/cart'

function formatPrice(n: number) {
  return 'R$ ' + n.toLocaleString('pt-BR', {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2
  })
}

type Props = {
  product: Product
  swatches: { label: string; hex: string }[]
}

export default function PDPClient({ product: p, swatches }: Props) {
  const router = useRouter()
  const { add } = useCart()
  const [activePhoto, setActivePhoto] = useState(0)
  const [activeColor, setActiveColor] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    add({
      id: p.id + '-' + p.colors[activeColor],
      name: p.name,
      price: p.price,
      unit: p.unit,
      photo: p.photos[0] || '',
      color: p.colors[activeColor],
    })
    setAdded(true)
    setTimeout(() => {
      router.push('/sacola')
    }, 400)
  }

  return (
    <main>
      <div className="container pdp">
        <div className="breadcrumb">
          <Link href="/">Início</Link>
          <span>/</span>
          <Link href={`/?cat=${p.cat.toLowerCase()}s`}>{p.cat}s</Link>
          <span>/</span>
          <span>{p.cat} {p.name}</span>
        </div>

        <div className="pdp__grid">
          {/* Galeria */}
          <div className="pdp__gallery">
            <div className="pdp__thumbs">
              {p.photos.map((photo, i) => (
                <button
                  key={i}
                  className={`pdp__thumb${activePhoto === i ? ' active' : ''}`}
                  onClick={() => setActivePhoto(i)}
                >
                  <Image src={`/products/${photo}`} alt={`${p.name} ${i + 1}`} width={72} height={72} style={{ objectFit: 'cover' }} />
                </button>
              ))}
            </div>
            <div className="pdp__main">
              {p.photos[activePhoto] && (
                <Image
                  src={`/products/${p.photos[activePhoto]}`}
                  alt={p.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              )}
              <div className="pdp__badge">
                {p.name} · {String(activePhoto + 1).padStart(2, '0')} de {String(p.photos.length).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="pdp__info">
            <div className="pdp__ref">{p.cat} · Linha Conforto</div>
            <h1 className="pdp__name">
              {p.cat.toLowerCase()}<br />
              <em>{p.name}</em>
            </h1>
            <p className="pdp__desc">{p.desc}</p>

            <div className="pdp__price-wrap">
              <div className="pdp__price">{formatPrice(p.price)}</div>
              <div className="pdp__parc">
                {p.unit ? `vendida em par · ${p.unit}` : 'à vista ou parcelado no cartão'}
              </div>
            </div>

            <div className="pdp__opt-label">
              Cor: <span>{p.colors[activeColor]}</span>
            </div>
            <div className="pdp__swatches">
              {swatches.map((sw, i) => (
                <button
                  key={i}
                  className={`swatch${activeColor === i ? ' active' : ''}`}
                  title={sw.label}
                  style={{ background: sw.hex }}
                  onClick={() => setActiveColor(i)}
                />
              ))}
            </div>

            <div className="pdp__qty-label">Quantidade</div>
            <div className="pdp__qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>

            <div className="pdp__stock">● Em estoque · pronta para entrega</div>

            <div className="pdp__actions">
              <button className="btn btn-dark" onClick={handleAdd} disabled={added}>
                {added ? 'Adicionado ✓' : <>Adicionar à sacola <span className="btn-arrow">→</span></>}
              </button>
              <a
                href={`https://wa.me/5541999999999?text=Olá! Tenho interesse na ${p.cat} ${p.name} (${formatPrice(p.price)})`}
                target="_blank"
                rel="noopener"
                className="btn-whatsapp"
              >
                Falar no WhatsApp
              </a>
            </div>

            <div className="pdp__specs">
              {p.specs.map(([k, v]) => (
                <div key={k} className="pdp__specs-row">
                  <span className="k">{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="pdp__story">
          <div className="pdp__story-text">
            {p.story.map((block, i) =>
              i === 0
                ? <h3 key={i} dangerouslySetInnerHTML={{ __html: block }} />
                : <p key={i} dangerouslySetInnerHTML={{ __html: block }} />
            )}
          </div>
          <div className="pdp__story-img">
            {p.photos[1] && (
              <Image
                src={`/products/${p.photos[1]}`}
                alt={`${p.name} em ambiente`}
                fill
                style={{ objectFit: 'cover' }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
