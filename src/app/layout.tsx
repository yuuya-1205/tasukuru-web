import type { Metadata } from 'next'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import '../index.css'
import '../App.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <ul>
          <li>
            <li><a href="/">ホーム</a></li>
            <li><a href="/form">入力フォーム</a></li>
          </li>
        </ul>
        {children}
      </body>
    </html>
  )
}
