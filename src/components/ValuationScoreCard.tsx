'use client';

import { useMemo } from 'react';
import { Activity, TrendingUp, Info } from 'lucide-react';
import Tooltip from '@/components/tooltip';

interface ValuationData {
  pbr: number;
  per: number;
  industryAvgPbr?: number;
  industryAvgPer?: number;
  industryName?: string;
  sampleSize?: number;
  lastUpdated?: string;
}

interface ValuationScoreCardProps {
  valuationData: ValuationData;
  className?: string;
}

export default function ValuationScoreCard({
  valuationData,
  className = '',
}: ValuationScoreCardProps) {
  // PBRの評価を計算
  const pbrEvaluation = useMemo(() => {
    const { pbr, industryAvgPbr } = valuationData;
    const avgPbr = industryAvgPbr || 1.5; // デフォルト業界平均

    let level: 'undervalued' | 'fair' | 'overvalued';
    let position: number; // 0-100のポジション

    if (pbr < avgPbr * 0.8) {
      level = 'undervalued';
      position = Math.max(0, (pbr / (avgPbr * 0.8)) * 33);
    } else if (pbr > avgPbr * 1.2) {
      level = 'overvalued';
      position = Math.min(100, 67 + ((pbr - avgPbr * 1.2) / (avgPbr * 0.8)) * 33);
    } else {
      level = 'fair';
      position = 33 + ((pbr - avgPbr * 0.8) / (avgPbr * 0.4)) * 34;
    }

    return { level, position: Math.round(position) };
  }, [valuationData]);

  // PERの評価を計算
  const perEvaluation = useMemo(() => {
    const { per, industryAvgPer } = valuationData;
    const avgPer = industryAvgPer || 15; // デフォルト業界平均

    let level: 'undervalued' | 'fair' | 'overvalued';
    let position: number; // 0-100のポジション

    if (per < avgPer * 0.8) {
      level = 'undervalued';
      position = Math.max(0, (per / (avgPer * 0.8)) * 33);
    } else if (per > avgPer * 1.2) {
      level = 'overvalued';
      position = Math.min(100, 67 + ((per - avgPer * 1.2) / (avgPer * 0.8)) * 33);
    } else {
      level = 'fair';
      position = 33 + ((per - avgPer * 0.8) / (avgPer * 0.4)) * 34;
    }

    return { level, position: Math.round(position) };
  }, [valuationData]);

  // 総合評価を計算
  const overallEvaluation = useMemo(() => {
    const pbrScore =
      pbrEvaluation.level === 'undervalued' ? 2 : pbrEvaluation.level === 'fair' ? 1 : 0;
    const perScore =
      perEvaluation.level === 'undervalued' ? 2 : perEvaluation.level === 'fair' ? 1 : 0;
    const totalScore = pbrScore + perScore;

    if (totalScore >= 3) {
      return {
        level: 'undervalued',
        text: '割安水準',
        description:
          'PBR・PERともに業界平均を下回っており、財務状況に対して株価が割安な状態です。投資タイミングとして魅力的な水準と考えられます。',
      };
    }
    if (totalScore >= 2) {
      return {
        level: 'fair',
        text: '適正水準',
        description:
          '財務指標が業界平均と比較してバランスの取れた状態です。企業の成長性や将来性を総合的に判断することが重要です。',
      };
    }
    return {
      level: 'overvalued',
      text: '割高水準',
      description:
        'PBR・PERが業界平均を上回っており、財務状況に対して株価が割高な可能性があります。投資判断は慎重に行うことをお勧めします。',
    };
  }, [pbrEvaluation, perEvaluation]);

  const getEvaluationColor = (level: string) => {
    switch (level) {
      case 'undervalued':
        return 'text-[var(--color-success)]';
      case 'overvalued':
        return 'text-[var(--color-danger)]';
      default:
        return 'text-[var(--color-lp-blue)]';
    }
  };

  const getEvaluationBgColor = (level: string) => {
    switch (level) {
      case 'undervalued':
        return 'bg-[var(--color-success)]';
      case 'overvalued':
        return 'bg-[var(--color-danger)]';
      default:
        return 'bg-[var(--color-lp-blue)]';
    }
  };

  // メーターコンポーネント
  const MeterGauge = ({
    value,
    position,
    level,
    title,
    description,
    industryAvg,
  }: {
    value: number;
    position: number;
    level: string;
    title: string;
    description: string;
    industryAvg?: number;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h4 className="text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-text-secondary)]">
            {title}
          </h4>
          <Tooltip content={description} title={title}>
            <span></span>
          </Tooltip>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
            {value.toFixed(1)}倍
          </div>
          {industryAvg && (
            <div className="text-xs text-[var(--color-gray-400)]">
              業界平均: {industryAvg.toFixed(1)}倍
            </div>
          )}
        </div>
      </div>

      {/* メーターゲージ */}
      <div className="relative">
        <div className="h-4 bg-[var(--color-surface-alt)] dark:bg-[var(--color-surface-3)] rounded-full overflow-hidden">
          {/* 背景グラデーション */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-success)] via-[var(--color-lp-blue)] to-[var(--color-danger)] opacity-20" />

          {/* インジケーター */}
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${getEvaluationBgColor(level)}`}
            style={{
              width: `${position}%`,
              transform: 'scaleX(0)',
              transformOrigin: 'left',
              animation: 'bar-grow 1s ease-out 0.5s forwards',
            }}
          />
        </div>

        {/* ラベル */}
        <div className="flex justify-between text-xs text-[var(--color-gray-400)] mt-2">
          <span>割安</span>
          <span>適正</span>
          <span>割高</span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`bg-[var(--color-surface)] rounded-2xl p-6 shadow-lg dark:bg-[var(--color-surface-2)] dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
            銘柄の診断評価 (Valuation Score)
          </h3>
          <Tooltip
            content={`銘柄の診断評価は、財務指標を基に株価の割安・割高を総合的に判定します。

【評価の仕組み】
PBR（株価純資産倍率）とPER（株価収益率）の2つの指標を業界平均と比較し、総合的に評価します。

【評価レベル】
• 割安水準：財務状況に対して株価が安い状態
• 適正水準：財務状況と株価がバランスの取れた状態  
• 割高水準：財務状況に対して株価が高い状態

【判定基準】
• 業界平均の80%未満：割安
• 業界平均の80%〜120%：適正
• 業界平均の120%超：割高

【活用方法】
• 投資タイミングの参考として活用
• 同業他社との比較検討
• 長期投資の判断材料として利用

【注意点】
• 成長性や将来性は考慮されていません
• 業界特性や市場環境も重要な判断要素です
• あくまで参考指標として総合的に判断してください`}
            title="銘柄の診断評価について"
          >
            <span></span>
          </Tooltip>
        </div>
        <Activity className="w-5 h-5 text-[var(--color-lp-mint)]" />
      </div>

      {/* 総合評価 */}
      <div className="text-center mb-8">
        <div className={`text-2xl font-bold mb-3 ${getEvaluationColor(overallEvaluation.level)}`}>
          現在の株価は【{overallEvaluation.text}】です
        </div>
        <div className="bg-[var(--color-surface-alt)] dark:bg-[var(--color-surface-3)] rounded-lg p-4 mb-2">
          <p className="text-sm text-[var(--color-gray-700)] dark:text-[var(--color-text-secondary)] leading-relaxed">
            {overallEvaluation.description}
          </p>
        </div>
        <p className="text-xs text-[var(--color-gray-500)] dark:text-[var(--color-text-muted)]">
          ※ この評価は財務指標に基づく参考情報です。投資判断は総合的に行ってください。
        </p>
      </div>

      {/* 割安度 (PBR) */}
      <MeterGauge
        value={valuationData.pbr}
        position={pbrEvaluation.position}
        level={pbrEvaluation.level}
        title="割安度 (Based on PBR)"
        description={`Price to Book Ratio（株価純資産倍率）は、株価を1株当たり純資産で割った値です。企業の純資産に対し、株価が割安かを判断する指標です。

【計算式】
PBR = 株価 ÷ 1株当たり純資産

【見方のポイント】
• 1倍未満: 理論的には割安（純資産より株価が安い）
• 1〜2倍: 適正水準
• 2倍超: 割高の可能性

【注意点】
• 業種によって適正水準は異なります
• 成長企業は高めになる傾向があります
• 一時的な要因による変動に注意が必要です`}
        industryAvg={valuationData.industryAvgPbr}
      />

      <div className="my-6 border-t border-[var(--color-surface-alt)] dark:border-[var(--color-surface-3)]" />

      {/* 収益性 (PER) */}
      <MeterGauge
        value={valuationData.per}
        position={perEvaluation.position}
        level={perEvaluation.level}
        title="収益性 (Based on PER)"
        description={`Price to Earnings Ratio（株価収益率）は、株価を1株当たり利益で割った値です。企業の稼ぐ力に対し、株価が割安かを判断する指標です。

【計算式】
PER = 株価 ÷ 1株当たり利益（EPS）

【見方のポイント】
• 低いほど割安、高いほど割高とされる
• 同業他社との比較が重要
• 将来の成長性も考慮する必要がある

【基準値の目安】
• 成長企業: 20〜30倍程度
• 安定企業: 10〜15倍程度
• 成熟企業: 5〜10倍程度

【注意点】
• 業種特性を考慮する必要があります
• 一時的な要因による変動に注意
• 将来の成長性も重要な判断材料です`}
        industryAvg={valuationData.industryAvgPer}
      />

      {/* 業界情報 */}
      {valuationData.industryName && (
        <div className="mt-6 bg-[var(--color-lp-mint)]/5 dark:bg-[var(--color-lp-mint)]/10 rounded-xl p-4 border border-[var(--color-lp-mint)]/20 dark:border-[var(--color-lp-mint)]/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-[var(--color-lp-mint)] mr-2" />
              <span className="text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-text-secondary)]">
                業界比較データ
              </span>
            </div>
            {valuationData.sampleSize && (
              <span className="text-xs bg-[var(--color-lp-mint)]/10 dark:bg-[var(--color-lp-mint)]/20 text-[var(--color-lp-mint)] px-2 py-1 rounded-full">
                {valuationData.sampleSize}社のデータ
              </span>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-text-muted)]">
              <span className="font-medium text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                {valuationData.industryName}
              </span>
              業界の平均的な水準と比較して評価しています。
            </p>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="text-center p-3 bg-white/50 dark:bg-[var(--color-surface-3)]/50 rounded-lg">
                <div className="text-xs text-[var(--color-gray-500)] dark:text-[var(--color-text-muted)] mb-1">
                  業界平均 PER
                </div>
                <div className="text-lg font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                  {valuationData.industryAvgPer?.toFixed(1) || 'N/A'}倍
                </div>
              </div>
              <div className="text-center p-3 bg-white/50 dark:bg-[var(--color-surface-3)]/50 rounded-lg">
                <div className="text-xs text-[var(--color-gray-500)] dark:text-[var(--color-text-muted)] mb-1">
                  業界平均 PBR
                </div>
                <div className="text-lg font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
                  {valuationData.industryAvgPbr?.toFixed(1) || 'N/A'}倍
                </div>
              </div>
            </div>

            {valuationData.lastUpdated && (
              <p className="text-xs text-[var(--color-gray-400)] mt-2">
                データ更新日: {new Date(valuationData.lastUpdated).toLocaleDateString('ja-JP')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
