import fs from 'fs'
import path from 'path'

export type Product = {
  id: string
  name: string
  cat: string
  price: number
  unit: string | null
  photos: string[]
  desc: string
  colors: string[]
  colorPhotos?: Array<{ color: string; photos: string[] }>
  specs: [string, string][]
  story: string[]
  active: boolean
}

export type Category = {
  id: string
  label: string
  slug: string
  order: number
}

// ── Upstash REST helpers ──────────────────────────────────────────────────────

const KV_URL   = process.env.UPSTASH_REDIS_REST_URL?.replace(/^﻿/, '').trim()
const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN?.replace(/^﻿/, '').trim()

async function kvGet<T>(key: string): Promise<T | null> {
  if (!KV_URL || !KV_TOKEN) return null
  const r = await fetch(`${KV_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
    cache: 'no-store',
  })
  const { result } = await r.json()
  return result ? (JSON.parse(result) as T) : null
}

async function kvSet(key: string, value: unknown): Promise<void> {
  if (!KV_URL || !KV_TOKEN) return
  await fetch(KV_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['SET', key, JSON.stringify(value)]),
  })
}

// ── Fallback: arquivo local (desenvolvimento) ─────────────────────────────────

const PRODUCTS_PATH   = path.join(process.cwd(), 'data', 'products.json')
const CATEGORIES_PATH = path.join(process.cwd(), 'data', 'categories.json')

function readFile<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as T
}

function writeFile(p: string, data: unknown): void {
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8')
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  if (KV_URL && KV_TOKEN) {
    const cached = await kvGet<Product[]>('mobella:products')
    if (cached) return cached
    const initial = readFile<Product[]>(PRODUCTS_PATH)
    await kvSet('mobella:products', initial)
    return initial
  }
  return readFile<Product[]>(PRODUCTS_PATH)
}

export async function getActiveProducts(): Promise<Product[]> {
  return (await getAllProducts()).filter(p => p.active)
}

export async function getProduct(id: string): Promise<Product | undefined> {
  return (await getAllProducts()).find(p => p.id === id)
}

export async function saveProducts(products: Product[]): Promise<void> {
  if (KV_URL && KV_TOKEN) {
    await kvSet('mobella:products', products)
  } else {
    writeFile(PRODUCTS_PATH, products)
  }
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  if (KV_URL && KV_TOKEN) {
    const cached = await kvGet<Category[]>('mobella:categories')
    if (cached) return cached
    const initial = readFile<Category[]>(CATEGORIES_PATH)
    await kvSet('mobella:categories', initial)
    return initial
  }
  try {
    return readFile<Category[]>(CATEGORIES_PATH)
  } catch {
    return []
  }
}

export async function saveCategories(cats: Category[]): Promise<void> {
  if (KV_URL && KV_TOKEN) {
    await kvSet('mobella:categories', cats)
  } else {
    writeFile(CATEGORIES_PATH, cats)
  }
}

export async function getOrderedCategories(): Promise<Category[]> {
  const stored   = await getAllCategories()
  const products = await getActiveProducts()
  const unique   = [...new Set(products.map(p => p.cat))]
  const result: Category[] = [...stored]
  unique.forEach(cat => {
    if (!result.find(c => c.id === cat)) {
      result.push({
        id: cat,
        label: cat + 's',
        slug: cat.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/\s+/g, '-'),
        order: result.length + 1,
      })
    }
  })
  return result.sort((a, b) => a.order - b.order)
}

// ── Utilitários ───────────────────────────────────────────────────────────────

export function formatPrice(price: number): string {
  return 'R$ ' + price.toLocaleString('pt-BR', {
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

export const SWATCH: Record<string, string> = {
  bege: '#DFD9CD', cinza: '#7A848C', capuccino: '#9C7A5C',
  marrom: '#6E4A38', vermelho: '#9B3B32', nozes: '#7A5230',
  whisky: '#A77961', linho: '#DFD9CD', veludo: '#8C7A66',
  prata: '#C7C9C8', grafite: '#3F4347', pinhão: '#C9A66B',
  courino: '#3F4347', castanho: '#5E4632', couro: '#B07A4B',
  caramelo: '#B07A4B', palha: '#D9C9A3',
}

export function swatchColor(label: string): string {
  const l = label.toLowerCase()
  for (const k in SWATCH) if (l.includes(k)) return SWATCH[k]
  return '#C49B83'
}
