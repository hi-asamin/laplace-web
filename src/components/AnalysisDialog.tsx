import { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Tooltip from '@/components/tooltip';

interface AnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: (settings: {
    mode: 'save' | 'spend';
    variable:
      | 'total-assets'
      | 'yield'
      | 'monthly'
      | 'years'
      | 'withdrawal-amount'
      | 'required-assets';
    range: { min: number; max: number };
    withdrawalType?: 'fixed-amount' | 'fixed-rate';
    settings: {
      yield?: number;
      monthly?: number;
      years?: number;
      withdrawalAmount?: number;
      targetAmount?: number;
      requiredAssets?: number;
      withdrawalRate?: number;
    };
  }) => void;
}

export default function AnalysisDialog({ isOpen, onClose, onExecute }: AnalysisDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [analysisMode, setAnalysisMode] = useState<'save' | 'spend'>('save');
  const [analysisVariable, setAnalysisVariable] = useState<
    'total-assets' | 'yield' | 'monthly' | 'years' | 'withdrawal-amount' | 'required-assets'
  >('total-assets');
  const [analysisRange, setAnalysisRange] = useState({ min: 0, max: 10 });
  const [withdrawalType, setWithdrawalType] = useState<'fixed-amount' | 'fixed-rate'>(
    'fixed-amount'
  );

  // 設定値の状態管理
  const [settings, setSettings] = useState({
    yield: 5,
    monthly: 30000,
    years: 20,
    withdrawalAmount: 10,
    targetAmount: 10000000,
    requiredAssets: 5000000,
    withdrawalRate: 4,
  });

  // スクロール制御
  useEffect(() => {
    if (isOpen) {
      // ダイアログ表示時にbodyのスクロールを無効化
      document.body.style.overflow = 'hidden';
    } else {
      // ダイアログ非表示時にbodyのスクロールを有効化
      document.body.style.overflow = 'unset';
    }

    return () => {
      // コンポーネントのアンマウント時にスクロールを有効化
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ダイアログ外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // 分析モードが変更されたら、分析変数をリセット
  useEffect(() => {
    if (analysisMode === 'save') {
      setAnalysisVariable('total-assets');
    } else {
      setAnalysisVariable('withdrawal-amount');
    }
  }, [analysisMode]);

  // スライダーの値をフォーマットする関数
  const formatSliderValue = (value: number) => {
    return `${value}年`;
  };

  // 目標金額の表示制御
  const showTargetAmountInput =
    analysisMode === 'save' &&
    (analysisVariable === 'yield' ||
      analysisVariable === 'monthly' ||
      analysisVariable === 'years');

  // 取り崩しモードで「必要資金」入力欄の表示制御
  const showRequiredAssetsInput =
    analysisMode === 'spend' && analysisVariable !== 'required-assets';

  if (!isOpen) return null;

  // 設定項目の表示制御
  const showYieldInput = analysisMode === 'save' ? analysisVariable !== 'yield' : false;
  const showMonthlyInput = analysisMode === 'save' ? analysisVariable !== 'monthly' : false;
  const showYearsInput =
    analysisMode === 'save' ? analysisVariable !== 'years' : analysisVariable !== 'years';
  const showWithdrawalAmountInput =
    analysisMode === 'spend' &&
    analysisVariable !== 'withdrawal-amount' &&
    withdrawalType === 'fixed-amount';
  const showWithdrawalRateInput =
    analysisMode === 'spend' &&
    analysisVariable !== 'withdrawal-amount' &&
    withdrawalType === 'fixed-rate';
  const showWithdrawalTypeSelect =
    analysisMode === 'spend' && analysisVariable !== 'withdrawal-amount';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={dialogRef}
        className="bg-[var(--color-surface)] rounded-2xl p-6 w-full max-w-md mx-4 h-[600px] flex flex-col"
      >
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-xl font-semibold text-[var(--color-gray-900)]">分析設定</h2>
          <button
            onClick={onClose}
            className="text-[var(--color-gray-400)] hover:text-[var(--color-gray-700)]"
            aria-label="閉じる"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* スクロール可能なコンテンツエリア */}
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          {/* 分析モード選択 */}
          <div className="mb-6">
            <div className="flex items-center gap-1 mb-2">
              <label className="text-sm font-medium text-[var(--color-gray-700)]">分析モード</label>
              <Tooltip
                title="分析モード"
                content={`「貯める」…資産形成のシミュレーションを行います。
「使う」…資産の取り崩し（引き出し）シミュレーションを行います。

【使い分けのポイント】
・将来の資産目標や積立計画を立てたい場合は「貯める」
・リタイア後の生活費や資産寿命を知りたい場合は「使う」
`}
              >
                <span className="sr-only">分析モードの説明</span>
              </Tooltip>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  analysisMode === 'save'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface-alt)] text-[var(--color-gray-700)] hover:bg-[var(--color-primary)]/10'
                }`}
                onClick={() => setAnalysisMode('save')}
              >
                貯める
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  analysisMode === 'spend'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface-alt)] text-[var(--color-gray-700)] hover:bg-[var(--color-primary)]/10'
                }`}
                onClick={() => setAnalysisMode('spend')}
              >
                使う
              </button>
            </div>
          </div>

          {/* 分析変数選択 */}
          <div className="mb-6">
            <div className="flex items-center gap-1 mb-2">
              <label className="text-sm font-medium text-[var(--color-gray-700)]">分析対象</label>
              <Tooltip
                title="分析対象"
                content={`分析で計算する項目を選びます。

【主な分析対象】
・いくら貯まる？…積立や運用で将来どれだけ資産が増えるか
・いくら必要？…目標金額を達成するために必要な積立額や元本
・何年かかる？…目標金額に到達するまでの年数
・いくら使える？…資産を取り崩す場合、毎月いくら使えるか
・何年でなくなる？…資産を取り崩した場合、何年持つか
`}
              >
                <span className="sr-only">分析対象の説明</span>
              </Tooltip>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {analysisMode === 'save' ? (
                <>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      analysisVariable === 'total-assets'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-surface-alt)] text-[var(--color-gray-700)] hover:bg-[var(--color-primary)]/10'
                    }`}
                    onClick={() => setAnalysisVariable('total-assets')}
                  >
                    いくら貯まる？
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      analysisVariable === 'yield'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-surface-alt)] text-[var(--color-gray-700)] hover:bg-[var(--color-primary)]/10'
                    }`}
                    onClick={() => setAnalysisVariable('yield')}
                  >
                    必要利回り
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      analysisVariable === 'monthly'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-surface-alt)] text-[var(--color-gray-700)] hover:bg-[var(--color-primary)]/10'
                    }`}
                    onClick={() => setAnalysisVariable('monthly')}
                  >
                    いくら必要？
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      analysisVariable === 'years'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-surface-alt)] text-[var(--color-gray-700)] hover:bg-[var(--color-primary)]/10'
                    }`}
                    onClick={() => setAnalysisVariable('years')}
                  >
                    何年かかる？
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      analysisVariable === 'required-assets'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-surface-alt)] text-[var(--color-gray-700)] hover:bg-[var(--color-primary)]/10'
                    }`}
                    onClick={() => setAnalysisVariable('required-assets')}
                  >
                    いくら必要？
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      analysisVariable === 'withdrawal-amount'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-surface-alt)] text-[var(--color-gray-700)] hover:bg-[var(--color-primary)]/10'
                    }`}
                    onClick={() => setAnalysisVariable('withdrawal-amount')}
                  >
                    いくら使える？
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      analysisVariable === 'years'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-surface-alt)] text-[var(--color-gray-700)] hover:bg-[var(--color-primary)]/10'
                    }`}
                    onClick={() => setAnalysisVariable('years')}
                  >
                    何年でなくなる？
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 設定項目 */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              {showTargetAmountInput && (
                <div className="col-span-2">
                  <div className="flex items-center gap-1 mb-2">
                    <label className="text-sm font-medium text-[var(--color-gray-700)]">
                      目標金額
                    </label>
                    <Tooltip
                      title="目標金額"
                      content={`将来達成したい資産額を設定します。

