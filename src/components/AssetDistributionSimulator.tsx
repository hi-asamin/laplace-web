'use client';

import { useState, useCallback, useRef } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useAssetDistributionSimulation } from '@/hooks/useSimulation';
import {
  USE_QUESTIONS,
  UseQuestionType,
  SimulationSettings,
  SimulationResult,
} from '@/types/simulationTypes';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/simulationCalculations';
import SimulationChart from '@/components/SimulationChart';
import AnimatedNumber from '@/components/AnimatedNumber';

interface AssetDistributionSimulatorProps {
  className?: string;
  defaultQuestionType?: UseQuestionType;
  inheritedAssets?: number; // 資産形成シミュレーターからの引き継ぎ
  // 外部から設定状態を受け取る場合
  externalSettings?: SimulationSettings;
  externalResult?: SimulationResult;
  externalIsCalculating?: boolean;
  externalUpdateSetting?: (key: keyof SimulationSettings, value: any) => void;
  externalSetQuestionType?: (questionType: UseQuestionType) => void;
}

export default function AssetDistributionSimulator({
  className = '',
  defaultQuestionType = 'asset-lifespan',
  inheritedAssets,
  externalSettings,
  externalResult,
  externalIsCalculating,
  externalUpdateSetting,
  externalSetQuestionType,
}: AssetDistributionSimulatorProps) {
  const internalSimulation = useAssetDistributionSimulation({
    questionType: defaultQuestionType,
    initialAssets: inheritedAssets || 10000000,
  });

  // 外部設定がある場合はそれを使用、なければ内部設定を使用
  const settings = externalSettings || internalSimulation.settings;
  const result = externalResult || internalSimulation.result;
  const isCalculating = externalIsCalculating ?? internalSimulation.isCalculating;
  const updateSetting = externalUpdateSetting || internalSimulation.updateSetting;
  const setQuestionType = externalSetQuestionType || internalSimulation.setQuestionType;

  const [isQuestionDropdownOpen, setIsQuestionDropdownOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  // 現在選択中の問いの情報を取得
  const getCurrentQuestion = () => {
    return USE_QUESTIONS.find((q) => q.value === settings.questionType);
  };

  // 入力項目かどうかの判定
  const isInputField = (field: string) => {
    switch (settings.questionType) {
      case 'asset-lifespan':
        // 何年でなくなる？の場合
        if (field === 'withdrawalAmount') {
          // 定額取り崩しの場合のみ月間取り崩し額を表示
          return settings.withdrawalType === 'fixed';
        }
        if (field === 'annualWithdrawalRate') {
          // 定率取り崩しの場合のみ年間取り崩し率を表示
          return settings.withdrawalType === 'percentage';
        }
        return ['initialAssets', 'averageYield', 'withdrawalType'].includes(field);
      case 'required-assets':
        // いくら必要？の場合は定額取り崩しのみ（取り崩し方法選択なし）
        return ['averageYield', 'years', 'withdrawalAmount'].includes(field);
      case 'withdrawal-amount':
        // 毎月いくら使える？の場合は定額取り崩しのみ（取り崩し方法選択なし）
        return ['initialAssets', 'averageYield', 'years'].includes(field);
      default:
        return false;
    }
  };

  // 出力項目かどうかの判定
  const isOutputField = (field: string) => {
    switch (settings.questionType) {
      case 'asset-lifespan':
        return field === 'years';
      case 'required-assets':
        return field === 'initialAssets';
      case 'withdrawal-amount':
        return field === 'withdrawalAmount';
      default:
        return false;
    }
  };

  // 結果表示のフォーマット
  const getResultDisplay = (): {
    main: string;
    unit: string;
    description?: string;
    additionalInfo?: string;
  } => {
    const value = result.calculatedValue;
    if (value === undefined) return { main: '計算中...', unit: '' };

    switch (settings.questionType) {
      case 'asset-lifespan':
        if (value === Infinity) {
          // 運用利回りが取り崩し額を上回る場合
          const annualYield = (settings.averageYield || 4) / 100;
          const annualWithdrawal =
            settings.withdrawalType === 'fixed'
              ? (settings.withdrawalAmount || 10) * 10000 * 12
              : (settings.initialAssets || 0) * ((settings.annualWithdrawalRate || 4) / 100);
          const annualYieldAmount = (settings.initialAssets || 0) * annualYield;
          const surplus = annualYieldAmount - annualWithdrawal;

          return {
            main: '永続的',
            unit: '資産が持続',
            description: `運用利回り（年${formatCurrency(annualYieldAmount)}）が取り崩し額（年${formatCurrency(annualWithdrawal)}）を上回るため、資産は減りません`,
            additionalInfo: `年間余剰: ${formatCurrency(surplus)}`,
          };
        } else {
          const totalYears = Math.floor(value);
          const months = Math.round((value - totalYears) * 12);
          const withdrawalDescription =
            settings.withdrawalType === 'fixed'
              ? `毎月${formatNumber(settings.withdrawalAmount || 0)}万円`
              : `年率${settings.annualWithdrawalRate || 4}%`;
          return {
            main: `${totalYears}年${months > 0 ? `${months}ヶ月` : ''}`,
            unit: '資産が持続',
            description: `${withdrawalDescription}の取り崩しが可能です`,
          };
        }
      case 'required-assets':
        return {
          main: formatCurrency(value),
          unit: '',
          description: `毎月${formatNumber(settings.withdrawalAmount || 0)}万円を${settings.years}年間取り崩すために必要`,
        };
      case 'withdrawal-amount':
        return {
          main: `${formatNumber(value)}万円`,
          unit: '毎月',
          description: `${formatCurrency(settings.initialAssets || 0)}の資産で${settings.years}年間安全に取り崩し可能`,
        };
      default:
        return { main: '', unit: '' };
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
  }) => {
    const [localValue, setLocalValue] = useState<number>(value);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    // デバウンス機能付きのonChange
    const debouncedOnChange = useCallback(
      (newValue: number) => {
        setLocalValue(newValue);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          onChange(newValue);
        }, 100); // 100msのデバウンス
      },
      [onChange]
    );

    // 即座に更新が必要な場合（number inputのonBlur）
    const immediateOnChange = useCallback(
      (newValue: number) => {
        setLocalValue(newValue);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        onChange(newValue);
      },
      [onChange]
    );

    // 外部からの値変更に追随
    if (value !== localValue && !timeoutRef.current) {
      setLocalValue(value);
    }

    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-[var(--color-gray-700)]">{label}</label>
          <span className="text-sm font-bold text-[var(--color-lp-navy)]">
            {formatValue ? formatValue(localValue) : `${formatNumber(localValue)}${unit}`}
          </span>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localValue}
            onInput={(e) => debouncedOnChange(Number(e.currentTarget.value))}
            className="w-full h-2 bg-[var(--color-lp-mint)]/20 rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-lp-mint)]
                       [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                       [&::-webkit-slider-thumb]:transition-none"
          />
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={localValue}
            onChange={(e) => setLocalValue(Number(e.target.value))}
            onBlur={(e) => immediateOnChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-[var(--color-lp-mint)]/30 rounded-lg
                       focus:border-[var(--color-lp-mint)] focus:ring-2 focus:ring-[var(--color-lp-mint)]/20
                       focus:outline-none transition-all text-sm"
          />
        </div>
      </div>
    );
  };

  // 選択フィールドコンポーネント
  const SelectField = ({
    label,
    value,
    onChange,
    options,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
  }) => (
    <div className="space-y-3">
      <label className="text-sm font-medium text-[var(--color-gray-700)]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-[var(--color-lp-mint)]/30 rounded-lg
                   focus:border-[var(--color-lp-mint)] focus:ring-2 focus:ring-[var(--color-lp-mint)]/20
                   focus:outline-none transition-all text-sm bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
              {USE_QUESTIONS.map((question) => (
                <button
                  key={question.value}
                  onClick={() => {
                    setQuestionType(question.value as UseQuestionType);
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

      {/* 引き継ぎ情報表示 */}
      {inheritedAssets && (
        <div className="mb-6 p-3 bg-[var(--color-lp-mint)]/10 rounded-lg border border-[var(--color-lp-mint)]/20">
          <div className="text-xs text-[var(--color-lp-navy)] font-medium mb-1">
            資産形成シミュレーターからの引き継ぎ
          </div>
          <div className="text-sm font-bold text-[var(--color-lp-navy)]">
            想定元本: {formatCurrency(inheritedAssets)}
          </div>
        </div>
      )}

      {/* 入力項目 */}
      <div className="space-y-6">
        {isInputField('initialAssets') && (
          <InputField
            label="保有資産額"
            value={settings.initialAssets || 0}
            onChange={(value) => updateSetting('initialAssets', value)}
            min={1000000}
            max={100000000}
            step={100000}
            formatValue={(value) => formatCurrency(value)}
          />
        )}

        {isInputField('averageYield') && (
          <InputField
            label="運用利回り"
            value={settings.averageYield}
            onChange={(value) => updateSetting('averageYield', value)}
            min={0}
            max={15}
            step={0.1}
            unit="%"
            formatValue={(value) => `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}%`}
          />
        )}

        {isInputField('years') && (
          <InputField
            label="取り崩し期間"
            value={settings.years}
            onChange={(value) => updateSetting('years', value)}
            min={1}
            max={50}
            step={1}
            unit="年"
          />
        )}

        {isInputField('withdrawalAmount') && (
          <InputField
            label="月間取り崩し額"
            value={settings.withdrawalAmount || 0}
            onChange={(value) => updateSetting('withdrawalAmount', value)}
            min={1}
            max={100}
            step={1}
            unit="万円"
          />
        )}

        {isInputField('annualWithdrawalRate') && (
          <InputField
            label="年間取り崩し率"
            value={settings.annualWithdrawalRate || 4}
            onChange={(value) => updateSetting('annualWithdrawalRate', value)}
            min={1}
            max={20}
            step={0.1}
            unit="%"
            formatValue={(value) => `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}%`}
          />
        )}

        {isInputField('withdrawalType') && (
          <SelectField
            label="取り崩し方法"
            value={settings.withdrawalType || 'fixed'}
            onChange={(value) => updateSetting('withdrawalType', value)}
            options={[
              { value: 'fixed', label: '定額取り崩し（毎月一定額）' },
              { value: 'percentage', label: '定率取り崩し（資産の一定割合）' },
            ]}
          />
        )}
      </div>

      {/* 出力項目 */}
      <div className="mt-6 space-y-4">
        {isOutputField('years') && (
          <OutputField
            label="資産寿命"
            value={result.calculatedValue}
            formatValue={(value) => `${value.toFixed(1)}年`}
          />
        )}

        {isOutputField('initialAssets') && (
          <OutputField
            label="必要資産額"
            value={result.calculatedValue}
            formatValue={(value) => formatCurrency(value)}
          />
        )}

        {isOutputField('withdrawalAmount') && (
          <OutputField
            label="取り崩し可能額"
            value={result.calculatedValue}
            formatValue={(value) => `${formatNumber(value)}万円`}
          />
        )}
      </div>
    </div>
  );

  const resultDisplay = getResultDisplay();

  return (
    <section
      className={`py-8 bg-[var(--color-surface)] dark:bg-[var(--color-surface-1)] ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* デスクトップレイアウト */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          {/* 設定パネル */}
          <SettingsPanel />

          {/* チャート&サマリー */}
          <div className="space-y-6">
            {/* サマリー */}
            <div className="bg-[var(--color-surface)] dark:bg-[var(--color-surface-2)] rounded-2xl p-6 shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)]">
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">
                  {resultDisplay.unit && (
                    <span className="text-xl font-medium mr-2">{resultDisplay.unit}</span>
                  )}
                  <span className="text-4xl font-bold text-[var(--color-primary)]">
                    {resultDisplay.main}
                  </span>
                </div>

                {resultDisplay.description && (
                  <p className="text-sm text-[var(--color-gray-600)] mt-4">
                    {resultDisplay.description}
                  </p>
                )}

                {result.data.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-[var(--color-gray-200)]">
                    <div className="text-center">
                      <div className="text-lg font-medium text-[var(--color-gray-700)]">
                        開始資産
                      </div>
                      <div className="text-2xl font-bold text-[var(--color-gray-900)]">
                        {formatCurrency(result.data[0]?.totalAssets || 0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium text-[var(--color-gray-700)]">
                        最終残高
                      </div>
                      <div className="text-2xl font-bold text-[var(--color-primary)]">
                        {formatCurrency(result.data[result.data.length - 1]?.totalAssets || 0)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* チャート */}
            <div className="bg-[var(--color-surface)] dark:bg-[var(--color-surface-2)] rounded-2xl p-6 shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)]">
              {result.data.length > 0 ? (
                <SimulationChart data={result.data} purpose="use" width={480} height={360} />
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
            <div className="bg-[var(--color-surface)] dark:bg-[var(--color-surface-2)] rounded-2xl p-6 shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)]">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--color-primary)] mb-2">
                  {resultDisplay.unit && (
                    <span className="text-lg font-medium mr-2">{resultDisplay.unit}</span>
                  )}
                  <span className="text-3xl font-bold text-[var(--color-primary)]">
                    {resultDisplay.main}
                  </span>
                </div>

                {resultDisplay.description && (
                  <p className="text-xs text-[var(--color-gray-600)] mt-3">
                    {resultDisplay.description}
                  </p>
                )}

                {resultDisplay.additionalInfo && (
                  <p className="text-xs text-[var(--color-lp-mint)] font-medium mt-2">
                    {resultDisplay.additionalInfo}
                  </p>
                )}

                {result.data.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--color-gray-200)]">
                    <div className="text-center">
                      <div className="text-sm font-medium text-[var(--color-gray-700)]">
                        開始資産
                      </div>
                      <div className="text-lg font-bold text-[var(--color-gray-900)]">
                        {formatCurrency(result.data[0]?.totalAssets || 0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-[var(--color-gray-700)]">
                        最終残高
                      </div>
                      <div className="text-lg font-bold text-[var(--color-primary)]">
                        {formatCurrency(result.data[result.data.length - 1]?.totalAssets || 0)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* チャート */}
            <div className="bg-[var(--color-surface)] dark:bg-[var(--color-surface-2)] rounded-2xl p-4 shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)]">
              {result.data.length > 0 ? (
                <SimulationChart data={result.data} purpose="use" width={320} height={240} />
              ) : (
                <div className="flex items-center justify-center h-48 text-[var(--color-gray-400)]">
                  {isCalculating ? '計算中...' : 'データがありません'}
                </div>
              )}
            </div>
          </div>
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

export function AssetDistributionSettingsPanel({
  settings,
  updateSetting,
  setQuestionType,
  isQuestionDropdownOpen,
  setIsQuestionDropdownOpen,
  isMobile = false,
  inheritedAssets,
  result,
}: {
  settings: SimulationSettings;
  updateSetting: (key: keyof SimulationSettings, value: any) => void;
  setQuestionType: (questionType: UseQuestionType) => void;
  isQuestionDropdownOpen: boolean;
  setIsQuestionDropdownOpen: (open: boolean) => void;
  isMobile?: boolean;
  inheritedAssets?: number;
  result: any;
}) {
  // InputField, SelectField, OutputField, isInputField, isOutputField, getCurrentQuestionを再定義
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
  }) => {
    const [localValue, setLocalValue] = useState<number>(value);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    // デバウンス機能付きのonChange
    const debouncedOnChange = useCallback(
      (newValue: number) => {
        setLocalValue(newValue);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          onChange(newValue);
        }, 100); // 100msのデバウンス
      },
      [onChange]
    );

    // 即座に更新が必要な場合（number inputのonBlur）
    const immediateOnChange = useCallback(
      (newValue: number) => {
        setLocalValue(newValue);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        onChange(newValue);
      },
      [onChange]
    );

    // 外部からの値変更に追随
    if (value !== localValue && !timeoutRef.current) {
      setLocalValue(value);
    }

    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-[var(--color-gray-700)]">{label}</label>
          <span className="text-sm font-bold text-[var(--color-lp-navy)]">
            {formatValue ? formatValue(localValue) : `${formatNumber(localValue)}${unit}`}
          </span>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localValue}
            onInput={(e) => debouncedOnChange(Number(e.currentTarget.value))}
            className="w-full h-2 bg-[var(--color-lp-mint)]/20 rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-lp-mint)]
                       [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                       [&::-webkit-slider-thumb]:transition-none"
          />
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={localValue}
            onChange={(e) => setLocalValue(Number(e.target.value))}
            onBlur={(e) => immediateOnChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-[var(--color-lp-mint)]/30 rounded-lg
                       focus:border-[var(--color-lp-mint)] focus:ring-2 focus:ring-[var(--color-lp-mint)]/20
                       focus:outline-none transition-all text-sm"
          />
        </div>
      </div>
    );
  };

  const SelectField = ({
    label,
    value,
    onChange,
    options,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
  }) => (
    <div className="space-y-3">
      <label className="text-sm font-medium text-[var(--color-gray-700)]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-[var(--color-lp-mint)]/30 rounded-lg
                   focus:border-[var(--color-lp-mint)] focus:ring-2 focus:ring-[var(--color-lp-mint)]/20
                   focus:outline-none transition-all text-sm bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

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

  const isInputField = (field: string) => {
    switch (settings.questionType) {
      case 'asset-lifespan':
        // 何年でなくなる？の場合
        if (field === 'withdrawalAmount') {
          // 定額取り崩しの場合のみ月間取り崩し額を表示
          return settings.withdrawalType === 'fixed';
        }
        if (field === 'annualWithdrawalRate') {
          // 定率取り崩しの場合のみ年間取り崩し率を表示
          return settings.withdrawalType === 'percentage';
        }
        return ['initialAssets', 'averageYield', 'withdrawalType'].includes(field);
      case 'required-assets':
        // いくら必要？の場合は定額取り崩しのみ（取り崩し方法選択なし）
        return ['averageYield', 'years', 'withdrawalAmount'].includes(field);
      case 'withdrawal-amount':
        // 毎月いくら使える？の場合は定額取り崩しのみ（取り崩し方法選択なし）
        return ['initialAssets', 'averageYield', 'years'].includes(field);
      default:
        return false;
    }
  };

  const isOutputField = (field: string) => {
    switch (settings.questionType) {
      case 'asset-lifespan':
        return field === 'years';
      case 'required-assets':
        return field === 'initialAssets';
      case 'withdrawal-amount':
        return field === 'withdrawalAmount';
      default:
        return false;
    }
  };

  const getCurrentQuestion = () => {
    return USE_QUESTIONS.find((q) => q.value === settings.questionType);
  };

  return (
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
              {USE_QUESTIONS.map((question) => (
                <button
                  key={question.value}
                  onClick={() => {
                    setQuestionType(question.value as UseQuestionType);
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

      {/* 引き継ぎ情報表示 */}
      {inheritedAssets && (
        <div className="mb-6 p-3 bg-[var(--color-lp-mint)]/10 rounded-lg border border-[var(--color-lp-mint)]/20">
          <div className="text-xs text-[var(--color-lp-navy)] font-medium mb-1">
            資産形成シミュレーターからの引き継ぎ
          </div>
          <div className="text-sm font-bold text-[var(--color-lp-navy)]">
            想定元本: {formatCurrency(inheritedAssets)}
          </div>
        </div>
      )}

      {/* 入力項目 */}
      <div className="space-y-6">
        {isInputField('initialAssets') && (
          <InputField
            label="保有資産額"
            value={settings.initialAssets || 0}
            onChange={(value) => updateSetting('initialAssets', value)}
            min={1000000}
            max={100000000}
            step={100000}
            formatValue={(value) => formatCurrency(value)}
          />
        )}

        {isInputField('averageYield') && (
          <InputField
            label="運用利回り"
            value={settings.averageYield}
            onChange={(value) => updateSetting('averageYield', value)}
            min={0}
            max={15}
            step={0.1}
            unit="%"
            formatValue={(value) => `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}%`}
          />
        )}

        {isInputField('years') && (
          <InputField
            label="取り崩し期間"
            value={settings.years}
            onChange={(value) => updateSetting('years', value)}
            min={1}
            max={50}
            step={1}
            unit="年"
          />
        )}

        {isInputField('withdrawalAmount') && (
          <InputField
            label="月間取り崩し額"
            value={settings.withdrawalAmount || 0}
            onChange={(value) => updateSetting('withdrawalAmount', value)}
            min={1}
            max={100}
            step={1}
            unit="万円"
          />
        )}

        {isInputField('annualWithdrawalRate') && (
          <InputField
            label="年間取り崩し率"
            value={settings.annualWithdrawalRate || 4}
            onChange={(value) => updateSetting('annualWithdrawalRate', value)}
            min={1}
            max={20}
            step={0.1}
            unit="%"
            formatValue={(value) => `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}%`}
          />
        )}

        {isInputField('withdrawalType') && (
          <SelectField
            label="取り崩し方法"
            value={settings.withdrawalType || 'fixed'}
            onChange={(value) => updateSetting('withdrawalType', value)}
            options={[
              { value: 'fixed', label: '定額取り崩し（毎月一定額）' },
              { value: 'percentage', label: '定率取り崩し（資産の一定割合）' },
            ]}
          />
        )}
      </div>

      {/* 出力項目 */}
      <div className="mt-6 space-y-4">
        {isOutputField('years') && (
          <OutputField
            label="資産寿命"
            value={result.calculatedValue}
            formatValue={(value) => `${value.toFixed(1)}年`}
          />
        )}

        {isOutputField('initialAssets') && (
          <OutputField
            label="必要資産額"
            value={result.calculatedValue}
            formatValue={(value) => formatCurrency(value)}
          />
        )}

        {isOutputField('withdrawalAmount') && (
          <OutputField
            label="取り崩し可能額"
            value={result.calculatedValue}
            formatValue={(value) => `${formatNumber(value)}万円`}
          />
        )}
      </div>
    </div>
  );
}
