import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight, LineChart, PieChart, Search, TrendingUp } from 'lucide-react';

import { Button } from '@/components/button';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7FAFC]">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=32&width=32"
              alt="Laplace Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-xl font-bold text-[#0F172A]">Laplace</span>
          </div>
          <nav className="hidden md:flex md:gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-[#334155] hover:text-[#5965FF]"
            >
              機能
            </Link>
            <Link
              href="#problem"
              className="text-sm font-medium text-[#334155] hover:text-[#5965FF]"
            >
              課題
            </Link>
            <Link
              href="#target"
              className="text-sm font-medium text-[#334155] hover:text-[#5965FF]"
            >
              対象ユーザー
            </Link>
            <Link href="#value" className="text-sm font-medium text-[#334155] hover:text-[#5965FF]">
              価値提案
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="hidden md:flex">
              ログイン
            </Button>
            <Button className="bg-[#5965FF] text-white hover:bg-[#414DFF] shadow-[0_2px_6px_rgba(89,101,255,0.3)]">
              無料で始める
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-[#5965FF]/10 to-[#ECF9F3]/30">
          <div className="max-w-4xl mx-auto w-full">
            <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-4 pt-12 pb-8 mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-[#0F172A] text-center mb-4 drop-shadow-sm">
                初心者でもワンクリックで
                <span className="text-[#5965FF]">意味のある</span>
                将来比較ができる唯一の資産シミュレーター
              </h1>
              <p className="text-lg md:text-2xl text-[#334155] text-center mb-6 font-medium">
                資産形成を簡単に、そして賢く
              </p>
              <Link
                href="/search"
                className="w-full max-w-xs h-14 rounded-full bg-[#5965FF] text-white text-lg font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-[#414DFF] transition mb-4"
                aria-label="無料でシミュレーションを始める"
              >
                無料でシミュレーションを始める
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] text-center mb-8">
              Laplaceでできること
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-[#ECF9F3] rounded-[28px] p-6 shadow-sm flex flex-col gap-2">
                <div className="bg-[#E2F1EA] rounded-full w-10 h-10 flex items-center justify-center mb-2">
                  <Search className="h-6 w-6 text-[#5965FF]" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-1">ワンクリック自動入力</h3>
                <p className="text-[#334155] text-sm">
                  銘柄コードやティッカーを入力するだけで株価・配当・PER/PBR・税率まで自動取得。初心者でも迷わず入力できます。
                </p>
              </div>
              <div className="bg-[#ECF9F3] rounded-[28px] p-6 shadow-sm flex flex-col gap-2">
                <div className="bg-[#E2F1EA] rounded-full w-10 h-10 flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-[#5965FF]" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-1">シナリオ横並び比較</h3>
                <p className="text-[#334155] text-sm">
                  複数の投資シナリオをカードUIで同時比較。株A×積立／ETF
                  B×一括／預金など異種比較もワンクリックで切替。
                </p>
              </div>
              <div className="bg-[#ECF9F3] rounded-[28px] p-6 shadow-sm flex flex-col gap-2">
                <div className="bg-[#E2F1EA] rounded-full w-10 h-10 flex items-center justify-center mb-2">
                  <PieChart className="h-6 w-6 text-[#5965FF]" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-1">インサイト自動提示</h3>
                <p className="text-[#334155] text-sm">
                  税引後配当総額、Yield-on-Cost、元本割れ許容幅など「意思決定に直結する3指標」を自動で大きく表示。
                </p>
              </div>
              <div className="bg-[#ECF9F3] rounded-[28px] p-6 shadow-sm flex flex-col gap-2">
                <div className="bg-[#E2F1EA] rounded-full w-10 h-10 flex items-center justify-center mb-2">
                  <LineChart className="h-6 w-6 text-[#5965FF]" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-1">
                  リスク&不確実性の可視化
                </h3>
                <p className="text-[#334155] text-sm">
                  ボラティリティを年率σで取り込み、モンテカルロ1,000本を1秒未満で描画。下位5パーセンタイルの評価額も可視化。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section id="problem" className="py-12 md:py-24 bg-[#F7FAFC]">
          <div className="max-w-4xl mx-auto w-full px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-4">
                資産形成ツールの機能ギャップと市場インパクト
              </h2>
              <p className="text-lg text-[#334155] max-w-[800px]">
                現在の資産形成ツールには、重要な機能が欠けています。
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-[28px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <h3 className="text-xl font-semibold text-[#0F172A] mb-2">
                  シミュレーション・ギャップ
                </h3>
                <p className="text-[#334155]">
                  <strong>家計金融資産の50.9%が現預金で滞留</strong>
                  し、株式等は14.2%にとどまる（2024Q4資金循環統計）ため、「投資した場合に資産がどう増減するか」を可視化できるツールへのニーズは構造的に大きい。
                </p>
              </div>
              <div className="bg-white rounded-[28px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <h3 className="text-xl font-semibold text-[#0F172A] mb-2">比較不能・判断不能</h3>
                <p className="text-[#334155]">
                  既存ポータル（Yahoo!ファイナンス等）は<strong>点データ</strong>
                  （株価・配当利回り）の提示に留まり、「配当再投資を含む将来総資産」や「何円下落まで許容できるか」を
                  <strong>時系列で比較</strong>する機能がない。
                </p>
              </div>
              <div className="bg-white rounded-[28px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <h3 className="text-xl font-semibold text-[#0F172A] mb-2">金融リテラシーの壁</h3>
                <p className="text-[#334155]">
                  金融教育の受講経験はわずか<strong>8%</strong>
                  に過ぎず、「複利の効果を理解できていない」ことが投資開始の障壁になっている。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Target User Section */}
        <section id="target" className="py-12 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto w-full px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-4">
                対象ユーザー
              </h2>
              <p className="text-lg text-[#334155] max-w-[800px]">
                Laplaceは、以下のようなユーザーに最適です。
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-6 text-left text-[#0F172A] font-semibold">項目</th>
                    <th className="py-4 px-6 text-left text-[#0F172A] font-semibold">
                      プライマリーユーザー
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 text-[#334155] font-medium">投資経験</td>
                    <td className="py-4 px-6 text-[#334155]">NISA・ETFなどを年1回以上売買</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 text-[#334155] font-medium">年代</td>
                    <td className="py-4 px-6 text-[#334155]">20〜40代前半</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 text-[#334155] font-medium">世帯</td>
                    <td className="py-4 px-6 text-[#334155]">単身／DINKs（子なし夫婦）</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 text-[#334155] font-medium">年収</td>
                    <td className="py-4 px-6 text-[#334155]">500万円以上</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 text-[#334155] font-medium">月間投資額</td>
                    <td className="py-4 px-6 text-[#334155]">手取りの20%（約3万円〜）</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-[#334155] font-medium">行動特性</td>
                    <td className="py-4 px-6 text-[#334155]">
                      家計簿／証券口座アプリ利用、株価指数を定期ウォッチ
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-[#94A3B8] mt-4 text-center">
              ※投資未経験者は将来拡張ターゲット
            </p>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section id="value" className="py-12 md:py-24 bg-[#F7FAFC]">
          <div className="max-w-4xl mx-auto w-full px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-4">価値提案</h2>
              <p className="text-lg text-[#334155] max-w-[800px]">Laplaceが提供する独自の価値</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-white rounded-[28px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#E2F1EA] rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                    <span className="text-[#5965FF] font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#0F172A]">ワンクリック自動入力</h3>
                </div>
                <p className="text-[#334155]">
                  銘柄コードorティッカーを入力するだけで株価・配当履歴・PER／PBR・税率までリアルタイムで取得。
                  取込APIは冗長化しており、データ欠損時は自動フェイルオーバー（Yahoo Finance → IEX
                  Cloud → 代替CSV）の3段階で完結させる。
                  初心者でも「知識がなくて入力できない」壁がゼロになる。
                </p>
              </div>
              <div className="bg-white rounded-[28px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#E2F1EA] rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                    <span className="text-[#5965FF] font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#0F172A]">シナリオ横並び比較</h3>
                </div>
                <p className="text-[#334155]">
                  単一銘柄の推移グラフに留まらず、"カード"UIでシナリオを同時表示。 株A×定期買付／ETF
                  B×一括投資／預金0.02%といった異種比較がワンクリックで切替えられ、
                  優劣は差分ハイライトで瞬時に把握できる。
                </p>
              </div>
              <div className="bg-white rounded-[28px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#E2F1EA] rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                    <span className="text-[#5965FF] font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#0F172A]">インサイト自動提示</h3>
                </div>
                <p className="text-[#334155]">
                  シナリオ間の税引後配当総額、Yield-on-Cost、元本割れ許容幅を自動算出し、
                  チャートより先に「意思決定に直結する3指標」を大きく表示。
                  視覚的に"◯◯円下落しても配当で回収できる"まで分かるため、リスク許容度も具体的に測れる。
                </p>
              </div>
              <div className="bg-white rounded-[28px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#E2F1EA] rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                    <span className="text-[#5965FF] font-bold">4</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#0F172A]">
                    リスク & 不確実性の可視化
                  </h3>
                </div>
                <p className="text-[#334155]">
                  ボラティリティを年率σとして取り込み、モンテカルロ1,000本を1秒未満で描画。
                  「下位5パーセンタイルの10年後評価額」まで示すことで、値下がり許容度を数字で示す。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Now Section */}
        <section className="py-12 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto w-full px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-4">
                Why Now?（背景）
              </h2>
              <p className="text-lg text-[#334155] max-w-[800px]">なぜ今、Laplaceが必要なのか</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-[#ECF9F3] rounded-[28px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                  NISA口座は半期+130万件、残高+16%
                </h3>
                <p className="text-[#334155] text-sm">
                  FSA統計によると2024-06→12で2,430→2,560万口座、残高45.4→52.7兆円。金融リテラシー層が急拡大。
                </p>
              </div>
              <div className="bg-[#ECF9F3] rounded-[28px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                  家計の"現金50%依存"は維持
                </h3>
                <p className="text-[#334155] text-sm">
                  家計資産は現金50.9%、株等14.2%（前年比+2.8pt）。"移行初期"にリスクとリターンを可視化するツールが不可欠。
                </p>
              </div>
              <div className="bg-[#ECF9F3] rounded-[28px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                  拡張NISAの非課税枠の約88%が未使用
                </h3>
                <p className="text-[#334155] text-sm">
                  1口座平均残高206万円＜終身上限1,800万円。枠の最適配分を試算する需要が高い。
                </p>
              </div>
              <div className="bg-[#ECF9F3] rounded-[28px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                  ETF推奨率70%、若年層はETF志向
                </h3>
                <p className="text-[#334155] text-sm">
                  アドバイザーの7割がETFを積極推奨、ミレニアルの購入意欲も急伸。複数銘柄シナリオ比較が求められる。
                </p>
              </div>
              <div className="bg-[#ECF9F3] rounded-[28px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                  インフレ2.5%・金利+0.5ptで"現金劣化"が顕在化
                </h3>
                <p className="text-[#334155] text-sm">
                  BOJの政策転換を受け、実質リターンを追求する層が増加。
                </p>
              </div>
              <div className="bg-[#ECF9F3] rounded-[28px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                  既存ツールは"現在資産の可視化"中心
                </h3>
                <p className="text-[#334155] text-sm">
                  将来シミュレーションが弱く、ユーザーのニーズに応えられていない。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24 bg-[#5965FF]/10">
          <div className="max-w-4xl mx-auto w-full px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-4">
                あなたの資産形成を、もっとスマートに
              </h2>
              <p className="text-lg text-[#334155] max-w-[800px] mb-8">
                Laplaceを使って、あなたの投資判断をデータに基づいて最適化しましょう。
                無料でシミュレーションを始めることができます。
              </p>
              <Button
                size="lg"
                className="bg-[#5965FF] text-white hover:bg-[#414DFF] shadow-[0_2px_6px_rgba(89,101,255,0.3)] text-base"
              >
                今すぐ無料で始める
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* ワンクリックシミュレーションの手順 */}
        <section className="py-12 md:py-20 bg-[#F7FAFC]">
          <div className="max-w-4xl mx-auto w-full px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] text-center mb-8">
              ワンクリックでシミュレーション
            </h2>
            <ol className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
              <li className="flex flex-col items-center text-center">
                <div className="bg-[#E2F1EA] rounded-full w-16 h-16 flex items-center justify-center mb-3">
                  <Search className="h-8 w-8 text-[#5965FF]" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-1">銘柄を選択する</h3>
                <p className="text-[#334155] text-sm mb-2">検索画面で気になる銘柄を選びます。</p>
                <Link
                  href="/search"
                  className="inline-flex items-center text-[#5965FF] hover:underline text-sm font-medium"
                >
                  銘柄を検索する <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </li>
              <li className="flex flex-col items-center text-center">
                <div className="bg-[#E2F1EA] rounded-full w-16 h-16 flex items-center justify-center mb-3">
                  <TrendingUp className="h-8 w-8 text-[#5965FF]" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-1">
                  シミュレーションボタンを押す
                </h3>
                <p className="text-[#334155] text-sm mb-2">
                  銘柄詳細ページで「この銘柄でシミュレーション」ボタンを押すだけ。
                </p>
                <span className="inline-flex items-center text-[#5965FF] text-sm font-medium opacity-60 cursor-not-allowed">
                  シミュレーション画面へ <ChevronRight className="w-4 h-4 ml-1" />
                </span>
              </li>
            </ol>
          </div>
        </section>
      </main>
      <footer className="bg-[#0F172A] text-white py-12">
        <div className="max-w-4xl mx-auto w-full px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="Laplace Logo"
                  width={32}
                  height={32}
                  className="rounded-full bg-white"
                />
                <span className="text-xl font-bold">Laplace</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                初心者でもワンクリックで意味のある将来比較ができる唯一の資産シミュレーター。
                投資判断に不可欠なシナリオ比較と実データ自動入力を提供します。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">製品</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    機能
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    料金プラン
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    よくある質問
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    ロードマップ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">会社情報</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    私たちについて
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    ブログ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    採用情報
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    お問い合わせ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">法的情報</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    利用規約
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    プライバシーポリシー
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    特定商取引法に基づく表記
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Laplace Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
