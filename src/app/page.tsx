import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '最初のページ',
  description: 'playwrightハンズオンの最初のステップ',
}

export default function Home() {
  return <main>
    <h1>playwrightハンズオン</h1>
    <p>あなたは1週間後にはE2Eテストを書けるようになります</p>
    <p>
      <button>操作ボタン</button>
    </p>

  </main>
}