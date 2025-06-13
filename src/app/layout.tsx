import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Inter, Poppins, Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import AnalyticsProvider from '@/components/AnalyticsProvider';

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-jp',
});

export const metadata: Metadata = {
  title: {
    default: 'Laplace - 資産シミュレーター | 初心者向けNISA・投資信託シミュレーション',
    template: '%s | Laplace - 資産シミュレーター',
  },
  description:
    'NISAや投資信託のシミュレーションを簡単に。ワンクリック自動入力でシナリオ比較、将来の配当キャッシュフローまで可視化。投資初心者でも迷わない資産形成ツール。',
  keywords:
    'NISA, 資産シミュレーション, 投資, 資産形成, 将来設計, ETF, インデックスファンド, 投資信託, つみたてNISA, iDeCo',
  authors: [{ name: 'Laplace', url: 'https://laplace.jp' }],
  creator: 'Laplace',
  publisher: 'Laplace',
  manifest: '/manifest.json',
  metadataBase: new URL('https://laplace.jp'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Laplace - 資産シミュレーター | 初心者向けNISA・投資信託シミュレーション',
    description:
      'NISAや投資信託のシミュレーションを簡単に。ワンクリック自動入力でシナリオ比較、将来の配当キャッシュフローまで可視化。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'Laplace - 資産シミュレーター',
    url: 'https://laplace.jp',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@laplace_jp',
    creator: '@laplace_jp',
    title: 'Laplace - 資産シミュレーター | 初心者向けNISA・投資信託シミュレーション',
    description:
      'NISAや投資信託のシミュレーションを簡単に。ワンクリック自動入力でシナリオ比較、将来の配当キャッシュフローまで可視化。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'Finance',
  classification: 'FinTech',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#00d4a1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${poppins.variable} ${notoSansJP.variable}`}>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PZRNRCGV');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <Suspense>
          <AnalyticsProvider>
            {/* Google Tag Manager (noscript) */}
            <noscript
              dangerouslySetInnerHTML={{
                __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PZRNRCGV"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
              }}
            />
            {/* End Google Tag Manager (noscript) */}
            {children}
          </AnalyticsProvider>
        </Suspense>
      </body>
    </html>
  );
}
