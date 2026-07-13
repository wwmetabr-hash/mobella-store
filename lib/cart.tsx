'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type CartItem = {
  id: string
  name: string
  price: number
  unit: string | null
  photo: string
  color: string
  qty: number
}

type CartCtx = {
  items: CartItem[]
  add: (item: Omit<CartItem, 'qty'>) => void
  remove: (id: string) => void
  update: (id: string, qty: number) => void
  clear: () => void
  total: number
  count: number
}

const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mobella:cart')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('mobella:cart', JSON.stringify(items))
  }, [items])

  function add(item: Omit<CartItem, 'qty'>) {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id && i.color === item.color)
      if (existing) {
        return prev.map(i => i.id === item.id && i.color === item.color
          ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  function remove(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function update(id: string, qty: number) {
    if (qty < 1) return
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  function clear() { setItems([]) }

  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)

  return <Ctx.Provider value={{ items, add, remove, update, clear, total, count }}>{children}</Ctx.Provider>
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
