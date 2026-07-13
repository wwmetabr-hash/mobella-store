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

const PRODUCTS_PATH   = path.join(process.cwd(), 'data', 'products.json')
const CATEGORIES_PATH = path.join(process.cwd(), 'data', 'categories.json')

export function getAllProducts(): Product[] {
  return JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf-8'))
}

export function getActiveProducts(): Product[] {
  return getAllProducts().filter(p => p.active)
}

export function getProduct(id: string): Product | undefined {
  return getAllProducts().find(p => p.id === id)
}

export function saveProducts(products: Product[]): void {
  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2), 'utf-8')
}

export function getAllCategories(): Category[] {
  try {
    return JSON.parse(fs.readFileSync(CATEGORIES_PATH, 'utf-8'))
  } catch {
    return []
  }
}

export function saveCategories(cats: Category[]): void {
  fs.writeFileSync(CATEGORIES_PATH, JSON.stringify(cats, null, 2), 'utf-8')
}

export function getOrderedCategories(): Category[] {
  const stored = getAllCategories()
  const products = getActiveProducts()
  const unique = [...new Set(products.map(p => p.cat))]
  // merge stored + any new cats from products not yet in file
  const result: Category[] = [...stored]
  unique.forEach(cat => {
    if (!result.find(c => c.id === cat)) {
      result.push({ id: cat, label: cat + 's', slug: cat.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/\s+/g, '-'), order: result.length + 1 })
    }
  })
  return result.sort((a, b) => a.order - b.order)
}

export function formatPrice(price: number): string {
  return 'R$ ' + price.toLocaleString('pt-BR', {
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2
  })
}

export const SWATCH: Record<string, string> = {
  bege: '#DFD9CD', cinza: '#7A848C', capuccino: '#9C7A5C',
  marrom: '#6E4A38', vermelho: '#9B3B32', nozes: '#7A5230',
  whisky: '#A77961', linho: '#DFD9CD', veludo: '#8C7A66',
  prata: '#C7C9C8', grafite: '#3F4347', pinhão: '#C9A66B',
  courino: '#3F4347', castanho: '#5E4632', couro: '#B07A4B',
  caramelo: '#B07A4B', palha: '#D9C9A3'
}

export function swatchColor(label: string): string {
  const l = label.toLowerCase()
  for (const k in SWATCH) if (l.includes(k)) return SWATCH[k]
  return '#C49B83'
}
