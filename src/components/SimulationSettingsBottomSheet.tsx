import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { SimulationSettings, SimulationResult } from '@/types/simulationTypes';
import {
  calculateAssetAccumulation,
  calculateAssetDistribution,
} from '@/utils/simulationCalculations';

interface SimulationSettingsBottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  initialSettings: SimulationSettings;
  onAnalyze: (settings: SimulationSettings) => void;
  isAnalyzing: boolean;
  children: (props: {
    localSettings: SimulationSettings;
    setLocalSettings: (settings: SimulationSettings) => void;
    localResult: SimulationResult;
  }) => React.ReactNode;
}

// 浅い比較関数
const shallowEqual = (obj1: any, obj2: any): boolean => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};

const SimulationSettingsBottomSheet: React.FC<SimulationSettingsBottomSheetProps> = ({
  open,
  onClose,
  title = '条件を変更する',
  initialSettings,
  onAnalyze,
  isAnalyzing,
  children,
}) => {
  const [localSettings, setLocalSettings] = useState<SimulationSettings>(initialSettings);
  const prevInitialSettingsRef = useRef<SimulationSettings>(initialSettings);

  // initialSettingsが実際に変更されたときのみlocalSettingsを更新
  useEffect(() => {
    // 浅い比較で変更を検出
    const hasChanged = !shallowEqual(prevInitialSettingsRef.current, initialSettings);

    if (hasChanged) {
      setLocalSettings(initialSettings);
      prevInitialSettingsRef.current = initialSettings;
    }
  }, [initialSettings]);

  // localSettingsが変更されるたびにリアルタイムで計算結果を更新
  const localResult = useMemo((): SimulationResult => {
    try {
      const calculationResult =
        localSettings.purpose === 'save'
          ? calculateAssetAccumulation(localSettings)
          : calculateAssetDistribution(localSettings);
      return calculationResult;
    } catch (error) {
      return {
        data: [],
        isSuccess: false,
        errorMessage: error instanceof Error ? error.message : '計算エラーが発生しました',
      };
    }
  }, [localSettings]);

  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  if (!open) return null;

  const handleAnalyze = () => {
    onAnalyze(localSettings);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* ボトムシート */}
      <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-surface)] rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[var(--color-gray-900)]">{title}</h3>
          <button
            onClick={onClose}
            className="text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)]"
            aria-label="閉じる"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 設定パネル */}
        <div className="mb-6">{children({ localSettings, setLocalSettings, localResult })}</div>

        {/* 分析実行ボタン */}
        <div className="pt-4 border-t border-[var(--color-gray-200)]">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-[var(--color-lp-mint)] text-white py-3 px-4 rounded-lg 
                       hover:bg-[var(--color-lp-mint)]/90 disabled:opacity-50 disabled:cursor-not-allowed
                       font-medium transition-colors"
          >
            {isAnalyzing ? '分析中...' : '分析実行する'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationSettingsBottomSheet;
