import { useState, useEffect } from 'react';
import {
  WithdrawalPlan as WithdrawalPlanType,
  WithdrawalYearData,
  NisaTaxEffect,
} from '@/types/simulation';
import {
  calculateWithdrawalSimulation,
  calculateNisaTaxEffect,
} from '@/utils/withdrawalSimulation';
import Tooltip from '@/components/tooltip';

interface WithdrawalPlanProps {
  finalBalance: number;
  annualRate: number;
}

export default function WithdrawalPlan({ finalBalance, annualRate }: WithdrawalPlanProps) {
  const [withdrawalPlan, setWithdrawalPlan] = useState<WithdrawalPlanType>({
    startAge: 65,
    endAge: 85,
    monthlyAmount: 100000,
    withdrawalType: 'fixed',
  });

  const [withdrawalData, setWithdrawalData] = useState<WithdrawalYearData[]>([]);
  const [nisaTaxEffect, setNisaTaxEffect] = useState<NisaTaxEffect | null>(null);

  useEffect(() => {
    const data = calculateWithdrawalSimulation(finalBalance, withdrawalPlan, annualRate);
    setWithdrawalData(data);
    setNisaTaxEffect(calculateNisaTaxEffect(data));
  }, [finalBalance, withdrawalPlan, annualRate]);

  return (
    <div className="bg-[var(--color-surface)] rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] lg:p-6 xl:p-8">
      <h2 className="text-base font-medium text-[var(--color-gray-900)] mb-4">取り崩しプラン</h2>

      {/* 取り崩し設定 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-[var(--color-gray-400)] mb-1">
            取り崩し開始年齢
          </label>
          <input
            type="number"
            value={withdrawalPlan.startAge}
            onChange={(e) =>
              setWithdrawalPlan((prev) => ({
                ...prev,
                startAge: Math.max(60, Math.min(100, Number(e.target.value))),
              }))
            }
            className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-lg text-base"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-gray-400)] mb-1">
            取り崩し終了年齢
          </label>
          <input
            type="number"
            value={withdrawalPlan.endAge}
            onChange={(e) =>
              setWithdrawalPlan((prev) => ({
                ...prev,
                endAge: Math.max(prev.startAge + 1, Math.min(100, Number(e.target.value))),
              }))
            }
            className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-lg text-base"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--color-gray-400)] mb-1">月間取り崩し額</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={withdrawalPlan.monthlyAmount}
              onChange={(e) =>
                setWithdrawalPlan((prev) => ({
                  ...prev,
                  monthlyAmount: Math.max(0, Number(e.target.value)),
                }))
              }
              className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-lg text-base"
            />
            <span className="text-base text-[var(--color-gray-700)]">円</span>
          </div>
        </div>
        <div>
          <label className="block text-sm text-[var(--color-gray-400)] mb-1">
            取り崩しタイプ
            <Tooltip
              title="取り崩しタイプ"
              content={`定額取り崩し：毎年同じ金額を取り崩します。
定率取り崩し：残高に対して一定の割合を取り崩します。

【見方のポイント】
• 定額は「毎年決まった生活費を確保したい」場合に便利
• 定率は「資産寿命を延ばしたい」「残高に応じて柔軟に使いたい」場合に有効

【例】
• 定額：毎年120万円ずつ取り崩す
• 定率：毎年残高の4%ずつ取り崩す`}
            >
              <span className="sr-only">取り崩しタイプの説明</span>
            </Tooltip>
          </label>
          <select
            value={withdrawalPlan.withdrawalType}
            onChange={(e) =>
              setWithdrawalPlan((prev) => ({
                ...prev,
                withdrawalType: e.target.value as 'fixed' | 'percentage',
              }))
            }
            className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-lg text-base"
          >
            <option value="fixed">定額取り崩し</option>
            <option value="percentage">定率取り崩し</option>
          </select>
        </div>
      </div>

      {/* 取り崩しシミュレーション結果 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[var(--color-gray-900)] mb-3">
          取り崩しシミュレーション結果
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--color-surface-alt)] rounded-lg p-3">
            <div className="text-xs text-[var(--color-gray-400)] mb-1">最終残高</div>
            <div className="text-lg font-semibold text-[var(--color-gray-900)]">
              ¥
              {Math.round(
                withdrawalData[withdrawalData.length - 1]?.remainingBalance || 0
              ).toLocaleString()}
            </div>
          </div>
          <div className="bg-[var(--color-surface-alt)] rounded-lg p-3">
            <div className="text-xs text-[var(--color-gray-400)] mb-1">累計取り崩し額</div>
            <div className="text-lg font-semibold text-[var(--color-gray-900)]">
              ¥
              {Math.round(
                withdrawalData.reduce((sum, d) => sum + d.withdrawalAmount, 0)
              ).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* NISA節税効果 */}
      {nisaTaxEffect && (
        <div>
          <h3 className="text-sm font-medium text-[var(--color-gray-900)] mb-3">NISA節税効果</h3>
          <div className="bg-[var(--color-surface-alt)] rounded-lg p-3">
            <div className="text-xs text-[var(--color-gray-400)] mb-1">累計節税額</div>
            <div className="text-lg font-semibold text-[var(--color-success)]">
              ¥{Math.round(nisaTaxEffect.totalTaxSavings).toLocaleString()}
            </div>
            <div className="text-xs text-[var(--color-gray-400)] mt-2">
              ※NISA枠内での取り崩しにより節税された金額です
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
