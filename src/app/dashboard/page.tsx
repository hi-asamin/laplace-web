'use client';

import {
  TrendingUp,
  PieChart,
  DollarSign,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Zap,
  Plus,
  Edit3,
  Edit,
  TrendingDown,
  Smartphone,
  Download,
  Play,
  Lock,
  BarChart3,
  LineChart,
  Calculator,
} from 'lucide-react';
import {
  AnimatedNumber,
  SectorAllocationChart,
  AssetGrowthChart,
} from '@/components/AssetDashboard';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// AppleロゴSVGコンポーネント
const AppleLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 170 170" fill="currentColor" className={className}>
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068C27.508 57.03 32.42 52.39 38.6 50.092c6.18-2.302 12.794-3.47 19.842-3.583 3.897 0 9.00 1.22 15.33 3.62 6.317 2.41 10.385 3.63 12.204 3.63 1.355 0 5.956-1.43 13.776-4.28 7.388-2.65 13.61-3.75 18.684-3.28 13.849 1.09 24.257 6.4 31.226 15.94-.275.168-.511.318-.763.474-3.04 1.915-5.72 4.064-8.18 6.286-5.242 4.952-7.904 10.898-7.904 17.817 0 8.682 3.302 15.944 9.928 21.775 2.978 2.616 6.336 4.696 10.11 6.14 1.097.415 2.215.815 3.353 1.190-.842 2.442-1.7 4.79-2.592 7.06zM119.11 7.24c0 6.8-2.48 13.12-7.44 18.93-5.98 6.93-13.21 10.95-21.08 10.32C90.45 35.94 90.32 35.34 90.32 34.66c0-6.52 2.84-13.51 7.89-19.22 2.52-2.87 5.73-5.26 9.64-7.16 3.9-1.87 7.58-2.91 11.07-3.12.121.82.18 1.64.18 2.49z" />
  </svg>
);

// デバイス検出フック
const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      );
      const isIOSDevice = /iphone|ipad|ipod/i.test(userAgent);
      const isAndroidDevice = /android/i.test(userAgent);

      setIsMobile(isMobileDevice);
      setIsIOS(isIOSDevice);
      setIsAndroid(isAndroidDevice);
    };

    detectDevice();
  }, []);

  return { isMobile, isIOS, isAndroid };
};

// スマート ダウンロードボタンコンポーネント
const SmartDownloadButton = ({
  onAppDownload,
  className = '',
}: {
  onAppDownload: () => void;
  className?: string;
}) => {
  const { isMobile, isIOS, isAndroid } = useDeviceDetection();

  // モバイル向けスタイルボタンコンポーネント
  const MobileAppStoreButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all hover:scale-105 shadow-lg px-4 py-2.5 ${className}`}
    >
      <AppleLogo className="w-7 h-7" />
      <div className="text-left">
        <div className="text-xs leading-tight opacity-90 font-normal">Download on the</div>
        <div className="text-lg font-bold leading-tight -mt-0.5">App Store</div>
      </div>
    </button>
  );

  const MobileGooglePlayButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all hover:scale-105 shadow-lg px-4 py-2.5 ${className}`}
    >
      <div className="w-7 h-7 flex items-center justify-center">
        <svg viewBox="0 0 512 512" fill="currentColor" className="w-6 h-6">
          <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z" />
          <path d="M472.2 188.9c-8.7-4.8-17.6-7.1-26.7-7.1-10.2 0-19.7 2.6-28.8 7.8L336.1 234.2l-60.1 60.1 79.4 44.9c8.9 5 18.3 7.5 28.1 7.5 9.8 0 19.6-2.6 29.5-7.8 18.7-9.9 30.8-29.2 30.8-50.8.1-21.3-12.1-40.4-31.6-49.2z" />
          <path d="M119.4 282.2l60.1-60.1 145.5 81.9-79.4-44.9L119.4 282.2z" />
        </svg>
      </div>
      <div className="text-left">
        <div className="text-xs leading-tight opacity-90 font-normal">GET IT ON</div>
        <div className="text-lg font-bold leading-tight -mt-0.5">Google Play</div>
      </div>
    </button>
  );

  if (isMobile) {
    if (isIOS) {
      return <MobileAppStoreButton onClick={onAppDownload} />;
    }
    if (isAndroid) {
      return <MobileGooglePlayButton onClick={onAppDownload} />;
    }
    // その他のモバイルデバイス
    return (
      <button
        onClick={onAppDownload}
        className={`bg-[var(--color-lp-mint)] text-white rounded-full font-semibold hover:bg-[var(--color-lp-mint)]/90 transition-all hover:scale-105 shadow-xl flex items-center gap-3 px-8 py-4 text-lg ${className}`}
      >
        <Download className="w-5 h-5" />
        アプリをダウンロード
      </button>
    );
  }

  // デスクトップ用のデフォルトボタン
  return (
    <button
      onClick={onAppDownload}
      className={`bg-[var(--color-lp-mint)] text-white rounded-full font-semibold hover:bg-[var(--color-lp-mint)]/90 transition-all hover:scale-105 shadow-xl flex items-center gap-3 px-8 py-4 text-lg ${className}`}
    >
      <Download className="w-5 h-5" />
      アプリをダウンロード
    </button>
  );
};

