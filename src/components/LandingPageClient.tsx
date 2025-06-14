'use client';

import { useState, useEffect, useRef } from 'react';
import { useLandingPageAnalytics } from '@/hooks/useLandingPageAnalytics';
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
  Coins,
} from 'lucide-react';
import {
  AutoInputDemo,
  ScenarioComparisonDemo,
  RiskVisualizationDemo,
} from '@/components/FeatureDemoCharts';

// アニメーション用のNumber カウントアップコンポーネント
export const AnimatedNumber = ({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      const easeOutCubic = 1 - Math.pow(1 - percentage, 3);
      setCurrent(Math.floor(end * easeOutCubic));

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {current.toLocaleString()}
      {suffix}
    </span>
  );
};

// インフレ対抗比較ビジュアルコンポーネント
export const InflationComparisonVisual = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animationStarted) {
          setIsVisible(true);
          setAnimationStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [animationStarted]);

  return (
    <div ref={ref} className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-4 font-[var(--font-poppins)]">
          同じ
          <span className="text-[var(--color-lp-mint)] dark:text-[var(--color-lp-mint)]">
            100万円
          </span>
          でも、10年後は？
        </h3>
        <p className="text-lg text-slate-600 dark:text-[var(--color-text-secondary)]">
          インフレ率2.5%の環境下での購買力の変化
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左：銀行預金 */}
        <div className="bg-white dark:bg-[var(--color-surface-2)] rounded-3xl p-8 shadow-xl dark:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.6)] border border-red-100 dark:border-red-800 relative overflow-hidden">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Building2 className="w-8 h-8 text-red-500 dark:text-red-400" />
              <h4 className="text-xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                銀行預金のまま
              </h4>
            </div>

            {/* 購買力の視覚化（商品が買えなくなる） */}
            <div className="relative h-40 flex flex-col items-center justify-center mb-8">
              {/* 紙幣のビジュアル */}
              <div className="relative mb-4">
                <div
                  className={`transition-all duration-3000 ease-out ${
                    isVisible ? 'scale-75 opacity-70' : 'scale-100 opacity-100'
                  }`}
                >
                  <div className="w-32 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg border-2 border-blue-300 flex items-center justify-center shadow-lg">
                    <span className="text-lg font-bold text-blue-700">¥100万</span>
                  </div>
                </div>

                {/* インフレの影響を示す矢印 */}
                {isVisible && (
                  <div className="absolute -top-2 -right-2 animate-bounce">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      ↓
                    </div>
                  </div>
                )}
              </div>

              {/* 購買力の変化を商品で表現 */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-slate-600">買えるもの:</span>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {/* 商品アイコン（購買力低下を表現） */}
                {[
                  { icon: '🍎', label: 'りんご', crossed: isVisible },
                  { icon: '☕', label: 'コーヒー', crossed: isVisible },
                  { icon: '🚗', label: '車', crossed: isVisible },
                  { icon: '🏠', label: '家', crossed: isVisible },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`relative flex flex-col items-center p-2 rounded-lg transition-all duration-1000 ${
                      item.crossed ? 'opacity-40 scale-90' : 'opacity-100 scale-100'
                    }`}
                    style={{ animationDelay: `${i * 200 + 1000}ms` }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-xs text-slate-500">{item.label}</span>
                    {item.crossed && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-0.5 bg-red-500 transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">10年後の実質的な価値</p>
                <div className="text-4xl font-bold text-red-500 mb-2">
                  {isVisible ? (
                    <AnimatedNumber end={78} prefix="約" suffix="万円" duration={2500} />
                  ) : (
                    '100万円'
                  )}
                </div>
                <div className="text-red-500 font-semibold">
                  {isVisible ? (
                    <AnimatedNumber end={-22} prefix="-" suffix="万円相当" duration={2500} />
                  ) : (
                    '±0円'
                  )}
                </div>
                <p className="text-sm text-red-600">同じものが買えなくなった状態</p>
              </div>
            </div>
          </div>

          {/* 背景装飾 */}
          <div className="absolute top-4 right-4 opacity-10">
            <TrendingDown className="w-16 h-16 text-red-500" />
          </div>
        </div>

        {/* 右：NISA投資 */}
        <div className="bg-white dark:bg-[var(--color-surface-2)] rounded-3xl p-8 shadow-xl dark:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.6)] border border-green-100 dark:border-green-800 relative overflow-hidden">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sprout className="w-8 h-8 text-green-500 dark:text-green-400" />
              <h4 className="text-xl font-bold text-[var(--color-lp-navy)]">NISA つみたて投資</h4>
            </div>

            {/* 資産成長の視覚化 */}
            <div className="relative h-40 flex flex-col items-center justify-center mb-8">
              {/* 資産の成長を表現 */}
              <div className="relative mb-4">
                <div
                  className={`transition-all duration-3000 ease-out ${
                    isVisible ? 'scale-110' : 'scale-100'
                  }`}
                >
                  <div className="w-32 h-20 bg-gradient-to-r from-green-100 to-green-200 rounded-lg border-2 border-green-300 flex items-center justify-center shadow-lg relative overflow-hidden">
                    <span className="text-lg font-bold text-green-700">¥100万</span>
                    {/* 成長を表すキラキラエフェクト */}
                    {isVisible && (
                      <>
                        <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                        <div
                          className="absolute bottom-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                          style={{ animationDelay: '0.5s' }}
                        ></div>
                        <div
                          className="absolute top-1 right-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping"
                          style={{ animationDelay: '1s' }}
                        ></div>
                      </>
                    )}
                  </div>
                </div>

                {/* 追加された資産を表現 */}
                {isVisible && (
                  <div className="absolute -top-8 -right-8 transition-all duration-2000 animate-fade-in">
                    <div className="w-20 h-12 bg-gradient-to-r from-green-200 to-green-300 rounded-lg border border-green-400 flex items-center justify-center shadow-md">
                      <span className="text-sm font-bold text-green-800">+¥63万</span>
                    </div>
                  </div>
                )}

                {/* 成長を示す矢印 */}
                {isVisible && (
                  <div className="absolute -top-2 -right-2 animate-bounce">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      ↗
                    </div>
                  </div>
                )}
              </div>

              {/* より多くのものが買える */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-slate-600">買えるもの:</span>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { icon: '🍎', label: 'りんご', enhanced: true },
                  { icon: '☕', label: 'コーヒー', enhanced: true },
                  { icon: '🚗', label: '車', enhanced: true },
                  { icon: '🏠', label: '家', enhanced: true },
                  { icon: '✈️', label: '旅行', enhanced: true },
                  { icon: '🎓', label: '教育', enhanced: true },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`relative flex flex-col items-center p-2 rounded-lg transition-all duration-1000 ${
                      isVisible && item.enhanced
                        ? 'opacity-100 scale-110 bg-green-50'
                        : 'opacity-80 scale-100'
                    }`}
                    style={{ animationDelay: `${i * 150 + 1500}ms` }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-xs text-slate-500">{item.label}</span>
                    {isVisible && item.enhanced && (
                      <div className="absolute -top-1 -right-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">+</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">10年後の資産額</p>
                <div className="text-4xl font-bold text-green-500 mb-2">
                  {isVisible ? (
                    <AnimatedNumber end={163} prefix="約" suffix="万円" duration={2500} />
                  ) : (
                    '100万円'
                  )}
                </div>
                <div className="text-green-500 font-semibold">
                  {isVisible ? (
                    <AnimatedNumber end={63} prefix="+" suffix="万円" duration={2500} />
                  ) : (
                    '±0円'
                  )}
                </div>
                <p className="text-sm text-green-600">インフレに負けず資産が成長</p>
              </div>
            </div>
          </div>

          {/* 背景装飾 */}
          <div className="absolute top-4 right-4 opacity-10">
            <TrendingUp className="w-16 h-16 text-green-500" />
          </div>
        </div>
      </div>

      {/* 比較サマリー */}
      <div className="mt-12 bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 dark:from-red-900/20 dark:via-yellow-900/20 dark:to-green-900/20 rounded-3xl p-8 border border-slate-200 dark:border-[var(--color-surface-3)]">
        <div className="text-center mb-6">
          <h4 className="text-xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-2">
            10年後の違い
          </h4>
          <p className="text-slate-600 dark:text-[var(--color-text-secondary)]">
            同じ100万円が生み出す価値の差
          </p>
        </div>

        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500 dark:text-red-400 mb-1">78万円相当</div>
            <div className="text-sm text-slate-600 dark:text-[var(--color-text-secondary)]">
              銀行預金
            </div>
            <div className="text-xs text-red-500 dark:text-red-400">-22万円相当の価値減</div>
          </div>

          <div className="text-4xl text-slate-400 dark:text-[var(--color-text-muted)]">VS</div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-500 dark:text-green-400 mb-1">
              163万円
            </div>
            <div className="text-sm text-slate-600 dark:text-[var(--color-text-secondary)]">
              NISA投資
            </div>
            <div className="text-xs text-green-500 dark:text-green-400">+63万円の資産増</div>
          </div>
        </div>

        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 bg-[var(--color-lp-mint)] text-white dark:text-slate-900 px-6 py-3 rounded-full">
            <span className="font-bold text-lg">差額: 85万円</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-[var(--color-text-muted)] mt-2">
            ※インフレによる実質価値の減少分も含む
          </p>
        </div>
      </div>

      {/* 注釈 */}
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-500 dark:text-[var(--color-text-muted)] max-w-4xl mx-auto leading-relaxed">
          ※上記は、元本100万円を、インフレ率 年2.5%、NISA運用での期待リターン 年5%（複利）と仮定し、
          10年間運用した場合のシミュレーションイメージです。運用成果を保証するものではありません。
        </p>
      </div>
    </div>
  );
};

// ワンクリック自動入力体験セクションコンポーネント
export const OneClickExperienceSection = () => {
  const [isActive, setIsActive] = useState(true);
  const [showChips, setShowChips] = useState(true);
  const [placeholderText, setPlaceholderText] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [showBeforeAfter, setShowBeforeAfter] = useState(true);
  const { trackCTAClick, trackStockChipClick, trackSectionView, trackFormInteraction } =
    useLandingPageAnalytics();

  const placeholders = [
    '例: Apple',
    '例: S&P500 ETF',
    '例: トヨタ自動車',
    '例: NVIDIA',
    '例: 全世界株式',
  ];

  const popularStocks = [
    { name: 'Apple', symbol: 'AAPL', type: '米国株' },
    { name: 'Microsoft', symbol: 'MSFT', type: '米国株' },
    { name: 'VOO', symbol: 'VOO', type: 'ETF' },
    { name: 'トヨタ自動車', symbol: '7203', type: '日本株' },
    { name: 'NVIDIA', symbol: 'NVDA', type: '米国株' },
    { name: 'VTI', symbol: 'VTI', type: 'ETF' },
  ];

  // プレースホルダーのアニメーション
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // タイピングアニメーション
  useEffect(() => {
    const text = placeholders[currentPlaceholder];
    let index = 0;
    setPlaceholderText('');

    const typing = setInterval(() => {
      if (index <= text.length) {
        setPlaceholderText(text.slice(0, index));
        index++;
      } else {
        clearInterval(typing);
      }
    }, 100);

    return () => clearInterval(typing);
  }, [currentPlaceholder]);

  const handleInputClick = () => {
    setIsActive(true);
    setShowChips(true);
    setShowBeforeAfter(true);
    trackFormInteraction('stock_search', 'click');
  };

  const handleStockClick = (stock: { name: string; symbol: string; type: string }) => {
    // アナリティクス追跡
    trackStockChipClick(stock.symbol, stock.name);

    // 実際のプロダクトページに遷移
    window.location.href = `/markets/${encodeURIComponent(stock.symbol)}`;
  };

  // セクション表示の追跡
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackSectionView('one_click_experience');
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [trackSectionView]);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-[var(--color-lp-mint)]/5 to-[var(--color-lp-blue)]/5 dark:from-[var(--color-lp-mint)]/8 dark:to-[var(--color-lp-blue)]/8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-6 font-[var(--font-poppins)]">
            知識は不要。
            <br />
            気になる
            <span className="text-[var(--color-lp-mint)] dark:text-[var(--color-lp-mint)]">
              銘柄を選ぶだけ
            </span>
            。
          </h2>
          <p className="text-xl text-slate-600 dark:text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            株価・配当・各種指標まで。必要なデータはLaplaceが自動で入力します。
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 左：体験型検索コンポーネント */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-[var(--color-surface-2)] rounded-3xl p-8 shadow-2xl dark:shadow-[0_25px_30px_-5px_rgba(0,0,0,0.7)] border border-slate-200 dark:border-[var(--color-surface-3)]">
                <h3 className="text-xl font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-6 text-center">
                  試してみましょう 👇
                </h3>

                {/* インタラクティブ検索ボックス */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={placeholderText}
                    onClick={handleInputClick}
                    className={`w-full px-6 py-4 text-lg border-2 rounded-full transition-all duration-300 dark:text-[var(--color-text-primary)] dark:placeholder:text-[var(--color-text-muted)] ${
                      isActive
                        ? 'border-[var(--color-lp-mint)] bg-[var(--color-lp-mint)]/5 dark:bg-[var(--color-lp-mint)]/10 outline-none shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,255,196,0.2)]'
                        : 'border-slate-300 dark:border-[var(--color-surface-3)] dark:bg-[var(--color-surface-1)] hover:border-[var(--color-lp-mint)] cursor-pointer'
                    }`}
                    readOnly
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div
                      className={`w-3 h-3 bg-[var(--color-lp-mint)] rounded-full animate-pulse ${
                        isActive ? 'opacity-100' : 'opacity-50'
                      }`}
                    />
                  </div>
                </div>

                {/* 人気銘柄チップ */}
                <div
                  className={`mt-6 transition-all duration-500 ${
                    showChips ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <p className="text-sm text-slate-600 dark:text-[var(--color-text-secondary)] mb-4">
                    人気の銘柄から選ぶ：
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {popularStocks.map((stock, index) => (
                      <button
                        key={index}
                        onClick={() => handleStockClick(stock)}
                        className="group bg-white dark:bg-[var(--color-surface-3)] border-2 border-[var(--color-lp-mint)]/20 dark:border-[var(--color-lp-mint)]/30 hover:border-[var(--color-lp-mint)] 
                                 hover:bg-[var(--color-lp-mint)]/5 dark:hover:bg-[var(--color-lp-mint)]/10 px-4 py-2 rounded-full transition-all duration-200 
                                 hover:scale-105 hover:shadow-lg dark:hover:shadow-[0_10px_15px_-3px_rgba(0,255,196,0.3)]"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] group-hover:text-[var(--color-lp-mint)]">
                            {stock.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-[var(--color-text-muted)] bg-slate-100 dark:bg-[var(--color-surface-4)] px-2 py-1 rounded-full">
                            {stock.type}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-500 dark:text-[var(--color-text-muted)]">
                    ↑ クリックして
                    <span className="text-[var(--color-lp-mint)] dark:text-[var(--color-lp-mint)] font-semibold">
                      実際に体験
                    </span>
                    してみてください
                  </p>
                </div>
              </div>
            </div>

            {/* 右：Before/Afterアニメーション */}
            <div
              className={`transition-all duration-1000 ${
                showBeforeAfter ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
            >
              <div className="space-y-8">
                {/* Before */}
                <div className="bg-white dark:bg-[var(--color-surface-2)] rounded-2xl p-6 border border-slate-200 dark:border-[var(--color-surface-3)] shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)]">
                  <h4 className="text-sm font-semibold text-slate-600 dark:text-[var(--color-text-secondary)] mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center text-xs text-red-600 dark:text-red-400">
                      1
                    </div>
                    従来の投資ツール
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-slate-100 dark:bg-[var(--color-surface-3)] h-4 rounded animate-pulse"></div>
                    <div className="bg-slate-100 dark:bg-[var(--color-surface-3)] h-4 rounded animate-pulse"></div>
                    <div className="bg-slate-100 dark:bg-[var(--color-surface-3)] h-4 rounded animate-pulse"></div>
                    <p className="text-xs text-slate-500 dark:text-[var(--color-text-muted)] text-center">
                      手動でデータ入力が必要...
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-[var(--color-lp-mint)] dark:text-[var(--color-lp-mint)] animate-bounce" />
                </div>

                {/* After */}
                <div className="bg-gradient-to-br from-[var(--color-lp-mint)]/10 to-[var(--color-lp-blue)]/10 dark:from-[var(--color-lp-mint)]/15 dark:to-[var(--color-lp-blue)]/15 rounded-2xl p-6 border border-[var(--color-lp-mint)]/20 dark:border-[var(--color-lp-mint)]/30 shadow-xl dark:shadow-[0_20px_25px_-5px_rgba(0,255,196,0.2)]">
                  <h4 className="text-sm font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-[var(--color-lp-mint)] dark:bg-[var(--color-lp-mint)] rounded-full flex items-center justify-center text-xs text-white dark:text-slate-900">
                      2
                    </div>
                    Laplace
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-[var(--color-text-secondary)]">
                        株価
                      </span>
                      <span className="text-sm font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                        $150.23 ✓
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-[var(--color-text-secondary)]">
                        配当利回り
                      </span>
                      <span className="text-sm font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                        2.5% ✓
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-[var(--color-text-secondary)]">
                        PER
                      </span>
                      <span className="text-sm font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                        28.4 ✓
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-lp-mint)] dark:text-[var(--color-lp-mint)] text-center font-semibold">
                      自動で入力完了！
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 最下部CTA */}
          <div className="text-center mt-12">
            <Link
              href="/search"
              onClick={() => trackCTAClick('experience', 'いますぐ銘柄を検索してみる', '/search')}
              className="inline-flex items-center gap-3 bg-[var(--color-lp-mint)] text-white dark:text-slate-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-[var(--color-lp-mint)]/90 transition-all hover:scale-105 shadow-xl dark:shadow-[0_20px_25px_-5px_rgba(0,255,196,0.3)]"
            >
              <Zap className="w-5 h-5" />
              いますぐ銘柄を検索してみる
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-slate-500 dark:text-[var(--color-text-muted)] mt-3">
              未来のシミュレーションは、検索からはじまる。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ヒーローイメージコンポーネント
export const HeroImage = () => {
  const [activeScenario, setActiveScenario] = useState(0);
  const [isAnimated, setIsAnimated] = useState(false);

  const scenarios = [
    {
      name: '高配当株A',
      type: '積立投資',
      return: '+147%',
      dividend: '¥2.4M',
      risk: '-15%',
      color: 'var(--color-lp-mint)',
    },
    {
      name: 'インデックスファンドB',
      type: '一括投資',
      return: '+89%',
      dividend: '¥1.8M',
      risk: '-8%',
      color: 'var(--color-lp-blue)',
    },
    {
      name: '銀行預金',
      type: '定期預金',
      return: '+2.1%',
      dividend: '¥150K',
      risk: '0%',
      color: 'var(--color-gray-400)',
    },
  ];

  const floatingTags = [
    '#NISA最適化',
    '#配当再投資',
    '#リスク許容度',
    '#シナリオ比較',
    '#自動入力',
  ];

  // 固定値の配列でSSR/CSRの一貫性を保つ
  const barHeights = [
    65, 45, 78, 52, 89, 34, 67, 55, 72, 41, 60, 75, 48, 83, 39, 64, 70, 46, 58, 92,
  ];

  useEffect(() => {
    setIsAnimated(true);

    // シナリオ自動切り替え
    const interval = setInterval(() => {
      setActiveScenario((prev) => (prev + 1) % scenarios.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-6xl mx-auto mt-12">
      {/* フローティングタグ */}
      {floatingTags.map((tag, index) => (
        <div
          key={index}
          className={`absolute text-sm bg-white/80 dark:bg-[var(--color-surface-2)]/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] border border-slate-200 dark:border-[var(--color-surface-3)] transition-all duration-1000 ${
            isAnimated ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            top: `${20 + index * 15}%`,
            left: index % 2 === 0 ? `${5 + index * 2}%` : 'auto',
            right: index % 2 === 1 ? `${5 + index * 2}%` : 'auto',
            animationDelay: `${index * 200}ms`,
            animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
          }}
        >
          {tag}
        </div>
      ))}

      {/* メインデバイスモックアップ */}
      <div className="relative">
        {/* ラップトップモックアップ */}
        <div
          className={`relative transform transition-all duration-1000 ${
            isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div
            className="bg-gray-800 rounded-t-2xl p-6 shadow-2xl"
            style={{ width: '800px', height: '500px', margin: '0 auto' }}
          >
            {/* ラップトップの画面ベゼル */}
            <div className="bg-black rounded-lg p-4 h-full relative overflow-hidden">
              {/* メイン画面コンテンツ */}
              <div className="bg-white rounded-lg h-full p-6 relative">
                {/* シナリオ比較カード */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {scenarios.map((scenario, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 transition-all duration-500 ${
                        index === activeScenario
                          ? 'border-[var(--color-lp-mint)] bg-[var(--color-lp-mint)]/5 scale-105'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <h4 className="font-bold text-[var(--color-lp-navy)] text-sm mb-2">
                        {scenario.name}
                      </h4>
                      <p className="text-xs text-gray-600 mb-3">{scenario.type}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">10年後リターン</span>
                          <span className="text-sm font-bold" style={{ color: scenario.color }}>
                            {index === activeScenario ? (
                              <AnimatedNumber
                                end={parseInt(scenario.return.replace(/[^\d]/g, ''))}
                                prefix="+"
                                suffix="%"
                              />
                            ) : (
                              scenario.return
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">年間配当</span>
                          <span className="text-sm font-bold text-[var(--color-lp-navy)]">
                            {scenario.dividend}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">最悪ケース</span>
                          <span className="text-sm font-bold text-red-500">{scenario.risk}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* モンテカルロシミュレーション風のグラフ */}
                <div className="bg-gradient-to-br from-[var(--color-lp-mint)]/5 to-[var(--color-lp-blue)]/5 rounded-lg p-4 h-32 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-[var(--color-lp-mint)] rounded-t"
                        style={{
                          width: '8px',
                          height: `${barHeights[i]}%`,
                          opacity: 0.6,
                          animationDelay: `${i * 100}ms`,
                          animation: isAnimated ? `bar-grow 1s ease-out forwards` : 'none',
                        }}
                      />
                    ))}
                  </div>
                  {/* グラフの描画線 */}
                  <svg className="absolute inset-0 w-full h-full">
                    <path
                      d="M20,80 Q100,60 180,45 T340,50 T500,40"
                      stroke="var(--color-lp-blue)"
                      strokeWidth="2"
                      fill="none"
                      className={`transition-all duration-2000 ${
                        isAnimated ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        strokeDasharray: '300',
                        strokeDashoffset: isAnimated ? '0' : '300',
                        transition: 'stroke-dashoffset 2s ease-out',
                      }}
                    />
                  </svg>
                  <div className="absolute top-2 left-4 text-xs text-[var(--color-lp-navy)] font-semibold">
                    モンテカルロシミュレーション (1,000本)
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ラップトップベース */}
          <div
            className="bg-gray-300 rounded-b-2xl h-8 relative"
            style={{ width: '800px', margin: '0 auto' }}
          >
            <div className="absolute inset-x-0 top-2 flex justify-center">
              <div className="w-16 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* スマートフォンモックアップ */}
        <div
          className={`absolute -right-16 top-24 transform transition-all duration-1000 delay-300 ${
            isAnimated ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          }`}
        >
          <div
            className="bg-gray-800 rounded-3xl p-3 shadow-2xl"
            style={{ width: '200px', height: '400px' }}
          >
            {/* スマートフォン画面 */}
            <div className="bg-black rounded-2xl h-full p-1 relative overflow-hidden">
              <div className="bg-white rounded-xl h-full p-4 relative">
                {/* ノッチ */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-black rounded-b-xl"></div>

                {/* スマートフォンのコンテンツ */}
                <div className="pt-8">
                  <h3 className="text-[var(--color-lp-navy)] font-bold text-sm mb-4 text-center">
                    10年後の配当キャッシュフロー
                  </h3>

                  {/* 配当の棒グラフ */}
                  <div className="space-y-3">
                    {[
                      { year: '2025', amount: 50000 },
                      { year: '2027', amount: 120000 },
                      { year: '2030', amount: 180000 },
                      { year: '2032', amount: 240000 },
                      { year: '2034', amount: 240000 },
                    ].map((data, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-8">{data.year}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                          <div
                            className="bg-[var(--color-lp-mint)] h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${(data.amount / 240000) * 100}%`,
                              animationDelay: `${index * 200 + 1000}ms`,
                              transform: isAnimated ? 'scaleX(1)' : 'scaleX(0)',
                              transformOrigin: 'left',
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-[var(--color-lp-navy)] w-12 text-right">
                          {isAnimated ? (
                            <AnimatedNumber end={data.amount} prefix="¥" />
                          ) : (
                            `¥${data.amount.toLocaleString()}`
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-3 bg-[var(--color-lp-mint)]/10 rounded-lg text-center">
                    <div className="text-lg font-bold text-[var(--color-lp-navy)]">
                      {isAnimated ? <AnimatedNumber end={2400000} prefix="¥" /> : '¥2,400,000'}
                    </div>
                    <div className="text-xs text-gray-600">年間配当収入</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 背景装飾 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-lp-mint)]/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--color-lp-blue)]/5 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

// ランディングページのクライアント機能コンポーネント
export const LandingPageClientFeatures = () => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    trackCTAClick,
    trackNavigationClick,
    trackSectionView,
    trackScrollDepth,
    trackFAQInteraction,
    trackError,
  } = useLandingPageAnalytics();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // スクロール深度の追跡
  useEffect(() => {
    let lastScrollDepth = 0;
    const handleScroll = () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      // 25%刻みで報告
      if (scrollDepth >= 25 && lastScrollDepth < 25) {
        trackScrollDepth(25);
        lastScrollDepth = 25;
      } else if (scrollDepth >= 50 && lastScrollDepth < 50) {
        trackScrollDepth(50);
        lastScrollDepth = 50;
      } else if (scrollDepth >= 75 && lastScrollDepth < 75) {
        trackScrollDepth(75);
        lastScrollDepth = 75;
      } else if (scrollDepth >= 90 && lastScrollDepth < 90) {
        trackScrollDepth(100);
        lastScrollDepth = 100;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollDepth]);

  // エラーハンドリング
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackError(new Error(event.message), 'window_error');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(new Error(event.reason), 'unhandled_promise_rejection');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [trackError]);

  return null; // このコンポーネントは副作用のみを提供
};
