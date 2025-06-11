'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLandingPageAnalytics } from '@/hooks/useLandingPageAnalytics';
import Link from 'next/link';
import {
  TrendingUp,
  BarChart3,
  Shield,
  Zap,
  Eye,
  Target,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  DollarSign,
  PieChart,
  Calendar,
  Sparkles,
  Play,
  Star,
  Smartphone,
  Laptop,
  TrendingDown,
  Building2,
  Sprout,
  Coins,
} from 'lucide-react';

// アニメーション用のNumber カウントアップコンポーネント
const AnimatedNumber = ({
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
const InflationComparisonVisual = () => {
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
        <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-lp-navy)] mb-4 font-[var(--font-poppins)]">
          時の流れが変える、<span className="text-[var(--color-lp-mint)]">100万円</span>の未来
        </h3>
        <p className="text-lg text-slate-600">もし、100万円を10年間そのままにしたら…？</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左：銀行預金 */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-red-100 relative overflow-hidden">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Building2 className="w-8 h-8 text-red-500" />
              <h4 className="text-xl font-bold text-[var(--color-lp-navy)]">銀行に預け続けたら…</h4>
            </div>

            {/* コインの山ビジュアル（縮小アニメーション） */}
            <div className="relative h-40 flex items-center justify-center mb-8">
              <div
                className={`transition-all duration-3000 ${
                  isVisible ? 'scale-75 opacity-60' : 'scale-100 opacity-100'
                }`}
              >
                <div className="flex flex-wrap justify-center items-end gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Coins
                      key={i}
                      className={`text-yellow-400 transition-all duration-3000 ${
                        isVisible ? 'text-yellow-300' : 'text-yellow-400'
                      }`}
                      style={{
                        fontSize: `${20 + (i % 3) * 8}px`,
                        animationDelay: `${i * 100}ms`,
                        filter: isVisible ? 'brightness(0.7)' : 'brightness(1)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* インフレの波紋効果 */}
              <div
                className={`absolute inset-0 transition-opacity duration-2000 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-32 border-2 border-red-300 rounded-full animate-ping opacity-30"></div>
                  <div className="w-24 h-24 border-2 border-red-400 rounded-full animate-ping opacity-40 absolute top-4 left-4"></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">10年後の実質価値</p>
                <div className="text-4xl font-bold text-red-500 mb-2">
                  {isVisible ? (
                    <AnimatedNumber end={78} prefix="約" suffix="万円" duration={2500} />
                  ) : (
                    '約100万円'
                  )}
                </div>
                <div className="text-red-500 font-semibold">
                  {isVisible ? (
                    <AnimatedNumber end={-22} prefix="" suffix="万円" duration={2500} />
                  ) : (
                    '0円'
                  )}
                </div>
                <p className="text-sm text-red-600">インフレに価値が負けている状態</p>
              </div>
            </div>
          </div>

          {/* 背景装飾 */}
          <div className="absolute top-4 right-4 opacity-10">
            <TrendingDown className="w-16 h-16 text-red-500" />
          </div>
        </div>

        {/* 右：NISA投資 */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100 relative overflow-hidden">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sprout className="w-8 h-8 text-green-500" />
              <h4 className="text-xl font-bold text-[var(--color-lp-navy)]">NISAで運用したら…</h4>
            </div>

            {/* コインの山ビジュアル（成長アニメーション） */}
            <div className="relative h-40 flex items-center justify-center mb-8">
              <div
                className={`transition-all duration-3000 ${isVisible ? 'scale-125' : 'scale-100'}`}
              >
                <div className="flex flex-wrap justify-center items-end gap-1">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <Coins
                      key={i}
                      className={`text-yellow-400 transition-all duration-3000 ${
                        isVisible ? 'text-yellow-500' : 'text-yellow-400'
                      }`}
                      style={{
                        fontSize: `${20 + (i % 4) * 6}px`,
                        animationDelay: `${i * 80}ms`,
                        filter: isVisible
                          ? 'brightness(1.2) drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))'
                          : 'brightness(1)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* 成長の輝きエフェクト */}
              <div
                className={`absolute inset-0 transition-opacity duration-2000 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-20 bg-green-400 rounded-full opacity-20 animate-pulse"></div>
                  <div className="w-32 h-32 border-2 border-green-300 rounded-full animate-ping opacity-30 absolute -top-6 -left-6"></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">10年後の資産額</p>
                <div className="text-4xl font-bold text-green-500 mb-2">
                  {isVisible ? (
                    <AnimatedNumber end={163} prefix="約" suffix="万円" duration={2500} />
                  ) : (
                    '約100万円'
                  )}
                </div>
                <div className="text-green-500 font-semibold">
                  {isVisible ? (
                    <AnimatedNumber end={63} prefix="+" suffix="万円" duration={2500} />
                  ) : (
                    '0円'
                  )}
                </div>
                <p className="text-sm text-green-600">インフレを上回り資産が育っている状態</p>
              </div>
            </div>
          </div>

          {/* 背景装飾 */}
          <div className="absolute top-4 right-4 opacity-10">
            <TrendingUp className="w-16 h-16 text-green-500" />
          </div>
        </div>
      </div>

      {/* 注釈 */}
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-500 max-w-4xl mx-auto leading-relaxed">
          ※上記は、元本100万円を、インフレ率 年2.5%、NISAでの期待リターン 年5%（複利）と仮定し、
          10年間運用した場合のシミュレーションイメージです。運用成果を保証するものではありません。
        </p>
      </div>
    </div>
  );
};

// ワンクリック自動入力体験セクションコンポーネント
const OneClickExperienceSection = () => {
  const [isActive, setIsActive] = useState(true);
  const [showChips, setShowChips] = useState(true);
  const [placeholderText, setPlaceholderText] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [showBeforeAfter, setShowBeforeAfter] = useState(true);
  const { trackStockChipClick, trackSectionView, trackFormInteraction } = useLandingPageAnalytics();

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
      className="py-20 bg-gradient-to-br from-[var(--color-lp-mint)]/5 to-[var(--color-lp-blue)]/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-lp-navy)] mb-6 font-[var(--font-poppins)]">
            知識は不要。
            <br />
            気になる<span className="text-[var(--color-lp-mint)]">銘柄を選ぶだけ</span>。
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            株価・配当・各種指標まで。必要なデータはLaplaceが自動で入力します。
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 左：体験型検索コンポーネント */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">
                <h3 className="text-xl font-semibold text-[var(--color-lp-navy)] mb-6 text-center">
                  試してみましょう 👇
                </h3>

                {/* インタラクティブ検索ボックス */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={placeholderText}
                    onClick={handleInputClick}
                    className={`w-full px-6 py-4 text-lg border-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'border-[var(--color-lp-mint)] bg-[var(--color-lp-mint)]/5 outline-none shadow-lg'
                        : 'border-slate-300 hover:border-[var(--color-lp-mint)] cursor-pointer'
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
                  <p className="text-sm text-slate-600 mb-4">人気の銘柄から選ぶ：</p>
                  <div className="flex flex-wrap gap-3">
                    {popularStocks.map((stock, index) => (
                      <button
                        key={index}
                        onClick={() => handleStockClick(stock)}
                        className="group bg-white border-2 border-[var(--color-lp-mint)]/20 hover:border-[var(--color-lp-mint)] 
                                 hover:bg-[var(--color-lp-mint)]/5 px-4 py-2 rounded-full transition-all duration-200 
                                 hover:scale-105 hover:shadow-lg"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[var(--color-lp-navy)] group-hover:text-[var(--color-lp-mint)]">
                            {stock.name}
                          </span>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                            {stock.type}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-500">
                    ↑ クリックして
                    <span className="text-[var(--color-lp-mint)] font-semibold">実際に体験</span>
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
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                  <h4 className="text-sm font-semibold text-slate-600 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs text-red-600">
                      1
                    </div>
                    従来の投資ツール
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-slate-100 h-4 rounded animate-pulse"></div>
                    <div className="bg-slate-100 h-4 rounded animate-pulse"></div>
                    <div className="bg-slate-100 h-4 rounded animate-pulse"></div>
                    <p className="text-xs text-slate-500 text-center">手動でデータ入力が必要...</p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-[var(--color-lp-mint)] animate-bounce" />
                </div>

                {/* After */}
                <div className="bg-gradient-to-br from-[var(--color-lp-mint)]/10 to-[var(--color-lp-blue)]/10 rounded-2xl p-6 border border-[var(--color-lp-mint)]/20 shadow-xl">
                  <h4 className="text-sm font-semibold text-[var(--color-lp-navy)] mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-[var(--color-lp-mint)] rounded-full flex items-center justify-center text-xs text-white">
                      2
                    </div>
                    Laplace
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">株価</span>
                      <span className="text-sm font-bold text-[var(--color-lp-navy)]">
                        $150.23 ✓
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">配当利回り</span>
                      <span className="text-sm font-bold text-[var(--color-lp-navy)]">2.5% ✓</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">PER</span>
                      <span className="text-sm font-bold text-[var(--color-lp-navy)]">28.4 ✓</span>
                    </div>
                    <p className="text-xs text-[var(--color-lp-mint)] text-center font-semibold">
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
              className="inline-flex items-center gap-3 bg-[var(--color-lp-mint)] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[var(--color-lp-mint)]/90 transition-all hover:scale-105 shadow-xl"
            >
              <Zap className="w-5 h-5" />
              いますぐ銘柄を検索してみる
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-slate-500 mt-3">
              未来のシミュレーションは、検索からはじまる。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ヒーローイメージコンポーネント
const HeroImage = () => {
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
          className={`absolute text-sm bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg text-[var(--color-lp-navy)] border border-slate-200 transition-all duration-1000 ${
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
                          height: `${Math.random() * 80 + 20}%`,
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

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
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

  const features = [
    {
      icon: Zap,
      title: 'ワンクリック自動入力',
      description: '銘柄コードを入力するだけで、株価・配当履歴・税率まで自動取得',
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* フローティング アニメーション用CSS */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes bar-grow {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-slate-900 font-[var(--font-poppins)]">
                Laplace
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                onClick={() => trackNavigationClick('機能', '#features')}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                機能
              </a>
              <a
                href="#benefits"
                onClick={() => trackNavigationClick('メリット', '#benefits')}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                メリット
              </a>
              <a
                href="#faq"
                onClick={() => trackNavigationClick('FAQ', '#faq')}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                FAQ
              </a>
              <Link
                href="/markets"
                onClick={() => trackCTAClick('nav', '無料で始める', '/markets')}
                className="bg-[var(--color-lp-mint)] text-white px-6 py-2 rounded-full hover:bg-[var(--color-lp-mint)]/90 transition-all hover:scale-105"
              >
                無料で始める
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div
              className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-[var(--color-lp-navy)] mb-6 font-[var(--font-poppins)]">
                その積立設定、
                <br />
                <span className="text-[var(--color-lp-mint)]">最適</span>ですか？
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto font-[var(--font-noto-sans-jp)]">
                ワンクリックで
                <span className="text-[var(--color-lp-blue)] font-semibold">"未来の最適解"</span>
                をシミュレーション
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link
                  href="/markets"
                  onClick={() =>
                    trackCTAClick('hero', '無料でシミュレーションを始める', '/markets')
                  }
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
                    <div className="h-64 bg-white rounded-2xl shadow-inner flex items-center justify-center">
                      <div className="text-slate-400 text-center">
                        <feature.icon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>機能デモ</p>
                      </div>
                    </div>
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
                <span className="text-[var(--color-lp-mint)] font-bold">自分だけの資産プラン</span>
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
              <div className="text-lg font-semibold text-[var(--color-lp-navy)] mb-4">NISA拡大</div>
              <p className="text-slate-600">年間買付額の増加</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-[var(--color-lp-mint)] mb-2">88%</div>
              <div className="text-lg font-semibold text-[var(--color-lp-navy)] mb-4">非課税枠</div>
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
            {[
              {
                q: '利用料金はかかりますか？',
                a: '基本機能は完全無料でご利用いただけます。',
              },
              {
                q: '投資の知識がなくても使えますか？',
                a: 'はい。初心者の方でも簡単にシミュレーションができるよう設計されています。',
              },
              {
                q: 'データの精度はどの程度ですか？',
                a: '複数のデータソースから最新の市場データを取得し、高い精度を保っています。',
              },
            ].map((faq, index) => (
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
            href="/markets"
            onClick={() => trackCTAClick('final', '無料でシミュレーションを始める', '/markets')}
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
  );
}
