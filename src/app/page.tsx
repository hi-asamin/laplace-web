import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAFC]">
      {/* ヘッダー */}
      <header className="w-full bg-white/80 backdrop-blur-md shadow-sm py-3 px-4 flex items-center justify-between fixed top-0 left-0 z-50">
        <div className="flex items-center gap-2">
          <span
            className="text-2xl font-bold text-[#0F172A] tracking-tight"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            LAPLACE
          </span>
        </div>
        <nav className="hidden md:flex gap-8 text-[#334155] text-base font-medium">
          <Link href="#feature-simulation" className="hover:text-[#3B82F6] transition">
            特徴
          </Link>
          <Link href="#howto" className="hover:text-[#3B82F6] transition">
            使い方
          </Link>
        </nav>
        <Link
          href="/search"
          className="px-6 py-2 rounded-full bg-[#3B82F6] text-white font-bold shadow hover:bg-[#2563EB] transition text-base"
        >
          無料で始める
        </Link>
      </header>

      {/* ヒーローセクション */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] pt-40 pb-0 px-4 bg-gradient-to-br from-[#18181B] via-[#6366F1] to-[#38BDF8] overflow-hidden">
        {/* グラデーションの上に重ねる */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto">
          <h1
            className="text-3xl md:text-5xl font-extrabold text-white text-center mb-10 tracking-wide leading-tight"
            style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em', lineHeight: '0.5' }}
          >
            <span>複雑な投資計算を</span>
            <span
              className="block text-3xl md:text-5xl tracking-wide leading-tight mt-8"
              style={{ letterSpacing: '-0.01em', marginTop: '2rem' }}
            >
              ワンクリックで
            </span>
          </h1>
          <p
            className="text-lg md:text-xl text-white/90 text-center mb-6 max-w-xl"
            style={{ fontFamily: 'Inter, sans-serif', lineHeight: '2' }}
          >
            将来の資産シミュレーションを行う場合や配当金の複利計算も
            <br />
            銘柄を選ぶだけで簡単に算出することができます。
          </p>
          <Link
            href="/search"
            className="mb-1 px-10 py-4 rounded-full bg-[#3B82F6] text-white text-lg font-bold shadow-lg hover:bg-[#2563EB] transition"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            シミュレーションする
          </Link>
          {/* グラフ＋スマホ画像を重ねて配置 */}
          <div
            className="relative w-full flex items-end justify-center mt-2"
            style={{ minHeight: 320 }}
          >
            <Image src="/hero-graph.png" alt="グラフUI" width={974} height={578} />
          </div>
        </div>
        {/* グラデーションの装飾（ぼかし） */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#6366F1] opacity-30 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-[#38BDF8] opacity-30 rounded-full blur-3xl" />
        </div>
      </section>

      {/* お悩みセクション（画像サイズ調整済み） */}
      <section className="w-full bg-white py-24 px-4">
        <div
          className="text-[#3B82F6] font-bold text-base text-center mb-2"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          投資初心者がぶつかる壁
        </div>
        <h2
          className="text-2xl md:text-3xl font-bold text-[#0F172A] text-center mb-12"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          こんなお悩みありませんか？
        </h2>
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto justify-center">
          {/* 悩み1 */}
          <div className="flex-1 flex flex-col items-center bg-[#F7FAFC] rounded-2xl shadow p-8 min-w-[260px] max-w-[340px] mx-auto">
            <Image
              src="/trouble1.png"
              alt="投資リスクをイメージしづらい"
              width={250}
              height={250}
              className="mb-4 object-contain"
            />
            <h3 className="font-bold text-lg mb-2 text-[#0F172A]">投資リスクをイメージしづらい</h3>
            <p className="text-[#334155] text-sm text-center">
              どれくらい下がると危険なのか、感覚でしか分からない
            </p>
          </div>
          {/* 悩み2 */}
          <div className="flex-1 flex flex-col items-center bg-[#F7FAFC] rounded-2xl shadow p-8 min-w-[260px] max-w-[340px] mx-auto">
            <Image
              src="/trouble2.png"
              alt="新規銘柄が選びづらい"
              width={250}
              height={250}
              className="mb-4 object-contain"
            />
            <h3 className="font-bold text-lg mb-2 text-[#0F172A]">新規銘柄が選びづらい</h3>
            <p className="text-[#334155] text-sm text-center">
              どの銘柄が自分に合うか、比較が難しい
            </p>
          </div>
          {/* 悩み3 */}
          <div className="flex-1 flex flex-col items-center bg-[#F7FAFC] rounded-2xl shadow p-8 min-w-[260px] max-w-[340px] mx-auto">
            <Image
              src="/trouble3.png"
              alt="手段の選択肢が多すぎる"
              width={250}
              height={250}
              className="mb-4 object-contain"
            />
            <h3 className="font-bold text-lg mb-2 text-[#0F172A]">手段の選択肢が多すぎる</h3>
            <p className="text-[#334155] text-sm text-center">
              積立・一括・ETF…何がベストか分からない
            </p>
          </div>
        </div>
      </section>

      {/* LAPLACEの特徴セクション（画像サイズ調整済み） */}
      <section id="feature-laplace" className="w-full bg-[#F7FAFC] py-20 px-4">
        <div
          className="text-[#3B82F6] font-bold text-base text-center mb-2"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          投資試算のあるあるを解決
        </div>
        <h2
          className="text-2xl md:text-3xl font-bold text-[#0F172A] text-center mb-12"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          LAPLACEの特徴
        </h2>
        <div className="flex flex-col gap-16 max-w-6xl mx-auto">
          {/* 特徴1 */}
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <Image
              src="/feature-pc-1.png"
              alt="特徴1 PC画面"
              width={560}
              height={374}
              className="rounded-xl shadow-lg object-cover w-full max-w-[560px]"
            />
            <div className="flex-1 min-w-[220px]">
              <h3 className="font-bold text-2xl mb-4 text-[#0F172A]">1. 銘柄を選択</h3>
              <p className="text-[#334155] text-base">
                気になる銘柄を選ぶだけでOK。初心者でも迷わず操作できます。
              </p>
            </div>
          </div>
          {/* 特徴2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
            <Image
              src="/feature-pc-2.png"
              alt="特徴2 スマホ画面"
              width={560}
              height={374}
              className="rounded-xl shadow-lg object-cover w-full max-w-[560px]"
            />
            <div className="flex-1 min-w-[220px]">
              <h3 className="font-bold text-2xl mb-4 text-[#0F172A]">2. 条件を入力</h3>
              <p className="text-[#334155] text-base">
                積立額や期間、利回りなどを入力するだけ。シンプルなUIで直感的に設定できます。
              </p>
            </div>
          </div>
          {/* 特徴3 */}
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <Image
              src="/feature-pc-3.png"
              alt="特徴3 PC画面"
              width={560}
              height={374}
              className="rounded-xl shadow-lg object-cover w-full max-w-[560px]"
            />
            <div className="flex-1 min-w-[220px]">
              <h3 className="font-bold text-2xl mb-4 text-[#0F172A]">3. 結果を確認</h3>
              <p className="text-[#334155] text-base">
                将来の資産推移やリスクをグラフで一目で確認できます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* シミュレーション結果セクション */}
      <section className="w-full bg-white py-20 px-4">
        <div
          className="text-[#3B82F6] font-bold text-base text-center mb-2"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          10年後の総資産や配当金合計がすぐに確認できます
        </div>
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-[#0F172A] text-center mb-6"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            シミュレーション結果が一目瞭然
          </h2>
          <p className="text-[#334155] text-base text-center mb-10 max-w-2xl">
            LAPLACEでは、シミュレーション結果をグラフで直感的に確認できます。
            <br />
            将来の資産推移やリスクを一目で把握できるので、投資判断がより明確に。
          </p>
          <div className="w-full flex flex-col items-center">
            <Image
              src="/result-graph.png"
              alt="シミュレーション結果グラフ"
              width={900}
              height={420}
              className="rounded-2xl shadow-2xl border border-[#E5E7EB] bg-white max-w-full"
            />
            <div className="flex flex-col md:flex-row gap-4 mt-8 w-full justify-center items-center">
              <div className="bg-[#F7FAFC] rounded-xl px-6 py-3 text-center shadow text-[#0F172A] font-bold text-lg">
                ¥12,498,931
              </div>
              <button className="px-8 py-3 rounded-full bg-[#3B82F6] text-white font-bold shadow hover:bg-[#2563EB] transition text-base">
                2銘柄で比較してみる
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 将来資産シミュレーションを"リアルタイム"で最適化セクション */}
      <section id="feature-simulation" className="w-full bg-[#0F172A] py-24 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-16 items-center">
          {/* 左カラム：テキスト＋メリット（PC時）/ テキストのみ（SP時） */}
          <div className="flex flex-col gap-8 w-full">
            <div>
              <div
                className="text-[#38BDF8] font-bold text-base text-left mb-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                根拠ある資産シミュレーションを簡単に
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                将来資産シミュレーションを
                <br />
                "リアルタイム"で最適化
              </h2>
              <p
                className="text-[#CBD5E1] text-base md:text-lg mb-2 max-w-xl"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                リアルタイム計算エンジンにより、入力内容を更新した瞬間にグラフとKPIが再描画されます。
                <br />
                初心者でも迷わず操作できるガイド付きUIと合わせて、投資判断に必要な数字をワンストップで取得できます。
              </p>
            </div>
            {/* SP時のみアイコン群をここに表示 */}
            <div className="block lg:hidden w-full flex justify-center my-8">
              <Image
                src="/feature-icons.png"
                alt="特徴アイコン群"
                width={320}
                height={320}
                className="object-contain max-w-xs mx-auto"
              />
            </div>
            {/* メリット3点 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* メリット1 */}
              <div className="flex flex-col items-start gap-3">
                <Image
                  src="/icon-merit-calendar.png"
                  alt="自動パラメータ補完"
                  width={48}
                  height={48}
                  className="mb-1"
                />
                <div className="font-bold text-white text-lg mb-1">自動パラメータ補完</div>
                <div className="text-[#CBD5E1] text-sm">
                  最新の配当利回り・PER・PBRをAPIで取得し、推奨値をワンクリック入力。手間なく"根拠ある"試算が可能。
                </div>
              </div>
              {/* メリット2 */}
              <div className="flex flex-col items-start gap-3">
                <Image
                  src="/icon-merit-bag.png"
                  alt="リアルタイム資産推移"
                  width={48}
                  height={48}
                  className="mb-1"
                />
                <div className="font-bold text-white text-lg mb-1">リアルタイム資産推移</div>
                <div className="text-[#CBD5E1] text-sm">
                  金額や年数を変えた瞬間にグラフとKPIを再計算。1・5・10年タブを切り替えながら増加イメージを直感把握。
                </div>
              </div>
              {/* メリット3 */}
              <div className="flex flex-col items-start gap-3">
                <Image
                  src="/icon-merit-chat.png"
                  alt="シナリオ比較ダッシュボード"
                  width={48}
                  height={48}
                  className="mb-1"
                />
                <div className="font-bold text-white text-lg mb-1">シナリオ比較ダッシュボード</div>
                <div className="text-[#CBD5E1] text-sm">
                  最大3パターンを並列表示し、総資産・配当累計・許容下落率をカード＆チャートで比較。勝ち筋が一目で分かる。
                </div>
              </div>
            </div>
          </div>
          {/* 右カラム：PC時のみアイコン群 */}
          <div className="hidden lg:flex justify-center lg:justify-end w-full">
            <Image
              src="/feature-icons.png"
              alt="特徴アイコン群"
              width={400}
              height={400}
              className="object-contain max-w-full"
            />
          </div>
        </div>
      </section>

      {/* 誰でも使えるユーザビリティの高さセクション */}
      <section className="w-full bg-[#F7FAFC] py-24 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* 左：スマホ画像 */}
          <div className="flex-1 flex justify-center items-center mb-8 lg:mb-0">
            <Image
              src="/usability-phones.png"
              alt="スマホ画面モック"
              width={420}
              height={420}
              className="object-contain max-w-xs sm:max-w-md md:max-w-lg lg:max-w-full"
            />
          </div>
          {/* 右：テキスト */}
          <div className="flex-1 flex flex-col items-start justify-center max-w-xl mx-auto lg:mx-0">
            <div
              className="text-[#3B82F6] font-bold text-base text-left mb-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              誰でも使えるユーザビリティの高さ
            </div>
            <h2
              className="text-2xl md:text-4xl font-bold text-[#0F172A] mb-6 leading-tight"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              スキマ時間に、かんたん資産シミュレーター
            </h2>
            <p
              className="text-[#334155] text-base md:text-lg mb-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              スマホひとつで資産シミュレーションをいつでも再開。
              <br />
              モバイル専用レイアウトとワンタップ入力候補で、外出先でも片手でラクラク操作。
              <br />
              もうWeb検索して利回り実績を考えて入力する手間は不要です。
            </p>
          </div>
        </div>
        {/* メリット3点 */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* メリット1 */}
          <div className="flex flex-col items-center text-center gap-3">
            <Image
              src="/icon-merit-restart.png"
              alt="中断しても即リスタート"
              width={48}
              height={48}
              className="mb-1"
            />
            <div className="font-bold text-[#0F172A] text-lg mb-1">中断しても即リスタート</div>
            <div className="text-[#334155] text-sm">
              アプリが操作履歴をクラウドに自動保存。次に開いた瞬間、最後の入力画面からそのまま続行できます。
            </div>
          </div>
          {/* メリット2 */}
          <div className="flex flex-col items-center text-center gap-3">
            <Image
              src="/icon-merit-bag.png"
              alt="ワンタップ入力候補"
              width={48}
              height={48}
              className="mb-1"
            />
            <div className="font-bold text-[#0F172A] text-lg mb-1">ワンタップ入力候補</div>
            <div className="text-[#334155] text-sm">
              積立額・年数・利回りを"推奨値"ボタンで一括入力。数字に迷わずシミュレーションを始められます。
            </div>
          </div>
          {/* メリット3 */}
          <div className="flex flex-col items-center text-center gap-3">
            <Image
              src="/icon-merit-agefree.png"
              alt="年齢問わず操作可能"
              width={48}
              height={48}
              className="mb-1"
            />
            <div className="font-bold text-[#0F172A] text-lg mb-1">年齢問わず操作可能</div>
            <div className="text-[#334155] text-sm">
              シンプルで直感的なインターフェースで、幅広い年齢層に適した操作性/催促を提供します。使いやすさと親しみやすさを追求し、誰もが簡単に利用できます。
            </div>
          </div>
        </div>
      </section>

      {/* ラストCTAセクション */}
      <section className="w-full bg-[#F7FAFC] py-12 px-4 flex justify-center items-center">
        <div
          className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between min-h-[320px]"
          style={{ background: 'rgba(0,0,0,0.7)' }}
        >
          {/* 背景画像 */}
          <Image
            src="/cta-bg.png"
            alt="海岸空撮"
            fill
            priority
            className="object-cover w-full h-full absolute inset-0 z-0"
            style={{ filter: 'brightness(0.7)' }}
          />
          {/* オーバーレイ */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          {/* テキスト */}
          <div className="relative z-20 flex-1 flex flex-col justify-center items-start px-8 py-12 md:py-0">
            <div className="text-white/80 text-lg mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              かんたんな入力で
            </div>
            <h2
              className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight drop-shadow-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              スグはじめられる
              <br />
              LAPLACEで試算しよう
            </h2>
          </div>
          {/* CTAボタン */}
          <div className="relative z-20 flex-1 flex justify-center md:justify-end items-center px-8 pb-8 md:pb-0">
            <Link
              href="/search"
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-[#18181B] text-white text-lg font-bold shadow-lg hover:bg-[#0F172A] transition min-w-[220px] justify-center"
            >
              シミュレーションする
              <Image
                src="/icon-arrow-right.png"
                alt="矢印"
                width={24}
                height={24}
                className="ml-2"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-[#F7FAFC] py-16 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-4 px-4">
          <span
            className="text-5xl font-extrabold tracking-widest text-[#0F172A]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            LAPLACE
          </span>
          <span className="text-sm text-[#334155] mt-8">© 2023 example All Right Reserved.</span>
        </div>
      </footer>
    </div>
  );
}
