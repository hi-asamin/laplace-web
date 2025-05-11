export interface WithdrawalYearData {
  year: number;
  remainingBalance: number; // 残高
  withdrawalAmount: number; // 取り崩し額
  taxAmount: number; // 課税額
  nisaTaxSavings: number; // NISA節税額
}

export interface WithdrawalPlan {
  startAge: number; // 取り崩し開始年齢
  endAge: number; // 取り崩し終了年齢
  monthlyAmount: number; // 月間取り崩し額
  withdrawalType: 'fixed' | 'percentage'; // 取り崩しタイプ
}

export interface NisaTaxEffect {
  totalTaxSavings: number; // 累計節税額
  annualTaxSavings: number[]; // 年次節税額
  withdrawalTaxAmount: number; // 取り崩し時の課税額
}
