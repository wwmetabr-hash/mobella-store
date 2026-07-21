import { NextRequest, NextResponse } from 'next/server'

const ACCESS_TOKEN = (process.env.MP_ACCESS_TOKEN || '').replace(/^﻿/, '').trim()
const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://mobellamoveis.com.br').replace(/^﻿/, '').trim()

export async function POST(req: NextRequest) {
  if (!ACCESS_TOKEN) {
    return NextResponse.json({ error: 'MP_ACCESS_TOKEN não configurado.' }, { status: 500 })
  }
  const body = await req.json()

  const preference = {
    items: body.items.map((item: { name: string; color?: string; qty: number; price: number }) => ({
      title: item.color ? `${item.name} — ${item.color}` : item.name,
      quantity: item.qty,
      unit_price: item.price,
      currency_id: 'BRL',
    })),
    ...(body.payer ? { payer: body.payer } : {}),
    back_urls: {
      success: `${BASE_URL}/obrigado`,
      failure: `${BASE_URL}/pagamento-cancelado`,
      pending: `${BASE_URL}/pagamento-pendente`,
    },
    auto_return: 'approved',
    statement_descriptor: 'MOBELLA MOVEIS',
    payment_methods: { installments: 12 },
  }

  const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify(preference),
  })

  const data = await r.json()

  if (!r.ok) {
    console.error('MP error:', data)
    return NextResponse.json({ error: 'Erro ao criar preferência de pagamento.' }, { status: r.status })
  }

  return NextResponse.json({
    id: data.id,
    init_point: data.init_point,
    sandbox_init_point: data.sandbox_init_point,
  })
}
