// シミュレーション機能の型定義

// 目的タイプ（「貯める」「使う」）
export type SimulationPurpose = 'save' | 'use';

// 「貯める」モードの問いタイプ
export type SaveQuestionType =
  | 'total-assets'
  | 'required-yield'
  | 'required-monthly'
  | 'required-years';

// 「使う」モードの問いタイプ
export type UseQuestionType = 'required-assets' | 'withdrawal-amount' | 'asset-lifespan';

// シミュレーション設定
export interface SimulationSettings {
  purpose: SimulationPurpose;
  questionType: SaveQuestionType | UseQuestionType;

  // 共通パラメータ
  averageYield: number; // 平均利回り率（%）
  years: number; // 期間（年）

  // 「貯める」モードのパラメータ
  initialPrincipal?: number; // 初期投資元本（円）
  monthlyAmount?: number; // 毎月積立金額（円）
  targetAmount?: number; // 目標金額（円）

  // 「使う」モードのパラメータ
  initialAssets?: number; // 初期資産額（円）
  withdrawalAmount?: number; // 月間取り崩し額（万円）
  withdrawalRate?: number; // 取り崩し率（%）
  withdrawalType?: 'fixed' | 'percentage'; // 取り崩しタイプ
}

// シミュレーション年次データ
export interface SimulationYearData {
  year: number;
  principal: number; // 元本
  dividendProfit: number; // 配当利益
  totalAssets: number; // 総資産
  withdrawalAmount?: number; // 取り崩し額（使うモードのみ）
}

// シミュレーション結果
export interface SimulationResult {
  data: SimulationYearData[];
  calculatedValue?: number; // 逆算結果
  isSuccess: boolean;
  errorMessage?: string;
}

// 問いの選択肢定義
export interface QuestionOption {
  value: SaveQuestionType | UseQuestionType;
  label: string;
  description: string;
}

// 問いの選択肢リスト
export const SAVE_QUESTIONS: QuestionOption[] = [
  {
    value: 'total-assets',
    label: '資産総額は？',
    description: '設定した条件でいくら貯まるかを計算します',
  },
  {
    value: 'required-yield',
    label: '必要利回りは？',
    description: '目標金額に到達するために必要な利回りを計算します',
  },
  {
    value: 'required-monthly',
    label: '必要積立額は？',
    description: '目標金額に到達するために必要な毎月の積立額を計算します',
  },
  {
    value: 'required-years',
    label: '必要期間は？',
    description: '目標金額に到達するために必要な期間を計算します',
  },
];

export const USE_QUESTIONS: QuestionOption[] = [
  {
    value: 'required-assets',
    label: 'いくら必要？',
    description: '希望する取り崩し条件に必要な資産額を計算します',
  },
  {
    value: 'withdrawal-amount',
    label: 'いくら使える？',
    description: '保有資産でどれくらい取り崩せるかを計算します',
  },
  {
    value: 'asset-lifespan',
    label: '何年でなくなる？',
    description: '現在の取り崩し条件で資産がいつまで持つかを計算します',
  },
];
