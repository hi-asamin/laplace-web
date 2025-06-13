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
  title: 'Laplace - 資産シミュレーション | ワンクリックで未来の最適解を',
  description:
    'そのNISA、最適ですか？ワンクリックで意味のある将来比較ができる唯一の資産シミュレーター。自動データ入力・シナリオ比較・リスク可視化で、あなたの資産形成をサポート。',
  keywords: 'NISA, 資産シミュレーション, 投資, 資産形成, 将来設計',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Laplace - 資産シミュレーション',
    description: 'ワンクリックで未来の最適解をシミュレーション',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'Laplace',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Laplace - 資産シミュレーション',
    description: 'ワンクリックで未来の最適解をシミュレーション',
  },
  robots: {
    index: true,
    follow: true,
  },
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
