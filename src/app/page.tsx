import { Metadata } from 'next';
import Link from 'next/link';
import {
  TrendingUp,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  PieChart,
  Calendar,
  Play,
  Star,
  TrendingDown,
  Building2,
  Sprout,
} from 'lucide-react';

// クライアントコンポーネントのインポート
import {
  HeroImage,
  InflationComparisonVisual,
  OneClickExperienceSection,
  LandingPageClientFeatures,
} from '@/components/LandingPageClient';
import NavigationClient from '@/components/NavigationClient';

import {
  AutoInputDemo,
  ScenarioComparisonDemo,
  RiskVisualizationDemo,
} from '@/components/FeatureDemoCharts';

// SEO メタデータ
export const metadata: Metadata = {
  title: 'Laplace - その積立設定、最適ですか？｜資産シミュレーター',
  description:
    'NISAや投資信託のシミュレーションを簡単に。ワンクリック自動入力でシナリオ比較、将来の配当キャッシュフローまで可視化。初心者でも迷わない資産形成ツール。',
  keywords:
    'NISA, 投資信託, 資産シミュレーション, 配当, 株式投資, ETF, インデックスファンド, 積立投資, 資産形成, 金融リテラシー, 投資教育, つみたてNISA, iDeCo, 資産運用',
  authors: [{ name: 'Laplace', url: 'https://laplace.jp' }],
  creator: 'Laplace',
  publisher: 'Laplace',
  category: 'Finance',
  classification: 'FinTech',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  metadataBase: new URL('https://laplace.jp'),
  alternates: {
    canonical: '/',
    languages: {
      'ja-JP': '/',
    },
  },
  openGraph: {
    title: 'Laplace - その積立設定、最適ですか？｜初心者向け資産シミュレーター',
    description:
      'NISAや投資信託のシミュレーションを簡単に。ワンクリック自動入力でシナリオ比較、将来の配当キャッシュフローまで可視化。投資初心者でも迷わない資産形成ツール。',
    url: 'https://laplace.jp',
    siteName: 'Laplace - 資産シミュレーター',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Laplace - 資産シミュレーター | NISA・投資信託の将来シミュレーション',
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 600,
        height: 600,
        alt: 'Laplace - 資産シミュレーター',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@laplace_jp',
    creator: '@laplace_jp',
    title: 'Laplace - その積立設定、最適ですか？｜初心者向け資産シミュレーター',
    description:
      'NISAや投資信託のシミュレーションを簡単に。ワンクリック自動入力でシナリオ比較、将来の配当キャッシュフローまで可視化。',
    images: {
      url: '/og-image.png',
      alt: 'Laplace - 資産シミュレーター | NISA・投資信託の将来シミュレーション',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Laplace',
    'application-name': 'Laplace',
    'msapplication-TileColor': '#00d4a1',
    'theme-color': '#00d4a1',
  },
};

// 構造化データ
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Laplace',
  alternateName: 'ラプラス',
  description: '初心者でもワンクリックで意味のある将来比較ができる唯一の資産シミュレーター',
  url: 'https://laplace.jp',
  applicationCategory: 'FinanceApplication',
  applicationSubCategory: 'Investment Simulator',
  operatingSystem: 'Web',
  browserRequirements: 'HTML5, CSS3, JavaScript',
  permissions: 'free',
  softwareVersion: '1.0.0',
  featureList: [
    'NISA積立シミュレーション',
    'ワンクリック自動データ入力',
    'シナリオ横並び比較',
    'リスク可視化',
    'モンテカルロシミュレーション',
    '配当キャッシュフロー分析',
  ],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
    availability: 'https://schema.org/InStock',
    eligibleRegion: 'JP',
    category: 'Free',
  },
  author: {
    '@type': 'Organization',
    name: 'Laplace',
    url: 'https://laplace.jp',
    sameAs: ['https://twitter.com/laplace_jp'],
  },
  publisher: {
    '@type': 'Organization',
    name: 'Laplace',
    url: 'https://laplace.jp',
  },
  datePublished: '2024-01-01',
  dateModified: new Date().toISOString(),
  inLanguage: 'ja-JP',
  isAccessibleForFree: true,
  keywords: [
    'NISA',
    '資産シミュレーション',
    '投資',
    '資産形成',
    '初心者',
    'ETF',
    'インデックスファンド',
  ],
  audience: {
    '@type': 'Audience',
    audienceType: '投資初心者',
    geographicArea: 'Japan',
  },
  about: [
    {
      '@type': 'Thing',
      name: 'NISA',
      description: '少額投資非課税制度',
    },
    {
      '@type': 'Thing',
      name: '資産形成',
      description: '長期的な資産運用による財産形成',
    },
    {
      '@type': 'Thing',
      name: 'ETF',
      description: '上場投資信託',
    },
  ],
};

