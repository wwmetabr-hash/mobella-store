'use client'

import { useEffect } from 'react'
import { initMercadoPago, Payment } from '@mercadopago/sdk-react'

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || 'APP_USR-618bdf41-26ec-475a-9c22-9612d1398f9b'

initMercadoPago(PUBLIC_KEY, { locale: 'pt-BR' })

type Props = {
  preferenceId: string
  amount: number
  onSuccess: () => void
  onError: (msg: string) => void
}

export default function MPPaymentBrick({ preferenceId, amount, onSuccess, onError }: Props) {
  return (
    <Payment
      initialization={{ amount, preferenceId }}
      customization={{
        paymentMethods: {
          creditCard: 'all',
          debitCard: 'all',
          ticket: 'all',
          bankTransfer: 'all',
          mercadoPago: 'all',
        },
        visual: {
          style: {
            theme: 'flat',
            customVariables: {
              formBackgroundColor: '#FAFAF7',
              baseColor: '#2C5F2E',
              baseColorSecondVariant: '#C17F4A',
            },
          },
        },
      }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubmit={async (param: any) => {
        const formData = param?.formData ?? param
        const r = await fetch('/api/checkout/mp/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const data = await r.json()
        if (!r.ok) {
          onError(data.error || 'Erro ao processar pagamento.')
          return
        }
        if (data.status === 'approved') {
          onSuccess()
        } else if (data.status === 'pending' || data.status === 'in_process') {
          window.location.href = '/pagamento-pendente'
        } else {
          onError('Pagamento não aprovado. Tente outro método.')
        }
      }}
      onError={(err) => {
        console.error('MP Brick error:', err)
        onError('Erro no formulário de pagamento.')
      }}
    />
  )
}