【ポイント】
・住宅購入や老後資金など、具体的な目標を設定すると計画が立てやすくなります。
・目標金額に応じて必要な積立額や運用条件が自動計算されます。
`}
                    >
                      <span className="sr-only">目標金額の説明</span>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={settings.targetAmount || ''}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, targetAmount: Number(e.target.value) }))
                      }
                      className="w-full px-3 py-2 border-2 border-[var(--color-primary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                      placeholder="例：10000000"
                    />
                    <span className="text-sm font-medium text-[var(--color-primary)]">円</span>
                  </div>
                </div>
              )}

              {showRequiredAssetsInput && (
                <div className="col-span-2">
                  <div className="flex items-center gap-1 mb-2">
                    <label className="text-sm font-medium text-[var(--color-gray-700)]">
                      想定元本
                    </label>
                    <Tooltip
                      title="想定元本"
                      content={`取り崩しシミュレーションの開始時点での資産額です。

【ポイント】
・リタイア時や運用終了時の残高を想定して入力します。
・この金額をもとに、毎月いくら使えるか・何年持つか等を計算します。
`}
                    >
                      <span className="sr-only">想定元本の説明</span>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={settings.requiredAssets || ''}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, requiredAssets: Number(e.target.value) }))
                      }
                      className="w-full px-3 py-2 border-2 border-[var(--color-primary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                      placeholder="例：10000000"
                    />
                    <span className="text-sm font-medium text-[var(--color-primary)]">円</span>
                  </div>
                </div>
              )}

              {showYieldInput && (
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <label className="text-sm font-medium text-[var(--color-gray-700)]">
                      利回り
                    </label>
                    <Tooltip
                      title="平均利回り率"
                      content={`資産運用で1年あたりどれくらい増えるかの平均リターン（年率）です。