// FAQ構造化データ
const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '利用料金はかかりますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '完全無料でご利用いただけます。登録も不要で、すべての機能を無料でお使いいただけます。',
      },
    },
    {
      '@type': 'Question',
      name: '投資の知識がなくても使えますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい。初心者の方でも簡単にシミュレーションができるよう設計されています。銘柄を選ぶだけで、必要なデータは自動で入力されます。',
      },
    },
    {
      '@type': 'Question',
      name: 'データの精度はどの程度ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '複数のデータソースから最新の市場データを取得し、高い精度を保っています。株価、配当、PER/PBRなどの指標をリアルタイムで更新しています。',
      },
    },
    {
      '@type': 'Question',
      name: 'NISAのシミュレーションはできますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい。つみたてNISAや一般NISAでの積立投資、一括投資のシミュレーションが可能です。非課税効果も含めて将来の資産額を計算できます。',
      },
    },
    {
      '@type': 'Question',
      name: 'どのような投資商品に対応していますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '米国株、日本株、ETF、投資信託など幅広い投資商品に対応しています。人気のS&P500連動ETFや高配当ETFなども簡単にシミュレーションできます。',
      },
    },
  ],
};

// パンくずリスト構造化データ
const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'ホーム',
      item: 'https://laplace.jp',
    },
  ],
};

// 静的データ定義
const features = [
  {
    icon: Zap,
    title: 'ワンクリック自動入力',
    description: '銘柄を選択するだけで、株価・配当履歴・PER/PBRを自動取得',
    benefit: '面倒な入力はゼロに',
  },
  {
    icon: BarChart3,
    title: 'シナリオ横並び比較',
    description: 'カードUIで複数の投資シナリオを同時表示・比較',
    benefit: '投資の優劣が、一目でわかる',
  },
  {
    icon: Shield,
    title: 'リスクの可視化',
    description: 'モンテカルロシミュレーションで最悪ケースまで可視化',
    benefit: '最悪のケースまでわかるから、安心できる',
  },
];

const problems = [
  {
    icon: AlertCircle,
    title: '比較不能',
    description: '情報が多すぎて、結局何がベストかわからない',
  },
  {
    icon: PieChart,
    title: '判断不能',
    description: 'NISAの残り9割の枠をどう埋めるか決めきれない',
  },
  {
    icon: Calendar,
    title: '将来不安',
    description: 'このままで、10年後・20年後本当に大丈夫？',
  },
];

const benefits = [
  '漠然としたお金の不安から解放される',
  '自信を持って、自分だけの資産プランを描ける',
  '10年後の配当生活が、リアルに想像できる',
];

const faqItems = [
  {
    q: '利用料金はかかりますか？',
    a: '完全無料でご利用いただけます。',
  },
  {
    q: '投資の知識がなくても使えますか？',
    a: 'はい。初心者の方でも簡単にシミュレーションができるよう設計されています。',
  },
  {
    q: 'データの精度はどの程度ですか？',
    a: '複数のデータソースから最新の市場データを取得し、高い精度を保っています。',
  },
];

