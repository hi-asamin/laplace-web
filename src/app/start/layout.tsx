import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'シミュレーションを始める | Laplace - 資産シミュレーター',
  description:
    'あなたの投資スタイルに合わせてシミュレーションを開始。積立NISA、目標金額設定、人気銘柄から選んで将来の資産形成をワンクリックで試算できます。',
  keywords:
    'NISA, 資産シミュレーション, 投資, 資産形成, 将来設計, ETF, インデックスファンド, 投資信託, つみたてNISA',
  openGraph: {
    title: 'シミュレーションを始める | Laplace - 資産シミュレーター',
    description:
      'あなたの投資スタイルに合わせてシミュレーションを開始。積立NISA、目標金額設定、人気銘柄から選んで将来の資産形成をワンクリックで試算。',
    siteName: 'Laplace - 資産シミュレーター',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'シミュレーションを始める | Laplace - 資産シミュレーター',
    description:
      'あなたの投資スタイルに合わせてシミュレーションを開始。積立NISA、目標金額設定、人気銘柄から選んで将来の資産形成をワンクリックで試算。',
  },
};

export default function StartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