// FeaturePreviewCard コンポーネント
function FeaturePreviewCard({ feature, index }: { feature: any; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-1000 delay-${index * 200}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
    >
      <div className="bg-white dark:bg-[var(--color-surface-2)] rounded-3xl p-8 shadow-xl dark:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.6)] border border-slate-200 dark:border-[var(--color-surface-3)] hover:scale-105 transition-all duration-300">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-lp-mint)]/10 to-[var(--color-lp-blue)]/10 rounded-2xl flex items-center justify-center">
            <feature.icon className="w-8 h-8 text-[var(--color-lp-mint)]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] font-[var(--font-poppins)]">
              {feature.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-[var(--color-text-muted)]">
              {feature.subtitle}
            </p>
          </div>
        </div>

        <p className="text-lg text-slate-600 dark:text-[var(--color-text-secondary)] mb-6 leading-relaxed">
          {feature.description}
        </p>

        <div className="bg-[var(--color-lp-off-white)] dark:bg-[var(--color-surface-3)] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-[var(--color-lp-mint)]" />
            <span className="text-sm font-semibold text-[var(--color-lp-mint)]">
              アプリ限定機能
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-[var(--color-text-secondary)]">
            この機能を使うにはアプリをダウンロードしてください
          </p>
        </div>
      </div>
    </div>
  );
}