【見方のポイント】
・5%なら「毎年平均5%ずつ増える」前提で計算
・初期値は銘柄や市場データを参照して自動算出
・長期運用ほど小さな差が大きな差に

【目安】
・日本株・ETF: 3〜6%
・米国株・ETF: 5〜8%
・債券・預金: 0.1〜2%
`}
                    >
                      <span className="sr-only">利回りの説明</span>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={settings.yield}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, yield: Number(e.target.value) }))
                      }
                      className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-gray-700)]">%</span>
                  </div>
                </div>
              )}

              {showMonthlyInput && (
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <label className="text-sm font-medium text-[var(--color-gray-700)]">
                      積立額（毎月）
                    </label>
                    <Tooltip
                      title="積立額（毎月）"
                      content={`毎月積み立てる投資額です。

【ポイント】
・無理のない範囲で継続できる金額を設定しましょう。
・積立額が多いほど目標達成が早くなります。
・ボーナス月のみ増額する場合は別途加味してください。
`}
                    >
                      <span className="sr-only">積立額の説明</span>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={settings.monthly}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, monthly: Number(e.target.value) }))
                      }
                      className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-gray-700)]">円</span>
                  </div>
                </div>
              )}

              {showYearsInput && (
                <div className="col-span-2">
                  <div className="flex items-center gap-1 mb-2">
                    <label className="text-sm font-medium text-[var(--color-gray-700)]">
                      {analysisMode === 'save' ? '積立年数' : '取崩年数'}
                    </label>
                    <Tooltip
                      title={analysisMode === 'save' ? '積立年数' : '取崩年数'}
                      content={
                        analysisMode === 'save'
                          ? `積立投資を継続する年数です。

【ポイント】
・長く積み立てるほど複利効果が大きくなります。
・ライフイベント（住宅購入・教育費など）も考慮して設定しましょう。
`
                          : `資産を取り崩す期間（年数）です。

【ポイント】
・何年分の生活費を賄いたいか、資産寿命の目安に活用できます。
・途中で追加の収入や支出がある場合は別途調整してください。
`
                      }
                    >
                      <span className="sr-only">
                        {analysisMode === 'save' ? '積立年数の説明' : '取崩年数の説明'}
                      </span>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="range"
                        min="1"
                        max="40"
                        value={settings.years}
                        onChange={(e) =>
                          setSettings((prev) => ({ ...prev, years: Number(e.target.value) }))
                        }
                        className="w-full h-2 bg-[var(--color-gray-200)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-primary)] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-primary)] [&::-moz-range-thumb]:border-0"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-[var(--color-gray-400)]">1年</span>
                        <span className="text-xs text-[var(--color-gray-400)]">40年</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-16 text-right">
                      <span className="text-lg font-medium text-[var(--color-primary)]">
                        {settings.years}
                      </span>
                      <span className="text-sm text-[var(--color-gray-700)] ml-1">年</span>
                    </div>
                  </div>
                </div>
              )}

              {showWithdrawalAmountInput && withdrawalType === 'fixed-amount' && (
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <label className="text-sm font-medium text-[var(--color-gray-700)]">
                      取崩額（毎月）
                    </label>
                    <Tooltip
                      title="取崩額（毎月）"
                      content={`毎月固定で取り崩す金額です。

