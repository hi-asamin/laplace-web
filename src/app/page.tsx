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
  Eye,
  Target,
  Brain,
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
  PortfolioVisualizationDemo,
} from '@/components/FeatureDemoCharts';
import ThemeColorManager from '@/components/ThemeColorManager';

// SEO メタデータ
export const metadata: Metadata = {
  title: 'Laplace - あなたの投資の知的副操縦士｜ポートフォリオ管理・What-Ifシミュレーション',
  description:
    '投資中級者向けの知的副操縦士。保有資産を統合可視化し、What-Ifシミュレーションで将来の不確実性を戦略に変える。リバランス提案で「何をすべきか」が明確に。',
  keywords:
    'ポートフォリオ管理, 資産統合, What-Ifシミュレーション, リバランス, NISA, iDeCo, 投資中級者, 資産配分, 長期投資, 知的副操縦士',
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
    title: 'Laplace - あなたの投資の知的副操縦士｜ポートフォリオ管理・What-Ifシミュレーション',
    description:
      '投資中級者向けの知的副操縦士。保有資産を統合可視化し、What-Ifシミュレーションで将来の不確実性を戦略に変える。リバランス提案で「何をすべきか」が明確に。',
    url: 'https://laplace.jp',
    siteName: 'Laplace - 投資の知的副操縦士',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Laplace - 投資の知的副操縦士｜ポートフォリオ管理・What-Ifシミュレーション',
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 600,
        height: 600,
        alt: 'Laplace - 投資の知的副操縦士',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@laplace_jp',
    creator: '@laplace_jp',
    title: 'Laplace - あなたの投資の知的副操縦士｜ポートフォリオ管理・What-Ifシミュレーション',
    description:
      '投資中級者向けの知的副操縦士。保有資産を統合可視化し、What-Ifシミュレーションで将来の不確実性を戦略に変える。',
    images: {
      url: '/og-image.png',
      alt: 'Laplace - 投資の知的副操縦士｜ポートフォリオ管理・What-Ifシミュレーション',
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
  },
};

// 構造化データ
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Laplace',
  alternateName: 'ラプラス',
  description:
    '投資中級者向けの知的副操縦士。ポートフォリオ管理の複雑性を解決し、将来への不安を自信に変える。',
  url: 'https://laplace.jp',
  applicationCategory: 'FinanceApplication',
  applicationSubCategory: 'Portfolio Management',
  operatingSystem: 'Web',
  browserRequirements: 'HTML5, CSS3, JavaScript',
  permissions: 'free',
  softwareVersion: '1.0.0',
  featureList: [
    '統合ポートフォリオダッシュボード',
    'What-Ifシミュレーションエンジン',
    'リバランス・シミュレーター',
    'ゴールベース・プランニング',
    'ワンクリック自動データ入力',
    'シナリオ横並び比較',
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
    'ポートフォリオ管理',
    'What-Ifシミュレーション',
    'リバランス',
    '投資中級者',
    'NISA',
    'iDeCo',
    '資産配分',
  ],
  audience: {
    '@type': 'Audience',
    audienceType: '投資中級者',
    geographicArea: 'Japan',
  },
  about: [
    {
      '@type': 'Thing',
      name: 'ポートフォリオ管理',
      description: '保有資産を統合して管理する機能',
    },
    {
      '@type': 'Thing',
      name: 'What-Ifシミュレーション',
      description: '様々なシナリオでの将来予測機能',
    },
    {
      '@type': 'Thing',
      name: 'リバランス',
      description: '最適な資産配分への調整提案',
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
      name: '投資中級者向けとはどのような人ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'NISAやiDeCoなどで実際に資産運用を開始しているが、ポートフォリオの最適化や将来計画に課題を感じている30代〜50代の投資家の方々です。',
      },
    },
    {
      '@type': 'Question',
      name: 'What-Ifシミュレーションとは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '「もし積立額を増やしたら？」「もし市場が暴落したら？」といった様々な仮説を設定し、将来の資産額への影響をリアルタイムでシミュレーションできる機能です。',
      },
    },
    {
      '@type': 'Question',
      name: 'リバランス提案はどのようなものですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '目標とする資産配分と現在のポートフォリオを比較し、「どの銘柄をいくら売却し、何を購入すべきか」という具体的な売買アクションを提案します。',
      },
    },
    {
      '@type': 'Question',
      name: '分散した保有資産を統合できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい。証券会社、銀行、iDeCo、確定拠出年金など、分散した保有資産を一元管理できる統合ダッシュボードを提供します。',
      },
    },
    {
      '@type': 'Question',
      name: '利用料金はかかりますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '基本機能は完全無料でご利用いただけます。高度なシミュレーション機能は有料プランで提供予定です。',
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
    icon: Eye,
    title: 'ポートフォリオの完全な可視化',
    description:
      '分散した保有資産を統合し、あなただけの統合ダッシュボードを構築。全体像を一目で把握できます。',
    benefit: '不安を「自信」へ変える',
    valueProposition:
      '銀行、証券、iDeCo、DC口座の保有資産を自動で一元管理し、「全体を把握できている」というコントロール感と安心感を提供します。',
  },
  {
    icon: Brain,
    title: 'インタラクティブな未来予測',
    description:
      'What-Ifシミュレーションエンジンで、様々なシナリオを試せます。「もし市場が暴落したら？」「積立額を増やしたら？」といった疑問に答えます。',
    benefit: '不確実性を「戦略」へ変える',
    valueProposition:
      '将来の不確実性を恐れる対象から、戦略を立てるための「サンドボックス」へと変えます。',
  },
  {
    icon: Target,
    title: '実行可能なアクションプラン',
    description:
      '目標ポートフォリオに基づき、次に取るべき具体的なアクションを提案。「何をすべきか」が明確になります。',
    benefit: '躊躇を「次の一手」へ変える',
    valueProposition: '複雑な意思決定プロセスを肩代わりし、自信を持って次の一歩を踏み出せます。',
  },
];

