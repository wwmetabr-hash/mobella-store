import type { Metadata } from 'next'
import { Archivo_Narrow, Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/lib/cart'

const archivoNarrow = Archivo_Narrow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const FAVICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0U1RERENCIvPjx0ZXh0IHg9IjUwIiB5PSI0NiIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzgiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiMyQjMyNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGxldHRlci1zcGFjaW5nPSItMSI+bW88L3RleHQ+PHRleHQgeD0iNTEiIHk9IjgwIiBmb250LWZhbWlseT0iR2VvcmdpYSxzZXJpZiIgZm9udC1zaXplPSIzMSIgZm9udC1zdHlsZT0iaXRhbGljIiBmaWxsPSIjQzA4OTY4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5iZWxsYS48L3RleHQ+PC9zdmc+'

export const metadata: Metadata = {
  title: 'Mobella — Móveis feitos em Curitiba',
  description: 'Poltronas, cadeiras e sofás feitos e entregues em Curitiba, PR. Conforto real, design honesto.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivoNarrow.variable} ${cormorant.variable} ${inter.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href={FAVICON} />
        <link rel="shortcut icon" href={FAVICON} />
        <link rel="apple-touch-icon" href={FAVICON} />
      </head>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
