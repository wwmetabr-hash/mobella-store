import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

const ACCESS_TOKEN = (process.env.MP_ACCESS_TOKEN || '').replace(/^﻿/, '').trim()

export async function POST(req: NextRequest) {
  if (!ACCESS_TOKEN) {
    return NextResponse.json({ error: 'MP_ACCESS_TOKEN não configurado.' }, { status: 500 })
  }

  const body = await req.json()

  // Brick sends { selectedPaymentMethod, formData, paymentType, amount }
  const { selectedPaymentMethod, formData: brickFormData, amount } = body

  // Build the payload for MP /v1/payments
  const payload: Record<string, unknown> = {
    ...brickFormData,
    transaction_amount: amount,
  }

  // Pix: ensure correct payment_method_id
  if (selectedPaymentMethod === 'bank_transfer' || brickFormData?.payment_method_id === 'pix') {
    payload.payment_method_id = 'pix'
  }

  const r = await fetch('https://api.mercadopago.com/v1/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'X-Idempotency-Key': randomUUID(),
    },
    body: JSON.stringify(payload),
  })

  const data = await r.json()

  if (!r.ok) {
    console.error('MP payment error:', JSON.stringify(data))
    const msg = data?.cause?.[0]?.description || data?.message || 'Erro ao processar pagamento.'
    return NextResponse.json({ error: msg }, { status: r.status })
  }

  // For Pix, return QR code data
  if (data.payment_method_id === 'pix' && data.point_of_interaction?.transaction_data) {
    const td = data.point_of_interaction.transaction_data
    return NextResponse.json({
      status: data.status,
      id: data.id,
      pixQrCode: td.qr_code,
      pixQrBase64: td.qr_code_base64,
    })
  }

  return NextResponse.json({ status: data.status, id: data.id })
}
