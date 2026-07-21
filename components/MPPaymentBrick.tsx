'use client'

import { initMercadoPago, Payment } from '@mercadopago/sdk-react'

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || 'APP_USR-618bdf41-26ec-475a-9c22-9612d1398f9b'

initMercadoPago(PUBLIC_KEY, { locale: 'pt-BR' })

type Props = {
  preferenceId: string
  amount: number
  onSuccess: () => void
  onError: (msg: string) => void
}

export default function MPCardBrick({ preferenceId, amount, onSuccess, onError }: Props) {
  return (
    <Payment
      initialization={{ amount, preferenceId }}
      customization={{
        paymentMethods: {
          creditCard: 'all',
          debitCard: 'all',
          // Pix e boleto tratados separadamente — sem brick
          bankTransfer: 'none' as never,
          ticket: 'none' as never,
          mercadoPago: 'none' as never,
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
        // Brick card: param é IPaymentFormData diretamente (token, installments, etc.)
        const formData = param?.formData ?? param

        const r = await fetch('/api/checkout/mp/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ method: 'card', formData, amount }),
        })

        const data = await r.json()
        if (!r.ok) throw new Error(data.error || 'Pagamento não aprovado.')

        if (data.status === 'approved') {
          onSuccess()
        } else if (data.status === 'pending' || data.status === 'in_process') {
          window.location.href = '/pagamento-pendente'
        } else {
          throw new Error('Pagamento não aprovado. Tente novamente ou use outro cartão.')
        }
      }}
      onError={(err) => {
        console.error('MP Brick error:', err)
        onError('Erro no cartão. Verifique os dados e tente novamente.')
      }}
    />
  )
}
