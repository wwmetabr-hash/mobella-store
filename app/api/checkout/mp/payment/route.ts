import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

const ACCESS_TOKEN = (process.env.MP_ACCESS_TOKEN || '').replace(/^﻿/, '').trim()

async function mpPost(payload: Record<string, unknown>) {
  const r = await fetch('https://api.mercadopago.com/v1/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'X-Idempotency-Key': randomUUID(),
    },
    body: JSON.stringify(payload),
  })
  return { r, data: await r.json() }
}

export async function POST(req: NextRequest) {
  if (!ACCESS_TOKEN) {
    return NextResponse.json({ error: 'MP_ACCESS_TOKEN não configurado.' }, { status: 500 })
  }

  const body = await req.json()

  // ── Pix direto (sem brick) ─────────────────────────────────────────────────
  if (body.method === 'pix') {
    const { r, data } = await mpPost({
      transaction_amount: body.amount,
      payment_method_id: 'pix',
      payer: { email: body.email },
    })

    if (!r.ok) {
      const msg = data?.cause?.[0]?.description || data?.message || 'Erro ao gerar Pix.'
      return NextResponse.json({ error: msg }, { status: r.status })
    }

    const td = data.point_of_interaction?.transaction_data
    return NextResponse.json({
      status: data.status,
      id: data.id,
      pixQrCode: td?.qr_code,
      pixQrBase64: td?.qr_code_base64,
    })
  }

  // ── Boleto direto ──────────────────────────────────────────────────────────
  if (body.method === 'boleto') {
    const { r, data } = await mpPost({
      transaction_amount: body.amount,
      payment_method_id: 'bolbradesco',
      payer: {
        email: body.email,
        first_name: body.firstName || 'Cliente',
        last_name: body.lastName || 'Mobella',
        identification: { type: 'CPF', number: body.cpf?.replace(/\D/g, '') || '00000000000' },
      },
    })

    if (!r.ok) {
      const msg = data?.cause?.[0]?.description || data?.message || 'Erro ao gerar boleto.'
      return NextResponse.json({ error: msg }, { status: r.status })
    }

    return NextResponse.json({
      status: data.status,
      id: data.id,
      boletoUrl: data.transaction_details?.external_resource_url,
    })
  }

  // ── Cartão via brick ───────────────────────────────────────────────────────
  const { formData: brickFormData, amount } = body
  const payload = { ...brickFormData, transaction_amount: amount }

  const { r, data } = await mpPost(payload)

  if (!r.ok) {
    const msg = data?.cause?.[0]?.description || data?.message || 'Pagamento não aprovado.'
    return NextResponse.json({ error: msg }, { status: r.status })
  }

  return NextResponse.json({ status: data.status, id: data.id })
}