const problems = [
  {
    icon: AlertCircle,
    title: '「これで合っているのか？」という不安',
    description: '現在の資産配分が自分のリスク許容度やライフプランに対して最適なのか自信がない',
    detail: '分散した保有資産により、全体像の把握に手間がかかる',
  },
  {
    icon: PieChart,
    title: 'リバランスの躊躇',
    description: '市場変動時にリバランスすべきとわかっていても、具体的な行動に移せない',
    detail: '「いつ、何を、どれくらい売買すれば良いのか」がわからない',
  },
  {
    icon: TrendingDown,
    title: '将来の不確実性への不安',
    description: '「もし大暴落が来たら？」「もう少し積極的にリスクを取ったら？」',
    detail: 'シナリオを具体的にイメージできず、不安が増している',
  },
];

const benefits = [
  '保有資産の状況を一目で把握し、コントロール感を得る',
  '様々なシナリオを事前に体験し、市場変動時も冷静に対応できる',
  '具体的なアクションプランで、自信を持って次の一歩を踏み出せる',
];

const faqItems = [
  {
    q: '投資中級者向けとはどのような人ですか？',
    a: 'NISAやiDeCoなどで実際に資産運用を開始しているが、ポートフォリオの最適化や将来計画に課題を感じている30代〜50代の投資家の方々です。',
  },
  {
    q: 'What-Ifシミュレーションとは何ですか？',
    a: '「もし積立額を増やしたら？」「もし市場が暴落したら？」といった様々な仮説を設定し、将来の資産額への影響をリアルタイムでシミュレーションできる機能です。',
  },
  {
    q: 'リバランス提案はどのようなものですか？',
    a: '目標とする資産配分と現在のポートフォリオを比較し、「どの銘柄をいくら売却し、何を購入すべきか」という具体的な売買アクションを提案します。',
  },
  {
    q: '分散した保有資産を統合できますか？',
    a: 'はい。証券会社、銀行、iDeCo、確定拠出年金など、分散した保有資産を一元管理できる統合ダッシュボードを提供します。',
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

      {/* テーマカラー管理 */}
      <ThemeColorManager />

      {/* クライアント機能 */}
      <LandingPageClientFeatures />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[var(--color-surface-1)] dark:to-[var(--color-surface-2)]">
        {/* Navigation */}
        <NavigationClient />

        {/* Hero Section */}
        <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="transition-all duration-1000 opacity-100 translate-y-0">
                <div className="inline-flex items-center gap-2 bg-[var(--color-lp-mint)]/10 text-[var(--color-lp-mint)] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <Brain className="w-4 h-4" />
                  あなたの投資の知的副操縦士
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-6 font-[var(--font-poppins)]">
                  <span className="text-[var(--color-lp-mint)]">自信を持って</span>、
                  <br />
                  投資を続けよう。
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 dark:text-[var(--color-text-secondary)] mb-8 max-w-3xl mx-auto font-[var(--font-noto-sans-jp)]">
                  ポートフォリオ管理の複雑性を解決し、
                  <br />
                  <span className="text-[var(--color-lp-blue)] dark:text-[var(--color-lp-blue)] font-semibold">
                    将来への不安を戦略に変える
                  </span>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                  <Link
                    href="/start"
                    className="bg-[var(--color-lp-mint)] text-white dark:text-slate-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-[var(--color-lp-mint)]/90 transition-all hover:scale-105 flex items-center gap-2 shadow-xl dark:shadow-[0_20px_25px_-5px_rgba(0,255,196,0.3)]"
                  >
                    <Play className="w-5 h-5" />
                    無料で統合ダッシュボードを試す
                  </Link>
                  <p className="text-sm text-slate-500 dark:text-[var(--color-text-muted)]">
                    ✓ 登録不要 ✓ 資産一元管理
                  </p>
                </div>
              </div>

              {/* Hero Image - 新しいデバイスモックアップ */}
              <HeroImage />
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 bg-[var(--color-lp-off-white)] dark:bg-[var(--color-surface-2)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-6 font-[var(--font-poppins)]">
                投資中級者が抱える
                <br />
                <span className="text-red-500 dark:text-red-400">3つの悩み</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                NISAやiDeCoを始めたものの、次のステップで立ち止まっていませんか？
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {problems.map((problem, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-[var(--color-surface-1)] rounded-2xl p-8 shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] hover:shadow-xl dark:hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105 border dark:border-[var(--color-surface-3)]"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                      <problem.icon className="w-8 h-8 text-red-500 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-4">
                      {problem.title}
                    </h3>
                    <p className="text-slate-600 dark:text-[var(--color-text-secondary)] leading-relaxed mb-4">
                      {problem.description}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-[var(--color-text-muted)] leading-relaxed">
                      {problem.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-3 bg-white dark:bg-[var(--color-surface-1)] rounded-full px-8 py-4 shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)]">
                <Building2 className="w-6 h-6 text-[var(--color-lp-blue)]" />
                <span className="text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] font-semibold">
                  分散した保有資産の
                  <span className="text-[var(--color-lp-mint)] text-xl">全体像</span>
                  が見えない
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-6 font-[var(--font-poppins)]">
                Laplaceの
                <br />
                <span className="text-[var(--color-lp-mint)]">4つの価値</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                あなたの投資の知的副操縦士として、意思決定を力づけます
              </p>
            </div>

            <div className="space-y-16">
              {/* ワンクリック自動入力 */}
              <div className="bg-gradient-to-br from-[var(--color-lp-mint)]/5 to-[var(--color-lp-blue)]/5 rounded-3xl p-8 border border-slate-200 dark:border-[var(--color-surface-3)]">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-[var(--color-lp-mint)]/10 rounded-2xl flex items-center justify-center">
                        <Zap className="w-8 h-8 text-[var(--color-lp-mint)]" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] font-[var(--font-poppins)]">
                          ワンクリック自動入力
                        </h3>
                        <p className="text-[var(--color-lp-blue)] dark:text-[var(--color-lp-blue)] font-semibold text-lg">
                          → 面倒な入力はゼロに
                        </p>
                      </div>
                    </div>
                    <p className="text-lg text-slate-600 dark:text-[var(--color-text-secondary)] leading-relaxed">
                      銘柄を選択するだけで、株価・配当履歴・PER/PBRを自動取得。
                      API冗長化により、データ欠損時も自動フェイルオーバーで完結。
                    </p>
                  </div>
                  <div className="flex-1">
                    <AutoInputDemo />
                  </div>
                </div>
              </div>

              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-[var(--color-lp-mint)]/10 rounded-2xl flex items-center justify-center">
                        <feature.icon className="w-8 h-8 text-[var(--color-lp-mint)]" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] font-[var(--font-poppins)]">
                          {feature.title}
                        </h3>
                        <p className="text-[var(--color-lp-blue)] dark:text-[var(--color-lp-blue)] font-semibold text-lg">
                          → {feature.benefit}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg text-slate-600 dark:text-[var(--color-text-secondary)] leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <div className="bg-[var(--color-lp-mint)]/5 rounded-lg p-4">
                      <p className="text-sm text-slate-700 dark:text-[var(--color-text-secondary)] font-medium">
                        <strong>価値:</strong> {feature.valueProposition}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gradient-to-br from-[var(--color-lp-mint)]/5 to-[var(--color-lp-blue)]/5 rounded-3xl p-8 border border-slate-200 dark:border-[var(--color-surface-3)]">
                      {/* 機能別デモコンポーネント */}
                      {index === 0 && <PortfolioVisualizationDemo />}
                      {index === 1 && <RiskVisualizationDemo />}
                      {index === 2 && <AutoInputDemo />}
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
          className="py-20 bg-gradient-to-br from-[var(--color-lp-navy)] to-[var(--color-lp-blue)] dark:from-slate-800 dark:to-slate-900 text-white dark:text-[var(--color-text-primary)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-[var(--font-poppins)]">
                知的副操縦士として
                <br />
                あなたの<span className="text-[var(--color-lp-mint)]">投資</span>を支える
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                ロボアドバイザーのようにあなたに代わるのではなく、
                <br />
                あなたの意思決定を力づける存在
              </p>
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
                  <span className="text-[var(--color-lp-mint)] font-bold">
                    自信を持って、投資を続けよう。
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Now Section */}
        <section className="py-20 bg-[var(--color-lp-off-white)] dark:bg-[var(--color-surface-2)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-6 font-[var(--font-poppins)]">
                なぜ<span className="text-[var(--color-lp-mint)]">今</span>なのか？
              </h2>
              <p className="text-xl text-slate-600 dark:text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                投資中級者が行動すべき3つの理由
              </p>
            </div>

            {/* 上段：NISA拡大と非課税枠の統計 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white dark:bg-[var(--color-surface-1)] rounded-2xl p-8 shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] text-center hover:shadow-xl dark:hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold text-[var(--color-lp-mint)] mb-2">+130万</div>
                <div className="text-lg font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-4">
                  NISA口座増加
                </div>
                <p className="text-slate-600 dark:text-[var(--color-text-secondary)]">
                  半期での新規開設数
                </p>
              </div>
              <div className="bg-white dark:bg-[var(--color-surface-1)] rounded-2xl p-8 shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] text-center hover:shadow-xl dark:hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold text-[var(--color-lp-mint)] mb-2">88%</div>
                <div className="text-lg font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-4">
                  非課税枠未使用
                </div>
                <p className="text-slate-600 dark:text-[var(--color-text-secondary)]">
                  最適配分の検討が必要
                </p>
              </div>
            </div>

            {/* メイン：インフレ対抗比較ビジュアル */}
            <InflationComparisonVisual />

            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--color-lp-mint)] to-[var(--color-lp-blue)] text-white rounded-full px-8 py-4 shadow-lg">
                <TrendingUp className="w-6 h-6" />
                <span className="font-semibold">
                  現金は毎年<span className="text-xl">2.5%</span>ずつ価値が減少
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-6 font-[var(--font-poppins)]">
                よくある質問
              </h2>
            </div>

            <div className="space-y-6">
              {faqItems.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-[var(--color-surface-1)] rounded-2xl p-6 shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)]"
                >
                  <h3 className="text-lg font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-3">
                    Q. {faq.q}
                  </h3>
                  <p className="text-slate-600 dark:text-[var(--color-text-secondary)]">
                    A. {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-[var(--color-lp-mint)] to-[var(--color-lp-blue)] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 font-[var(--font-poppins)]">
              あなたの投資の
              <br />
              <span className="text-yellow-300">知的副操縦士</span>
              <br />
              になります。
            </h2>
            <p className="text-xl mb-8 opacity-90">自信を持って、投資を続けよう。</p>
            <Link
              href="/start"
              className="inline-flex items-center gap-3 bg-white dark:bg-[var(--color-surface-1)] text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] px-10 py-5 rounded-full text-xl font-bold hover:bg-slate-100 dark:hover:bg-[var(--color-surface-2)] transition-all hover:scale-105 shadow-2xl dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
            >
              <Brain className="w-6 h-6" />
              統合ダッシュボードを始める
              <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="text-sm mt-4 opacity-75">✓ 登録不要 ✓ 資産一元管理</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[var(--color-lp-navy)] dark:bg-[var(--color-surface-3)] text-white dark:text-[var(--color-text-primary)] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-4 font-[var(--font-poppins)]">Laplace</div>
              <p className="text-slate-300 dark:text-[var(--color-text-muted)] max-w-2xl mx-auto mb-8">
                あなたの投資の知的副操縦士（インテリジェント・コパイロット）
                <br />
                ポートフォリオ管理の複雑性を解決し、将来への不安を自信に変える。
              </p>
              <div className="border-t border-slate-700 dark:border-[var(--color-surface-4)] pt-8">
                <p className="text-slate-400 dark:text-[var(--color-text-muted)] text-sm">
                  © 2024 Laplace. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
