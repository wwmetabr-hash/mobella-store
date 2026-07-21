import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

const ACCESS_TOKEN = (process.env.MP_ACCESS_TOKEN || '').replace(/^﻿/, '').trim()

export async function POST(req: NextRequest) {
  if (!ACCESS_TOKEN) {
    return NextResponse.json({ error: 'MP_ACCESS_TOKEN não configurado.' }, { status: 500 })
  }

  const body = await req.json()

  const r = await fetch('https://api.mercadopago.com/v1/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'X-Idempotency-Key': randomUUID(),
    },
    body: JSON.stringify(body),
  })

  const data = await r.json()

  if (!r.ok) {
    console.error('MP payment error:', data)
    return NextResponse.json({ error: data.message || 'Erro ao processar pagamento.' }, { status: r.status })
  }

  return NextResponse.json({ status: data.status, id: data.id })
}
