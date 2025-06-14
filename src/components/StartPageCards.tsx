'use client';

import { PiggyBank, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ScenarioCardProps {
  title: string;
  icon: React.ElementType;
  ctaText: string;
  onClick: () => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ title, icon: Icon, ctaText, onClick }) => {
  return (
    <div className="bg-white dark:bg-[var(--color-surface-2)] rounded-2xl p-8 shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] hover:shadow-xl dark:hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105 border dark:border-[var(--color-surface-3)]">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-[var(--color-lp-mint)]/10 dark:bg-[var(--color-lp-mint)]/15 rounded-2xl flex items-center justify-center mb-6">
          <Icon className="w-8 h-8 text-[var(--color-lp-mint)]" />
        </div>
        <h3 className="text-xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-6 leading-tight">
          {title}
        </h3>
        <button
          onClick={onClick}
          className="bg-[var(--color-lp-mint)] text-white dark:text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-[var(--color-lp-mint)]/90 transition-all hover:scale-105 shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,255,196,0.3)]"
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
};

export default function StartPageCards() {
  const router = useRouter();

  const handleAccumulationSimulation = () => {
    // 積立シミュレーション（30年間、毎月3万円、想定利回り5%）
    const params = new URLSearchParams({
      q: 'total-assets',
      years: '30',
      monthlyAmount: '30000',
      averageYield: '5',
    });
    router.push(`/markets/self/simulation?${params.toString()}`);
  };

  const handleTargetSimulation = () => {
    // 目標達成シミュレーション（30年後、2,000万円、想定利回り5%）
    const params = new URLSearchParams({
      q: 'required-monthly',
      targetAmount: '20000000',
      years: '30',
      averageYield: '5',
    });
    router.push(`/markets/self/simulation?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ScenarioCard
        title="30年間、毎月3万円の積立NISAでいくら貯まる？"
        icon={PiggyBank}
        ctaText="この条件で試算する"
        onClick={handleAccumulationSimulation}
      />
      <ScenarioCard
        title="30年後までに2,000万円貯めるには？"
        icon={Target}
        ctaText="この条件で逆算する"
        onClick={handleTargetSimulation}
      />
    </div>
  );
}
