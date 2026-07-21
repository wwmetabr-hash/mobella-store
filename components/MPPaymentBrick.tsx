'use client'

import { initMercadoPago, Payment } from '@mercadopago/sdk-react'

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || 'APP_USR-618bdf41-26ec-475a-9c22-9612d1398f9b'

initMercadoPago(PUBLIC_KEY, { locale: 'pt-BR' })

type PixData = { qrCode: string; qrBase64: string }

type Props = {
  preferenceId: string
  amount: number
  onSuccess: () => void
  onPix: (data: PixData) => void
  onError: (msg: string) => void
}

export default function MPPaymentBrick({ preferenceId, amount, onSuccess, onPix, onError }: Props) {
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
        // param = { selectedPaymentMethod, formData, paymentType }
        const { selectedPaymentMethod, formData: brickFormData, paymentType } = param ?? {}

        const r = await fetch('/api/checkout/mp/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            selectedPaymentMethod,
            formData: brickFormData,
            paymentType,
            amount,
          }),
        })

        const data = await r.json()

        if (!r.ok) throw new Error(data.error || 'Erro ao processar pagamento.')

        if (data.pixQrCode) {
          onPix({ qrCode: data.pixQrCode, qrBase64: data.pixQrBase64 })
        } else if (data.status === 'approved') {
          onSuccess()
        } else if (data.status === 'pending' || data.status === 'in_process') {
          window.location.href = '/pagamento-pendente'
        } else {
          throw new Error('Pagamento não aprovado. Verifique os dados e tente novamente.')
        }
      }}
      onError={(err) => {
        console.error('MP Brick error:', err)
        onError('Erro no formulário de pagamento. Recarregue a página e tente novamente.')
      }}
    />
  )
}
