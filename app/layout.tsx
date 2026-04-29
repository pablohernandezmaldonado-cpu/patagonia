import type { Metadata } from 'next'
import { Montserrat, Merriweather } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/news/ThemeProvider'
import WhatsAppButton from '@/components/news/WhatsAppButton'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-sans',
})
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700', '900'], variable: '--font-serif' })

export const metadata: Metadata = {
  title: 'Patagonia al Día – Noticias de la Región',
  description: 'El portal de noticias más actualizado de la Patagonia Chilena. Información regional, deportes y más desde Coyhaique, Aysén.',
  keywords: 'Patagonia, noticias, Aysén, Coyhaique, Chile, regional, deportes',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${merriweather.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider>
          {children}
          <WhatsAppButton />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
