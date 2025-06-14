'use client';

import StartPageCards from '@/components/StartPageCards';
import StartPageSearchSection from '@/components/StartPageSearchSection';

export default function StartPage() {
  return (
    <main className="min-h-screen bg-[var(--color-surface-alt)] dark:bg-[var(--color-surface-1)]">
      {/* ヘッダーセクション */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-6 font-[var(--font-poppins)]">
              何から始めますか？
            </h1>
            <p className="text-xl text-slate-600 dark:text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              あなたの「知りたい」に合わせて、最適なシミュレーションを選択してください
            </p>
          </div>

          {/* カードグリッドレイアウト */}
          <div className="space-y-12">
            {/* シナリオから始めるセクション */}
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-8 text-center">
                シナリオから始める
              </h2>
              <StartPageCards />
            </div>

            {/* 銘柄/指数から始めるセクション */}
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-8 text-center">
                銘柄・指数から始める
              </h2>
              <StartPageSearchSection />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