// InteractiveDemoCard コンポーネント
function InteractiveDemoCard({
  onAppDownload,
  onStartDemo,
}: {
  onAppDownload: () => void;
  onStartDemo: () => void;
}) {
  const [activeView, setActiveView] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const demoViews = [
    {
      title: '資産概要',
      subtitle: 'Portfolio Overview',
      type: 'overview',
    },
    {
      title: '資産推移',
      subtitle: 'Asset Growth',
      type: 'growth',
    },
    {
      title: 'セクター分散',
      subtitle: 'Sector Allocation',
      type: 'allocation',
    },
  ];

  // モックデータ
  const mockOverviewData = {
    totalAssets: 12345678,
    dailyChange: 50123,
    dailyChangePercent: 0.41,
    monthlyGrowth: 3.2,
    yearToDate: 8.7,
  };

  const mockGrowthData = [
    { date: '2024-01', value: 10000000 },
    { date: '2024-03', value: 10500000 },
    { date: '2024-05', value: 11200000 },
    { date: '2024-07', value: 11800000 },
    { date: '2024-09', value: 11950000 },
    { date: '2024-11', value: 12100000 },
    { date: '2024-12', value: 12345678 },
  ];

  const mockSectorData = [
    { name: 'テクノロジー', value: 35, color: '#00d4a1' },
    { name: '金融', value: 20, color: '#4a90e2' },
    { name: 'ヘルスケア', value: 15, color: '#f39c12' },
    { name: 'エネルギー', value: 12, color: '#e74c3c' },
    { name: '生活必需品', value: 10, color: '#9b59b6' },
    { name: 'その他', value: 8, color: '#95a5a6' },
  ];

  const handleViewChange = (index: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveView(index);
      setIsAnimating(false);
    }, 200);
  };

  const renderOverviewContent = () => (
    <div className="space-y-6">
      {/* メインKPI */}
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-2">
          <AnimatedNumber value={mockOverviewData.totalAssets} prefix="¥" />
        </div>
        <div className="flex items-center justify-center gap-2 text-[var(--color-success)]">
          <ArrowUpRight className="w-4 h-4" />
          <span className="font-semibold">
            +¥{mockOverviewData.dailyChange.toLocaleString()} (+
            {mockOverviewData.dailyChangePercent}%)
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-[var(--color-text-muted)] mt-1">
          本日の変動
        </p>
      </div>

      {/* サブKPI */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--color-lp-mint)]/5 dark:bg-[var(--color-lp-mint)]/10 rounded-xl p-4 text-center">
          <div className="text-xl font-bold text-[var(--color-lp-mint)] mb-1">
            +{mockOverviewData.monthlyGrowth}%
          </div>
          <p className="text-xs text-slate-600 dark:text-[var(--color-text-secondary)]">
            月間成長率
          </p>
        </div>
        <div className="bg-[var(--color-lp-blue)]/5 dark:bg-[var(--color-lp-blue)]/10 rounded-xl p-4 text-center">
          <div className="text-xl font-bold text-[var(--color-lp-blue)] mb-1">
            +{mockOverviewData.yearToDate}%
          </div>
          <p className="text-xs text-slate-600 dark:text-[var(--color-text-secondary)]">
            年初来リターン
          </p>
        </div>
      </div>

      {/* ミニ統計 */}
      <div className="bg-slate-50 dark:bg-[var(--color-surface-3)] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-700 dark:text-[var(--color-text-secondary)]">
            今月のハイライト
          </span>
          <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-[var(--color-text-muted)]">配当収入</span>
            <span className="font-medium text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
              ¥32,400
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-[var(--color-text-muted)]">新規投資</span>
            <span className="font-medium text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
              ¥150,000
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGrowthContent = () => (
    <div className="space-y-4">
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-2">
          資産推移グラフ
        </h4>
        <p className="text-sm text-slate-600 dark:text-[var(--color-text-secondary)]">
          過去12ヶ月の資産成長を可視化
        </p>
      </div>
      <div className="bg-white dark:bg-[var(--color-surface-3)] rounded-xl p-4">
        <AssetGrowthChart data={mockGrowthData} />
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">+23%</div>
          <div className="text-xs text-slate-600 dark:text-[var(--color-text-secondary)]">
            年間成長
          </div>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">8.5%</div>
          <div className="text-xs text-slate-600 dark:text-[var(--color-text-secondary)]">
            平均月利
          </div>
        </div>
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">2.8%</div>
          <div className="text-xs text-slate-600 dark:text-[var(--color-text-secondary)]">
            配当利回り
          </div>
        </div>
      </div>
    </div>
  );

  const renderAllocationContent = () => (
    <div className="space-y-4">
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-2">
          セクター分散状況
        </h4>
        <p className="text-sm text-slate-600 dark:text-[var(--color-text-secondary)]">
          リスク分散の可視化とバランス分析
        </p>
      </div>
      <div className="bg-white dark:bg-[var(--color-surface-3)] rounded-xl p-4">
        <SectorAllocationChart data={mockSectorData} />
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-700 dark:text-[var(--color-text-secondary)]">
            リスク分析
          </span>
          <span className="text-xs bg-[var(--color-lp-mint)]/10 text-[var(--color-lp-mint)] px-2 py-1 rounded-full">
            適正バランス
          </span>
        </div>
        <div className="space-y-2">
          {mockSectorData.slice(0, 3).map((sector, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
                <span className="text-slate-600 dark:text-[var(--color-text-muted)]">
                  {sector.name}
                </span>
              </div>
              <span className="font-medium text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                {sector.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-[var(--color-surface-2)] rounded-3xl p-8 shadow-xl dark:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.6)] border border-slate-200 dark:border-[var(--color-surface-3)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[var(--color-lp-mint)]/10 rounded-2xl flex items-center justify-center">
          <Play className="w-6 h-6 text-[var(--color-lp-mint)]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] font-[var(--font-poppins)]">
            ダッシュボード体験
          </h3>
          <p className="text-sm text-slate-500 dark:text-[var(--color-text-muted)]">
            Interactive Dashboard Preview
          </p>
        </div>
      </div>

      {/* ビュー選択タブ */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {demoViews.map((view, index) => (
          <button
            key={index}
            onClick={() => handleViewChange(index)}
            className={`
              flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${
                activeView === index
                  ? 'bg-[var(--color-lp-mint)] text-white shadow-lg scale-105'
                  : 'bg-slate-100 dark:bg-[var(--color-surface-3)] text-slate-600 dark:text-[var(--color-text-secondary)] hover:bg-slate-200 dark:hover:bg-[var(--color-surface-4)]'
              }
            `}
          >
            <div className="text-center">
              <div className="font-semibold">{view.title}</div>
              <div className="text-xs opacity-75">{view.subtitle}</div>
            </div>
          </button>
        ))}
      </div>

      {/* デモコンテンツ */}
      <div
        className={`transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
      >
        <div className="min-h-[400px]">
          {activeView === 0 && renderOverviewContent()}
          {activeView === 1 && renderGrowthContent()}
          {activeView === 2 && renderAllocationContent()}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center pt-6 border-t border-slate-200 dark:border-[var(--color-surface-3)]">
        <p className="text-sm text-slate-500 dark:text-[var(--color-text-muted)] mb-4">
          これはデモ画面です。Web版では実際にシミュレーションを体験できます
        </p>
        <div className="flex gap-3 justify-center">
          <SmartDownloadButton onAppDownload={onAppDownload} className="text-sm px-6 py-3" />
          <button
            onClick={onStartDemo}
            className="bg-slate-100 dark:bg-[var(--color-surface-3)] text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] px-6 py-3 rounded-full hover:bg-slate-200 dark:hover:bg-[var(--color-surface-4)] transition-all hover:scale-105 font-semibold text-sm flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Web版を試す
          </button>
        </div>
      </div>
    </div>
  );
}

// 主要機能データ
const mainFeatures = [
  {
    icon: Target,
    title: '統合ダッシュボード',
    subtitle: 'All-in-One Portfolio View',
    description:
      '分散した資産の全体像を一目で把握できる統合ダッシュボード。シンプルな操作で複雑なポートフォリオ管理が可能になります。',
  },
  {
    icon: Calculator,
    title: 'What-If シミュレーション',
    subtitle: 'Future Scenario Planning',
    description:
      '「積立額を増やしたら？」「市場が暴落したら？」様々なシナリオを簡単にシミュレーション。将来への不安を戦略的な計画に変えましょう。',
  },
  {
    icon: BarChart3,
    title: 'リバランス提案',
    subtitle: 'Intelligent Rebalancing',
    description:
      '理想的なポートフォリオからの乖離を自動検出し、具体的な売買アクションを提案。迷わずに最適な資産配分を維持できます。',
  },
  {
    icon: LineChart,
    title: 'ゴール管理',
    subtitle: 'Goal-Based Planning',
    description:
      'リタイアメント、教育資金、住宅購入など、具体的な目標に向けた進捗管理。目標達成までの道筋を明確に可視化します。',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleAppDownload = () => {
    // アプリダウンロード/ログインページへのナビゲーション
    alert('アプリは現在開発中です。リリース時にお知らせします！');
  };

  const handleStartDemo = () => {
    router.push('/start');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[var(--color-surface-1)] dark:to-[var(--color-surface-2)]">
      {/* ヒーローセクション */}
      <section className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Smartphone className="w-6 h-6 text-[var(--color-lp-mint)]" />
              <span className="text-sm font-semibold text-[var(--color-lp-mint)] bg-[var(--color-lp-mint)]/10 px-3 py-1 rounded-full">
                アプリ専用機能
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-6 font-[var(--font-poppins)]">
              あなたの資産を
              <br />
              <span className="bg-gradient-to-r from-[var(--color-lp-mint)] to-[var(--color-lp-blue)] bg-clip-text text-transparent">
                スマートに管理
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-[var(--color-text-secondary)] max-w-3xl mx-auto mb-12 leading-relaxed">
              高度なポートフォリオ分析とシミュレーションを、誰でも簡単に。
              <br />
              シンプルで直感的な操作で、投資の意思決定をサポートします。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SmartDownloadButton onAppDownload={handleAppDownload} />
              <button
                onClick={handleStartDemo}
                className="bg-white dark:bg-[var(--color-surface-2)] text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl dark:hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.6)] transition-all hover:scale-105 border-2 border-[var(--color-lp-mint)]/20 dark:border-[var(--color-lp-mint)]/30 flex items-center gap-3"
              >
                <Play className="w-5 h-5" />
                シミュレーションを始める
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 sm:gap-8 text-xs sm:text-sm text-slate-500 dark:text-[var(--color-text-muted)]">
              <div className="flex items-center gap-1 sm:gap-2">
                <Smartphone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">直感的なUI</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="whitespace-nowrap text-xs sm:text-sm">高速シミュレーション</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Calculator className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">簡単分析</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 主要機能セクション */}
      <section className="py-20 bg-[var(--color-lp-off-white)] dark:bg-[var(--color-surface-2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-6 font-[var(--font-poppins)]">
              アプリでできること
            </h2>
            <p className="text-xl text-slate-600 dark:text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              投資の悩みを解決する、4つの核心機能
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainFeatures.map((feature, index) => (
              <FeaturePreviewCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* インタラクティブデモセクション */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-6 font-[var(--font-poppins)]">
              実際の画面を体験
            </h2>
            <p className="text-xl text-slate-600 dark:text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              アプリの操作感を事前に確認できます
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <InteractiveDemoCard onAppDownload={handleAppDownload} onStartDemo={handleStartDemo} />
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 bg-gradient-to-br from-[var(--color-lp-navy)] to-[var(--color-lp-blue)] dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-[var(--font-poppins)]">
            今すぐ始めましょう
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12">
            投資の不安を自信に変える旅路が、ここから始まります
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SmartDownloadButton onAppDownload={handleAppDownload} className="text-xl px-10 py-5" />
            <button
              onClick={handleStartDemo}
              className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-full text-xl font-semibold hover:bg-white/20 transition-all hover:scale-105 border-2 border-white/20 flex items-center gap-3"
            >
              <Play className="w-6 h-6" />
              Webでシミュレーション
            </button>
          </div>

          <div className="mt-8 text-white/70 text-sm">
            アプリのダウンロードは無料です • 今すぐ簡単スタート
          </div>
        </div>
      </section>
    </div>
  );
}
