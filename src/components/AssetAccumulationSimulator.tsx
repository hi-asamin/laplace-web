'use client';

import { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useAssetAccumulationSimulation } from '@/hooks/useSimulation';
import { SAVE_QUESTIONS, SaveQuestionType } from '@/types/simulationTypes';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/simulationCalculations';
import SimulationChart from '@/components/SimulationChart';
import AnimatedNumber from '@/components/AnimatedNumber';

interface AssetAccumulationSimulatorProps {
  className?: string;
  defaultQuestionType?: SaveQuestionType;
}

export default function AssetAccumulationSimulator({
  className = '',
  defaultQuestionType = 'total-assets',
}: AssetAccumulationSimulatorProps) {
  const { settings, result, isCalculating, updateSetting, setQuestionType } =
    useAssetAccumulationSimulation({
      questionType: defaultQuestionType,
    });

  const [isQuestionDropdownOpen, setIsQuestionDropdownOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  // 現在選択中の問いの情報を取得
  const getCurrentQuestion = () => {
    return SAVE_QUESTIONS.find((q) => q.value === settings.questionType);
  };

  // 入力項目かどうかの判定
  const isInputField = (field: string) => {
    switch (settings.questionType) {
      case 'total-assets':
        return ['averageYield', 'years', 'initialPrincipal', 'monthlyAmount'].includes(field);
      case 'required-yield':
        return ['targetAmount', 'years', 'initialPrincipal', 'monthlyAmount'].includes(field);
      case 'required-monthly':
        return ['targetAmount', 'averageYield', 'years', 'initialPrincipal'].includes(field);
      case 'required-years':
        return ['targetAmount', 'averageYield', 'initialPrincipal', 'monthlyAmount'].includes(
          field
        );
      default:
        return false;
    }
  };

  // 出力項目かどうかの判定
  const isOutputField = (field: string) => {
    switch (settings.questionType) {
      case 'total-assets':
        return field === 'totalAssets';
      case 'required-yield':
        return field === 'averageYield';
      case 'required-monthly':
        return field === 'monthlyAmount';
      case 'required-years':
        return field === 'years';
      default:
        return false;
    }
  };

  // サマリーラベルの生成
  const getSummaryLabel = () => {
    switch (settings.questionType) {
      case 'total-assets':
        return `${settings.years}年後のあなたの資産総額`;
      case 'required-yield':
        return '目標達成に必要な利回り';
      case 'required-monthly':
        return '目標達成に必要な積立額';
      case 'required-years':
        return '目標達成に必要な期間';
      default:
        return `${settings.years}年後の資産総額`;
    }
  };

  // 入力フィールドコンポーネント
  const InputField = ({
    label,
    value,
    onChange,
    min,
    max,
    step,
    unit = '',
    formatValue,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
    unit?: string;
    formatValue?: (value: number) => string;
  }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-[var(--color-gray-700)]">{label}</label>
        <span className="text-sm font-bold text-[var(--color-lp-navy)]">
          {formatValue ? formatValue(value) : `${formatNumber(value)}${unit}`}
        </span>
      </div>
      <div className="space-y-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-[var(--color-lp-mint)]/20 rounded-lg appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-lp-mint)]
                     [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                     [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-[var(--color-lp-mint)]/30 rounded-lg
                     focus:border-[var(--color-lp-mint)] focus:ring-2 focus:ring-[var(--color-lp-mint)]/20
                     focus:outline-none transition-all text-sm"
        />
      </div>
    </div>
  );

  // 出力フィールドコンポーネント
  const OutputField = ({
    label,
    value,
    unit = '',
    formatValue,
  }: {
    label: string;
    value: number | undefined;
    unit?: string;
    formatValue?: (value: number) => string;
  }) => (
    <div className="bg-[var(--color-primary)]/10 rounded-lg p-4 border-2 border-[var(--color-primary)]/20">
      <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-2">{label}</label>
      <div className="text-2xl font-bold text-[var(--color-primary)]">
        {value !== undefined
          ? formatValue
            ? formatValue(value)
            : `${formatNumber(value)}${unit}`
          : '計算中...'}
      </div>
    </div>
  );

  // 設定パネルの内容
  const SettingsPanel = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      className={`bg-[var(--color-surface)] rounded-2xl p-6 shadow-lg ${isMobile ? 'border-t border-[var(--color-gray-200)]' : ''}`}
    >
      {/* 問い選択ドロップダウン */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-3">
          知りたいことは？
        </label>
        <div className="relative">
          <button
            onClick={() => setIsQuestionDropdownOpen(!isQuestionDropdownOpen)}
            className="w-full flex items-center justify-between p-3 border border-[var(--color-gray-300)] 
                       rounded-lg text-left hover:border-[var(--color-lp-mint)] transition-colors"
          >
            <div>
              <div className="font-medium text-[var(--color-gray-900)]">
                {getCurrentQuestion()?.label}
              </div>
              <div className="text-xs text-[var(--color-gray-400)] mt-1">
                {getCurrentQuestion()?.description}
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-[var(--color-gray-400)] transition-transform ${
                isQuestionDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isQuestionDropdownOpen && (
            <div
              className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-surface)] border 
                           border-[var(--color-gray-300)] rounded-lg shadow-lg z-20"
            >
              {SAVE_QUESTIONS.map((question) => (
                <button
                  key={question.value}
                  onClick={() => {
                    setQuestionType(question.value);
                    setIsQuestionDropdownOpen(false);
                  }}
                  className={`w-full text-left p-3 hover:bg-[var(--color-surface-alt)] transition-colors ${
                    question.value === settings.questionType
                      ? 'bg-[var(--color-primary)] bg-opacity-10'
                      : ''
                  }`}
                >
                  <div className="font-medium text-[var(--color-gray-900)]">{question.label}</div>
                  <div className="text-xs text-[var(--color-gray-400)] mt-1">
                    {question.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 入力項目 */}
      <div className="space-y-6">
        {isInputField('averageYield') && (
          <InputField
            label="平均利回り"
            value={settings.averageYield}
            onChange={(value) => updateSetting('averageYield', value)}
            min={0}
            max={20}
            step={0.1}
            unit="%"
          />
        )}

        {isInputField('years') && (
          <InputField
            label="投資期間"
            value={settings.years}
            onChange={(value) => updateSetting('years', value)}
            min={1}
            max={50}
            step={1}
            unit="年"
          />
        )}

        {isInputField('initialPrincipal') && (
          <InputField
            label="初期投資元本"
            value={settings.initialPrincipal || 0}
            onChange={(value) => updateSetting('initialPrincipal', value)}
            min={0}
            max={50000000}
            step={10000}
            formatValue={(value) => formatCurrency(value)}
          />
        )}

        {isInputField('monthlyAmount') && (
          <InputField
            label="毎月積立額"
            value={settings.monthlyAmount || 0}
            onChange={(value) => updateSetting('monthlyAmount', value)}
            min={0}
            max={500000}
            step={1000}
            formatValue={(value) => formatCurrency(value)}
          />
        )}

        {isInputField('targetAmount') && (
          <InputField
            label="目標金額"
            value={settings.targetAmount || 0}
            onChange={(value) => updateSetting('targetAmount', value)}
            min={1000000}
            max={100000000}
            step={100000}
            formatValue={(value) => formatCurrency(value)}
          />
        )}
      </div>

      {/* 出力項目 */}
      <div className="space-y-4">
        {/* 出力フィールドはサマリー部分で表示されるため、ここでは非表示 */}
      </div>
    </div>
  );

  return (
    <section className={`py-8 bg-[var(--color-lp-off-white)] ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* デスクトップレイアウト */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          {/* 設定パネル */}
          <SettingsPanel />

          {/* チャート&サマリー */}
          <div className="space-y-6">
            {/* サマリー */}
            <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-lg">
              <div className="text-center">
                {/* ラベル */}
                <div className="text-lg font-medium text-[var(--color-gray-700)] mb-2">
                  {getSummaryLabel()}
                </div>

                {/* メイン数値表示 */}
                <div className="text-5xl font-bold text-[var(--color-primary)] mb-4">
                  {settings.questionType === 'total-assets' ? (
                    <AnimatedNumber
                      value={result.calculatedValue || 0}
                      duration={1000}
                      prefix=""
                      suffix="円"
                      className="text-5xl font-bold text-[var(--color-primary)]"
                    />
                  ) : settings.questionType === 'required-yield' ? (
                    <AnimatedNumber
                      value={result.calculatedValue || 0}
                      duration={1000}
                      prefix=""
                      suffix="%"
                      className="text-5xl font-bold text-[var(--color-primary)]"
                    />
                  ) : settings.questionType === 'required-monthly' ? (
                    <AnimatedNumber
                      value={result.calculatedValue || 0}
                      duration={1000}
                      prefix=""
                      suffix="円"
                      className="text-5xl font-bold text-[var(--color-primary)]"
                    />
                  ) : settings.questionType === 'required-years' ? (
                    <AnimatedNumber
                      value={Math.round((result.calculatedValue || 0) * 10) / 10}
                      duration={1000}
                      prefix=""
                      suffix="年"
                      className="text-5xl font-bold text-[var(--color-primary)]"
                    />
                  ) : (
                    <AnimatedNumber
                      value={result.calculatedValue || 0}
                      duration={1000}
                      prefix=""
                      suffix="円"
                      className="text-5xl font-bold text-[var(--color-primary)]"
                    />
                  )}
                </div>

                {/* 詳細情報（total-assetsの場合のみ） */}
                {settings.questionType === 'total-assets' && result.data.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-lg font-medium text-[var(--color-gray-700)]">
                        投資元本
                      </div>
                      <div className="text-2xl font-bold text-[var(--color-gray-900)]">
                        {formatCurrency(result.data[result.data.length - 1]?.principal || 0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium text-[var(--color-gray-700)]">
                        複利利益
                      </div>
                      <div className="text-2xl font-bold text-[var(--color-success)]">
                        {formatCurrency(result.data[result.data.length - 1]?.dividendProfit || 0)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* チャート */}
            <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-lg">
              {result.data.length > 0 ? (
                <SimulationChart data={result.data} purpose="save" width={480} height={360} />
              ) : (
                <div className="flex items-center justify-center h-80 text-[var(--color-gray-400)]">
                  {isCalculating ? '計算中...' : 'データがありません'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* モバイルレイアウト */}
        <div className="lg:hidden">
          {/* チャート&サマリー */}
          <div className="space-y-6 mb-6">
            {/* サマリー */}
            <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-lg">
              <div className="text-center">
                {/* ラベル */}
                <div className="text-lg font-medium text-[var(--color-gray-700)] mb-2">
                  {getSummaryLabel()}
                </div>

                {/* メイン数値表示 */}
                <div className="text-4xl font-bold text-[var(--color-primary)] mb-4">
                  {settings.questionType === 'total-assets' ? (
                    <AnimatedNumber
                      value={result.calculatedValue || 0}
                      duration={1000}
                      prefix=""
                      suffix="円"
                      className="text-4xl font-bold text-[var(--color-primary)]"
                    />
                  ) : settings.questionType === 'required-yield' ? (
                    <AnimatedNumber
                      value={result.calculatedValue || 0}
                      duration={1000}
                      prefix=""
                      suffix="%"
                      className="text-4xl font-bold text-[var(--color-primary)]"
                    />
                  ) : settings.questionType === 'required-monthly' ? (
                    <AnimatedNumber
                      value={result.calculatedValue || 0}
                      duration={1000}
                      prefix=""
                      suffix="円"
                      className="text-4xl font-bold text-[var(--color-primary)]"
                    />
                  ) : settings.questionType === 'required-years' ? (
                    <AnimatedNumber
                      value={Math.round((result.calculatedValue || 0) * 10) / 10}
                      duration={1000}
                      prefix=""
                      suffix="年"
                      className="text-4xl font-bold text-[var(--color-primary)]"
                    />
                  ) : (
                    <AnimatedNumber
                      value={result.calculatedValue || 0}
                      duration={1000}
                      prefix=""
                      suffix="円"
                      className="text-4xl font-bold text-[var(--color-primary)]"
                    />
                  )}
                </div>

                {/* 詳細情報（total-assetsの場合のみ） */}
                {settings.questionType === 'total-assets' && result.data.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-[var(--color-gray-700)]">
                        投資元本
                      </div>
                      <div className="text-lg font-bold text-[var(--color-gray-900)]">
                        {formatCurrency(result.data[result.data.length - 1]?.principal || 0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-[var(--color-gray-700)]">
                        複利利益
                      </div>
                      <div className="text-lg font-bold text-[var(--color-success)]">
                        {formatCurrency(result.data[result.data.length - 1]?.dividendProfit || 0)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* チャート */}
            <div className="bg-[var(--color-surface)] rounded-2xl p-4 shadow-lg">
              {result.data.length > 0 ? (
                <SimulationChart data={result.data} purpose="save" width={320} height={240} />
              ) : (
                <div className="flex items-center justify-center h-48 text-[var(--color-gray-400)]">
                  {isCalculating ? '計算中...' : 'データがありません'}
                </div>
              )}
            </div>
          </div>

          {/* フローティングボタン */}
          <button
            onClick={() => setIsSettingsPanelOpen(true)}
            className="fixed bottom-6 right-6 bg-[var(--color-lp-mint)] text-white px-6 py-3 
                       rounded-full hover:bg-[var(--color-lp-mint)]/90 transition-all hover:scale-105
                       shadow-xl flex items-center gap-2 z-40"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="font-medium">条件を変更する</span>
          </button>

          {/* ボトムシート */}
          {isSettingsPanelOpen && (
            <div className="fixed inset-0 z-50">
              {/* オーバーレイ */}
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setIsSettingsPanelOpen(false)}
              />

              {/* ボトムシート */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-[var(--color-surface)] 
                             rounded-t-2xl max-h-[80vh] overflow-y-auto
                             transform transition-transform duration-300
                             animate-in slide-in-from-bottom"
              >
                <div className="p-4">
                  {/* ハンドル */}
                  <div className="w-12 h-1 bg-[var(--color-gray-300)] rounded-full mx-auto mb-4" />

                  {/* 閉じるボタン */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[var(--color-gray-900)]">設定を変更</h3>
                    <button
                      onClick={() => setIsSettingsPanelOpen(false)}
                      className="text-[var(--color-gray-400)] hover:text-[var(--color-gray-700)] p-2"
                    >
                      ✕
                    </button>
                  </div>

                  <SettingsPanel isMobile />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* エラー表示 */}
        {!result.isSuccess && result.errorMessage && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{result.errorMessage}</p>
          </div>
        )}
      </div>
    </section>
  );
}
