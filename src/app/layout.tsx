import type { Metadata } from 'next'
import '../index.css'
import '../App.css'

export const metadata: Metadata = {
  title: 'Tasukuru',
  description: 'Tasukuru web application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
