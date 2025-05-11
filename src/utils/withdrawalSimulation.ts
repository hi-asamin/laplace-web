import { WithdrawalYearData, WithdrawalPlan, NisaTaxEffect } from '@/types/simulation';

// 取り崩しシミュレーションの計算
export function calculateWithdrawalSimulation(
  finalBalance: number,
  withdrawalPlan: WithdrawalPlan,
  annualRate: number
): WithdrawalYearData[] {
  const data: WithdrawalYearData[] = [];
  let remainingBalance = finalBalance;
  const years = withdrawalPlan.endAge - withdrawalPlan.startAge;

  for (let i = 0; i < years; i++) {
    const year = i + 1;
    const annualWithdrawal = withdrawalPlan.monthlyAmount * 12;

    // 取り崩し額の計算
    const withdrawalAmount =
      withdrawalPlan.withdrawalType === 'fixed'
        ? annualWithdrawal
        : remainingBalance * (withdrawalPlan.monthlyAmount / 100);

    // 課税額の計算（NISA枠外の場合）
    const taxAmount = calculateTaxAmount(withdrawalAmount, remainingBalance);

    // NISA節税額の計算
    const nisaTaxSavings = calculateNisaTaxSavings(withdrawalAmount, remainingBalance);

    // 残高の更新（運用益を考慮）
    remainingBalance = (remainingBalance - withdrawalAmount) * (1 + annualRate / 100);

    data.push({
      year,
      remainingBalance,
      withdrawalAmount,
      taxAmount,
      nisaTaxSavings,
    });
  }

  return data;
}

// 課税額の計算
function calculateTaxAmount(withdrawalAmount: number, remainingBalance: number): number {
  // 配当所得と譲渡所得の税率（20.315%）
  const taxRate = 0.20315;
  return withdrawalAmount * taxRate;
}

// NISA節税額の計算
function calculateNisaTaxSavings(withdrawalAmount: number, remainingBalance: number): number {
  // NISA枠内の取り崩し額を計算（例：NISA枠は120万円と仮定）
  const nisaLimit = 1200000;
  const nisaWithdrawal = Math.min(withdrawalAmount, nisaLimit);

  // 節税額の計算
  return calculateTaxAmount(nisaWithdrawal, remainingBalance);
}

// NISA節税効果の計算
export function calculateNisaTaxEffect(withdrawalData: WithdrawalYearData[]): NisaTaxEffect {
  const annualTaxSavings = withdrawalData.map((d) => d.nisaTaxSavings);
  const totalTaxSavings = annualTaxSavings.reduce((sum, amount) => sum + amount, 0);
  const withdrawalTaxAmount = withdrawalData.reduce((sum, d) => sum + d.taxAmount, 0);

  return {
    totalTaxSavings,
    annualTaxSavings,
    withdrawalTaxAmount,
  };
}
