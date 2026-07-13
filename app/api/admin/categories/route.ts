import { NextRequest, NextResponse } from 'next/server'
import { getAllCategories, saveCategories, getAllProducts, saveProducts, Category } from '@/lib/products'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mobella2024'

function checkAuth(req: NextRequest) {
  return req.cookies.get('admin_token')?.value === ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  return NextResponse.json(await getAllCategories())
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const cat: Category = await req.json()
  const cats = await getAllCategories()
  const idx = cats.findIndex(c => c.id === cat.id)
  if (idx >= 0) cats[idx] = cat
  else cats.push(cat)
  await saveCategories(cats)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { id } = await req.json()
  await saveCategories((await getAllCategories()).filter(c => c.id !== id))
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { oldId, newId, newLabel, newSlug } = await req.json()
  const cats = (await getAllCategories()).map(c =>
    c.id === oldId ? { ...c, id: newId, label: newLabel, slug: newSlug } : c
  )
  await saveCategories(cats)
  const products = (await getAllProducts()).map(p =>
    p.cat === oldId ? { ...p, cat: newId } : p
  )
  await saveProducts(products)
  return NextResponse.json({ ok: true })
}
