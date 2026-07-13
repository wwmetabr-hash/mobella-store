import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, saveProducts, Product } from '@/lib/products'

const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || 'Mobella@2026').replace(/^﻿/, '').trim()
const SESSION_SECRET = (process.env.SESSION_SECRET || `mbsess_${ADMIN_PASSWORD}`).replace(/^﻿/, '').trim()

function checkAuth(req: NextRequest) {
  return req.cookies.get('admin_token')?.value === SESSION_SECRET
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  return NextResponse.json(await getAllProducts())
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const product: Product = await req.json()
  const products = await getAllProducts()
  const idx = products.findIndex(p => p.id === product.id)
  if (idx >= 0) products[idx] = product
  else products.push(product)
  await saveProducts(products)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { id } = await req.json()
  const products = (await getAllProducts()).filter(p => p.id !== id)
  await saveProducts(products)
  return NextResponse.json({ ok: true })
}
