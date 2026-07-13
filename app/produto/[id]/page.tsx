import { notFound } from 'next/navigation'
import { getProduct, getActiveProducts, swatchColor } from '@/lib/products'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PDPClient from './PDPClient'

export async function generateStaticParams() {
  const products = await getActiveProducts()
  return products.map(p => ({ id: p.id }))
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  const swatches = product.colors.map(c => ({ label: c, hex: swatchColor(c) }))

  return (
    <>
      <Header />
      <PDPClient product={product} swatches={swatches} />
      <Footer />
    </>
  )
}