【ポイント】
・生活費や定期的な支出に合わせて設定します。
・資産が尽きるまで同じ金額を取り崩します。
・インフレや支出増加には注意が必要です。
`}
                    >
                      <span className="sr-only">取崩額の説明</span>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={settings.withdrawalAmount}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          withdrawalAmount: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
                      min="1"
                      step="1"
                    />
                    <span className="text-sm text-[var(--color-gray-700)]">万円</span>
                  </div>
                </div>
              )}

              {showWithdrawalRateInput && withdrawalType === 'fixed-rate' && (
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <label className="text-sm font-medium text-[var(--color-gray-700)]">
                      取崩率（毎年）
                    </label>
                    <Tooltip
                      title="取崩率（毎年）"
                      content={`毎年、資産残高に対して一定の割合で取り崩します。

【ポイント】
・資産寿命を延ばしたい場合や、残高に応じて柔軟に使いたい場合に有効
・「4%ルール」などの経験則も参考に
・市場環境や資産運用の成績によって変動します
`}
                    >
                      <span className="sr-only">取崩率の説明</span>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={settings.withdrawalRate}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          withdrawalRate: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)]"
                      min="0.1"
                      max="100"
                      step="0.1"
                    />
                    <span className="text-sm text-[var(--color-gray-700)]">%</span>
                  </div>
                </div>
              )}

              {showWithdrawalTypeSelect && (
                <div className="col-span-2">
                  <div className="flex items-center gap-1 mb-2">
                    <label className="text-sm font-medium text-[var(--color-gray-700)]">
                      取崩タイプ
                    </label>
                    <Tooltip
                      title="取り崩しタイプ"
                      content={`定額取崩し：毎年同じ金額を取り崩します。
定率取崩し：残高に対して一定の割合を取り崩します。

【見方のポイント】
・定額は「毎年決まった生活費を確保したい」場合に便利
・定率は「資産寿命を延ばしたい」「残高に応じて柔軟に使いたい」場合に有効

【4%ルールとは？】
米国の退職後資産運用で有名な「4%ルール」は、毎年残高の4%ずつ取り崩すことで30年以上資産が持続しやすいという経験則です。
例：1,000万円の資産なら初年度は40万円を取り崩し、翌年は残高の4%を計算して取り崩す
・市場環境や個人の状況により適切な率は異なりますが、目安として活用できます。

【例】
・定額：毎年120万円ずつ取り崩す
・定率：毎年残高の4%ずつ取り崩す
`}
                    >
                      <span className="sr-only">取崩タイプの説明</span>
                    </Tooltip>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        withdrawalType === 'fixed-amount'
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-surface-alt)] text-[var(--color-gray-700)] hover:bg-[var(--color-primary)]/10'
                      }`}
                      onClick={() => setWithdrawalType('fixed-amount')}
                    >
                      定額取崩
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        withdrawalType === 'fixed-rate'
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-surface-alt)] text-[var(--color-gray-700)] hover:bg-[var(--color-primary)]/10'
                      }`}
                      onClick={() => setWithdrawalType('fixed-rate')}
                    >
                      定率取崩
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 実行ボタン */}
        <div className="flex-shrink-0 pt-4">
          <button
            className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              onExecute({
                mode: analysisMode,
                variable: analysisVariable,
                range: analysisRange,
                withdrawalType: analysisMode === 'spend' ? withdrawalType : undefined,
                settings: {
                  targetAmount: showTargetAmountInput ? settings.targetAmount : undefined,
                  requiredAssets: showRequiredAssetsInput ? settings.requiredAssets : undefined,
                  yield: showYieldInput ? settings.yield : undefined,
                  monthly: showMonthlyInput ? settings.monthly : undefined,
                  years: showYearsInput ? settings.years : undefined,
                  withdrawalAmount: showWithdrawalAmountInput
                    ? settings.withdrawalAmount
                    : undefined,
                  withdrawalRate: showWithdrawalRateInput ? settings.withdrawalRate : undefined,
                },
              });
              onClose();
            }}
            disabled={
              (showTargetAmountInput && !settings.targetAmount) ||
              (showRequiredAssetsInput && !settings.requiredAssets) ||
              (showWithdrawalAmountInput && !settings.withdrawalAmount) ||
              (showWithdrawalRateInput && !settings.withdrawalRate)
            }
          >
            分析を実行
          </button>
        </div>
      </div>
    </div>
  );
}
