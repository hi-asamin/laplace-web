'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  SimulationSettings,
  SimulationPurpose,
  SaveQuestionType,
  UseQuestionType,
  SAVE_QUESTIONS,
  USE_QUESTIONS,
} from '@/types/simulationTypes';
import Tooltip from '@/components/tooltip';

interface SimulationSettingsPanelProps {
  settings: SimulationSettings;
  onSettingsChange: (settings: SimulationSettings) => void;
  calculatedValue?: number;
  isCalculating?: boolean;
  errorMessage?: string;
}

export default function SimulationSettingsPanel({
  settings,
  onSettingsChange,
  calculatedValue,
  isCalculating,
  errorMessage,
}: SimulationSettingsPanelProps) {
  const [isQuestionDropdownOpen, setIsQuestionDropdownOpen] = useState(false);

  // 目的変更時のハンドリング
  const handlePurposeChange = (purpose: SimulationPurpose) => {
    const defaultQuestionType = purpose === 'save' ? 'total-assets' : 'required-assets';
    onSettingsChange({
      ...settings,
      purpose,
      questionType: defaultQuestionType,
      // パラメータの初期化
      initialPrincipal: purpose === 'save' ? 0 : 10000000,
      monthlyAmount: purpose === 'save' ? 30000 : undefined,
      targetAmount: purpose === 'save' ? undefined : undefined,
      initialAssets: purpose === 'use' ? 10000000 : undefined,
      withdrawalAmount: purpose === 'use' ? 10 : undefined,
      withdrawalRate: purpose === 'use' ? 4 : undefined,
      withdrawalType: purpose === 'use' ? 'fixed' : undefined,
    });
  };

  // 問いタイプ変更時のハンドリング
  const handleQuestionTypeChange = (questionType: SaveQuestionType | UseQuestionType) => {
    onSettingsChange({
      ...settings,
      questionType,
    });
    setIsQuestionDropdownOpen(false);
  };

  // 設定値変更のハンドラー
  const updateSetting = (key: keyof SimulationSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  // 現在選択中の問いの情報を取得
  const getCurrentQuestion = () => {
    const questions = settings.purpose === 'save' ? SAVE_QUESTIONS : USE_QUESTIONS;
    return questions.find((q) => q.value === settings.questionType);
  };

  // 入力項目かどうかの判定
  const isInputField = (field: string) => {
    if (settings.purpose === 'save') {
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
      }
    } else {
      switch (settings.questionType) {
        case 'required-assets':
          return ['averageYield', 'years', 'withdrawalAmount', 'withdrawalType'].includes(field);
        case 'withdrawal-amount':
          return ['initialAssets', 'averageYield', 'years', 'withdrawalType'].includes(field);
        case 'asset-lifespan':
          return ['initialAssets', 'averageYield', 'withdrawalAmount', 'withdrawalType'].includes(
            field
          );
      }
    }
    return false;
  };

  // 出力項目かどうかの判定
  const isOutputField = (field: string) => {
    if (settings.purpose === 'save') {
      switch (settings.questionType) {
        case 'total-assets':
          return field === 'totalAssets';
        case 'required-yield':
          return field === 'averageYield';
        case 'required-monthly':
          return field === 'monthlyAmount';
        case 'required-years':
          return field === 'years';
      }
    } else {
      switch (settings.questionType) {
        case 'required-assets':
          return field === 'initialAssets';
        case 'withdrawal-amount':
          return field === 'withdrawalAmount';
        case 'asset-lifespan':
          return field === 'years';
      }
    }
    return false;
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-lg">
      {/* ヘッダー：シミュレーション選択UI */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-[var(--color-gray-900)] mb-4">
          "あなたの"知りたい未来"
        </h2>

        {/* 階層①：目的選択タブ */}
        <div className="flex rounded-lg p-1 bg-[var(--color-surface-alt)] mb-4">
          <button
            onClick={() => handlePurposeChange('save')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              settings.purpose === 'save'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-gray-700)] hover:text-[var(--color-gray-900)]'
            }`}
          >
            貯める
          </button>
          <button
            onClick={() => handlePurposeChange('use')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              settings.purpose === 'use'
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'text-[var(--color-gray-700)] hover:text-[var(--color-gray-900)]'
            }`}
          >
            使う
          </button>
        </div>

        {/* 階層②：問い選択ドロップダウン */}
        <div className="relative">
          <button
            onClick={() => setIsQuestionDropdownOpen(!isQuestionDropdownOpen)}
            className="w-full flex items-center justify-between p-3 border border-[var(--color-gray-300)] rounded-lg text-left hover:border-[var(--color-primary)] transition-colors"
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

          {/* ドロップダウンメニュー */}
          {isQuestionDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-surface)] border border-[var(--color-gray-300)] rounded-lg shadow-lg z-20">
              {(settings.purpose === 'save' ? SAVE_QUESTIONS : USE_QUESTIONS).map((question) => (
                <button
                  key={question.value}
                  onClick={() => handleQuestionTypeChange(question.value)}
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

      {/* 設定項目 */}
      <div className="space-y-6">
        {/* 期間設定 */}
        {isInputField('years') && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)]">
              期間（年）
              <Tooltip
                title="期間"
                content="シミュレーションを行う期間を設定します。1年〜50年の範囲で選択できます。"
              >
                <span className="sr-only">期間の説明</span>
              </Tooltip>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={settings.years}
                onChange={(e) => updateSetting('years', Number(e.target.value))}
                className="flex-1 accent-[var(--color-primary)]"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={settings.years}
                  onChange={(e) => updateSetting('years', Number(e.target.value))}
                  className="w-16 px-2 py-1 border border-[var(--color-gray-300)] rounded text-right text-sm"
                />
                <span className="text-sm text-[var(--color-gray-700)]">年</span>
              </div>
            </div>
          </div>
        )}

        {/* 平均利回り率 */}
        {isInputField('averageYield') && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)]">
              平均利回り率（%）
              <Tooltip
                title="平均利回り率"
                content="年率での平均リターンを設定します。0.1%〜15%の範囲で選択できます。"
              >
                <span className="sr-only">平均利回り率の説明</span>
              </Tooltip>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0.1}
                max={15}
                step={0.1}
                value={settings.averageYield}
                onChange={(e) => updateSetting('averageYield', Number(e.target.value))}
                className="flex-1 accent-[var(--color-primary)]"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0.1}
                  max={15}
                  step={0.1}
                  value={settings.averageYield}
                  onChange={(e) => updateSetting('averageYield', Number(e.target.value))}
                  className="w-16 px-2 py-1 border border-[var(--color-gray-300)] rounded text-right text-sm"
                />
                <span className="text-sm text-[var(--color-gray-700)]">%</span>
              </div>
            </div>
          </div>
        )}

        {/* 貯めるモードの設定項目 */}
        {settings.purpose === 'save' && (
          <>
            {/* 初期投資元本 */}
            {isInputField('initialPrincipal') && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)]">
                  初期投資元本（万円）
                  <Tooltip
                    title="初期投資元本"
                    content="最初に一括で投資する金額を設定します。0万円〜1000万円の範囲で設定できます。"
                  >
                    <span className="sr-only">初期投資元本の説明</span>
                  </Tooltip>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={0}
                    max={10000000}
                    step={10000}
                    value={settings.initialPrincipal || 0}
                    onChange={(e) => updateSetting('initialPrincipal', Number(e.target.value))}
                    className="flex-1 accent-[var(--color-primary)]"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={Math.round((settings.initialPrincipal || 0) / 10000)}
                      onChange={(e) =>
                        updateSetting('initialPrincipal', Number(e.target.value) * 10000)
                      }
                      className="w-20 px-2 py-1 border border-[var(--color-gray-300)] rounded text-right text-sm"
                    />
                    <span className="text-sm text-[var(--color-gray-700)]">万円</span>
                  </div>
                </div>
              </div>
            )}

            {/* 毎月積立金額 */}
            {isInputField('monthlyAmount') && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)]">
                  毎月積立金額（万円）
                  <Tooltip
                    title="毎月積立金額"
                    content="毎月投資する金額を設定します。0万円〜50万円の範囲で設定できます。"
                  >
                    <span className="sr-only">毎月積立金額の説明</span>
                  </Tooltip>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={0}
                    max={500000}
                    step={10000}
                    value={settings.monthlyAmount || 0}
                    onChange={(e) => updateSetting('monthlyAmount', Number(e.target.value))}
                    className="flex-1 accent-[var(--color-primary)]"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={Math.round((settings.monthlyAmount || 0) / 10000)}
                      onChange={(e) =>
                        updateSetting('monthlyAmount', Number(e.target.value) * 10000)
                      }
                      className="w-20 px-2 py-1 border border-[var(--color-gray-300)] rounded text-right text-sm"
                    />
                    <span className="text-sm text-[var(--color-gray-700)]">万円</span>
                  </div>
                </div>
              </div>
            )}

            {/* 目標金額 */}
            {isInputField('targetAmount') && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)]">
                  目標金額（万円）
                  <Tooltip title="目標金額" content="到達したい資産総額を設定します。">
                    <span className="sr-only">目標金額の説明</span>
                  </Tooltip>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={Math.round((settings.targetAmount || 0) / 10000)}
                    onChange={(e) => updateSetting('targetAmount', Number(e.target.value) * 10000)}
                    className="flex-1 px-3 py-2 border border-[var(--color-gray-300)] rounded text-right"
                    placeholder="1000"
                  />
                  <span className="text-sm text-[var(--color-gray-700)]">万円</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* 使うモードの設定項目 */}
        {settings.purpose === 'use' && (
          <>
            {/* 初期資産額 */}
            {isInputField('initialAssets') && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)]">
                  初期資産額（万円）
                  <Tooltip
                    title="初期資産額"
                    content="取り崩しを開始する時点での資産額を設定します。"
                  >
                    <span className="sr-only">初期資産額の説明</span>
                  </Tooltip>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={Math.round((settings.initialAssets || 0) / 10000)}
                    onChange={(e) => updateSetting('initialAssets', Number(e.target.value) * 10000)}
                    className="flex-1 px-3 py-2 border border-[var(--color-gray-300)] rounded text-right"
                    placeholder="1000"
                  />
                  <span className="text-sm text-[var(--color-gray-700)]">万円</span>
                </div>
              </div>
            )}

            {/* 取り崩しタイプ */}
            {isInputField('withdrawalType') && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)]">
                  取り崩しタイプ
                  <Tooltip
                    title="取り崩しタイプ"
                    content="定額：毎年同じ金額を取り崩します。定率：残高に対して一定の割合を取り崩します。"
                  >
                    <span className="sr-only">取り崩しタイプの説明</span>
                  </Tooltip>
                </label>
                <select
                  value={settings.withdrawalType || 'fixed'}
                  onChange={(e) => updateSetting('withdrawalType', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-gray-300)] rounded"
                >
                  <option value="fixed">定額取り崩し</option>
                  <option value="percentage">定率取り崩し</option>
                </select>
              </div>
            )}

            {/* 取り崩し額 */}
            {isInputField('withdrawalAmount') && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-gray-700)]">
                  {settings.withdrawalType === 'fixed'
                    ? '月間取り崩し額（万円）'
                    : '取り崩し率（%）'}
                  <Tooltip
                    title={settings.withdrawalType === 'fixed' ? '月間取り崩し額' : '取り崩し率'}
                    content={
                      settings.withdrawalType === 'fixed'
                        ? '毎月取り崩す金額を設定します。'
                        : '残高に対する年間取り崩し率を設定します。'
                    }
                  >
                    <span className="sr-only">取り崩し設定の説明</span>
                  </Tooltip>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    step={settings.withdrawalType === 'fixed' ? 1 : 0.1}
                    value={settings.withdrawalAmount || 0}
                    onChange={(e) => updateSetting('withdrawalAmount', Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-[var(--color-gray-300)] rounded text-right"
                  />
                  <span className="text-sm text-[var(--color-gray-700)]">
                    {settings.withdrawalType === 'fixed' ? '万円' : '%'}
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {/* 計算結果表示 */}
        {calculatedValue !== undefined && (
          <div className="p-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-lg">
            <div className="text-white">
              <div className="text-sm opacity-90 mb-1">計算結果</div>
              <div className="text-2xl font-bold">
                {isCalculating ? (
                  <div className="animate-pulse">計算中...</div>
                ) : errorMessage ? (
                  <div className="text-sm text-red-200">{errorMessage}</div>
                ) : (
                  <>
                    {settings.questionType === 'required-yield' ||
                    settings.questionType === 'asset-lifespan'
                      ? `${calculatedValue.toLocaleString()}${settings.questionType === 'required-yield' ? '%' : '年'}`
                      : `¥${Math.round(calculatedValue).toLocaleString()}`}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
