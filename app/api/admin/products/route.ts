import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, saveProducts, Product } from '@/lib/products'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mobella2024'

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  return token === ADMIN_PASSWORD
}

export function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  return NextResponse.json(getAllProducts())
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const product: Product = await req.json()
  const products = getAllProducts()
  const idx = products.findIndex(p => p.id === product.id)
  if (idx >= 0) {
    products[idx] = product
  } else {
    products.push(product)
  }
  saveProducts(products)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { id } = await req.json()
  const products = getAllProducts().filter(p => p.id !== id)
  saveProducts(products)
  return NextResponse.json({ ok: true })
}