export default function LandingPage() {
  return (
    <>
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      {/* クライアント機能 */}
      <LandingPageClientFeatures />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Navigation */}
        <NavigationClient />

        {/* Hero Section */}
        <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="transition-all duration-1000 opacity-100 translate-y-0">
                <h1 className="text-5xl md:text-7xl font-bold text-[var(--color-lp-navy)] mb-6 font-[var(--font-poppins)]">
                  その積立設定、
                  <br />
                  <span className="text-[var(--color-lp-mint)]">最適</span>ですか？
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto font-[var(--font-noto-sans-jp)]">
                  資産形成を簡単に、
                  <span className="text-[var(--color-lp-blue)] font-semibold">"そして賢く"</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                  <Link
                    href="/markets/self/simulation"
                    className="bg-[var(--color-lp-mint)] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[var(--color-lp-mint)]/90 transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    無料でシミュレーションを始める
                  </Link>
                  <p className="text-sm text-slate-500">✓ 登録不要 ✓ 1分で完了</p>
                </div>
              </div>

              {/* Hero Image - 新しいデバイスモックアップ */}
              <HeroImage />
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 bg-[var(--color-lp-off-white)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-lp-navy)] mb-6 font-[var(--font-poppins)]">
                NISAを始めたものの...
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                20〜40代のNISAユーザーが抱える3つの"もやもや"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {problems.map((problem, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                      <problem.icon className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-lp-navy)] mb-4">
                      {problem.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{problem.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-3 bg-white rounded-full px-8 py-4 shadow-lg">
                <PieChart className="w-6 h-6 text-[var(--color-lp-blue)]" />
                <span className="text-[var(--color-lp-navy)] font-semibold">
                  NISA非課税枠の<span className="text-[var(--color-lp-mint)] text-xl">88%</span>
                  が未使用
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-lp-navy)] mb-6 font-[var(--font-poppins)]">
                <span className="text-red-500">"わからない"</span>を<br />
                <span className="text-[var(--color-lp-mint)]">"わかる"</span>に変える
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">Laplaceの3つの体験</p>
            </div>

            <div className="space-y-16">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-[var(--color-lp-mint)]/10 rounded-2xl flex items-center justify-center">
                        <feature.icon className="w-8 h-8 text-[var(--color-lp-mint)]" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-[var(--color-lp-navy)] font-[var(--font-poppins)]">
                          {feature.title}
                        </h3>
                        <p className="text-[var(--color-lp-blue)] font-semibold text-lg">
                          → {feature.benefit}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gradient-to-br from-[var(--color-lp-mint)]/5 to-[var(--color-lp-blue)]/5 rounded-3xl p-8 border border-slate-200">
                      {/* 機能別デモコンポーネント */}
                      {index === 0 && <AutoInputDemo />}
                      {index === 1 && <ScenarioComparisonDemo />}
                      {index === 2 && <RiskVisualizationDemo />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* One Click Experience Section */}
        <OneClickExperienceSection />

        {/* Benefit Section */}
        <section
          id="benefits"
          className="py-20 bg-gradient-to-br from-[var(--color-lp-navy)] to-[var(--color-lp-blue)] text-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-[var(--font-poppins)]">
                Laplaceで変わる
                <br />
                あなたの<span className="text-[var(--color-lp-mint)]">未来</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300"
                >
                  <CheckCircle className="w-12 h-12 text-[var(--color-lp-mint)] mx-auto mb-6" />
                  <p className="text-lg leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4">
                <Star className="w-6 h-6 text-[var(--color-lp-mint)]" />
                <span className="text-lg">
                  自信を持って、
                  <span className="text-[var(--color-lp-mint)] font-bold">
                    自分だけの資産プラン
                  </span>
                  を描ける
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Now Section */}
        <section className="py-20 bg-[var(--color-lp-off-white)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-lp-navy)] mb-6 font-[var(--font-poppins)]">
                なぜ<span className="text-[var(--color-lp-mint)]">今</span>なのか？
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">今、行動すべき3つの理由</p>
            </div>

            {/* 上段：NISA拡大と非課税枠の統計 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold text-[var(--color-lp-mint)] mb-2">+235%</div>
                <div className="text-lg font-semibold text-[var(--color-lp-navy)] mb-4">
                  NISA拡大
                </div>
                <p className="text-slate-600">年間買付額の増加</p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold text-[var(--color-lp-mint)] mb-2">88%</div>
                <div className="text-lg font-semibold text-[var(--color-lp-navy)] mb-4">
                  非課税枠
                </div>
                <p className="text-slate-600">が未使用のまま</p>
              </div>
            </div>

            {/* メイン：インフレ対抗比較ビジュアル */}
            <InflationComparisonVisual />

            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--color-lp-mint)] to-[var(--color-lp-blue)] text-white rounded-full px-8 py-4 shadow-lg">
                <TrendingUp className="w-6 h-6" />
                <span className="font-semibold">
                  現金は毎年<span className="text-xl">2.5%</span>目減りしています
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-lp-navy)] mb-6 font-[var(--font-poppins)]">
                よくある質問
              </h2>
            </div>

            <div className="space-y-6">
              {faqItems.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-[var(--color-lp-navy)] mb-3">
                    Q. {faq.q}
                  </h3>
                  <p className="text-slate-600">A. {faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-[var(--color-lp-mint)] to-[var(--color-lp-blue)] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 font-[var(--font-poppins)]">
              さあ、あなたの
              <br />
              <span className="text-yellow-300">未来</span>を、見に行こう。
            </h2>
            <p className="text-xl mb-8 opacity-90">ワンクリックで始める、新しい資産形成体験</p>
            <Link
              href="/markets/self/simulation"
              className="inline-flex items-center gap-3 bg-white text-[var(--color-lp-navy)] px-10 py-5 rounded-full text-xl font-bold hover:bg-slate-100 transition-all hover:scale-105 shadow-2xl"
            >
              <Play className="w-6 h-6" />
              無料でシミュレーションを始める
              <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="text-sm mt-4 opacity-75">✓ 登録不要 ✓ 1分で完了</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[var(--color-lp-navy)] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-4 font-[var(--font-poppins)]">Laplace</div>
              <p className="text-slate-300 max-w-2xl mx-auto mb-8">
                初心者でもワンクリックで"意味のある"将来比較ができる唯一の資産シミュレーター
              </p>
              <div className="border-t border-slate-700 pt-8">
                <p className="text-slate-400 text-sm">© 2024 Laplace. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
