import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  SimulationSettings,
  SimulationResult,
  SimulationPurpose,
  SaveQuestionType,
  UseQuestionType,
} from '@/types/simulationTypes';
import {
  calculateAssetAccumulation,
  calculateAssetDistribution,
} from '@/utils/simulationCalculations';

interface UseSimulationProps {
  purpose: SimulationPurpose;
  initialSettings?: Partial<SimulationSettings>;
}

interface UseSimulationReturn {
  settings: SimulationSettings;
  result: SimulationResult;
  isCalculating: boolean;
  updateSetting: (key: keyof SimulationSettings, value: any) => void;
  updateMultipleSettings: (updates: Partial<SimulationSettings>) => void;
  setQuestionType: (questionType: SaveQuestionType | UseQuestionType) => void;
  resetToDefaults: () => void;
  executeSimulation: () => void;
}

// デフォルト設定
const DEFAULT_SAVE_SETTINGS: SimulationSettings = {
  purpose: 'save',
  questionType: 'total-assets',
  averageYield: 5,
  years: 30,
  initialPrincipal: 0,
  monthlyAmount: 30000,
  targetAmount: 10000000,
};

const DEFAULT_USE_SETTINGS: SimulationSettings = {
  purpose: 'use',
  questionType: 'asset-lifespan',
  averageYield: 4,
  years: 30,
  initialAssets: 10000000,
  withdrawalAmount: 10,
  withdrawalType: 'fixed',
};

export function useSimulation({
  purpose,
  initialSettings = {},
}: UseSimulationProps): UseSimulationReturn {
  // 設定の初期化
  const [settings, setSettings] = useState<SimulationSettings>(() => {
    const defaultSettings = purpose === 'save' ? DEFAULT_SAVE_SETTINGS : DEFAULT_USE_SETTINGS;
    return {
      ...defaultSettings,
      ...initialSettings,
      purpose, // purposeは props から強制的に設定
    };
  });

  const [isCalculating, setIsCalculating] = useState(false);

  // 計算結果をメモ化
  const result = useMemo((): SimulationResult => {
    try {
      const calculationResult =
        purpose === 'save'
          ? calculateAssetAccumulation(settings)
          : calculateAssetDistribution(settings);

      return calculationResult;
    } catch (error) {
      return {
        data: [],
        isSuccess: false,
        errorMessage: error instanceof Error ? error.message : '計算エラーが発生しました',
      };
    }
  }, [settings, purpose]);

  // 計算状態の管理
  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => setIsCalculating(false), 100);
    return () => clearTimeout(timer);
  }, [result]); // resultが変更されたときのみ計算状態を更新

  // 設定更新関数
  const updateSetting = useCallback((key: keyof SimulationSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // 複数の設定を一度に更新
  const updateMultipleSettings = useCallback((updates: Partial<SimulationSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  // 質問タイプ変更時の処理
  const setQuestionType = useCallback(
    (questionType: SaveQuestionType | UseQuestionType) => {
      setSettings((prev) => {
        // 質問タイプに応じてデフォルト値をリセット
        const newSettings = { ...prev, questionType };

        if (purpose === 'save') {
          switch (questionType as SaveQuestionType) {
            case 'total-assets':
              return {
                ...newSettings,
                // targetAmountは不要になるのでundefinedに
                targetAmount: undefined,
              };
            case 'required-yield':
            case 'required-monthly':
            case 'required-years':
              return {
                ...newSettings,
                // targetAmountが必要になるので設定
                targetAmount: prev.targetAmount || 10000000,
              };
            default:
              return newSettings;
          }
        } else {
          switch (questionType as UseQuestionType) {
            case 'asset-lifespan':
              return {
                ...newSettings,
                // 資産寿命計算では初期資産と取り崩し額が必要
                initialAssets: prev.initialAssets || 10000000,
                withdrawalAmount: prev.withdrawalAmount || 10,
              };
            case 'required-assets':
              return {
                ...newSettings,
                // 必要資産額計算では取り崩し額が必要
                withdrawalAmount: prev.withdrawalAmount || 10,
              };
            case 'withdrawal-amount':
              return {
                ...newSettings,
                // 取り崩し額計算では初期資産が必要
                initialAssets: prev.initialAssets || 10000000,
              };
            default:
              return newSettings;
          }
        }
      });
    },
    [purpose]
  );

  // デフォルト値にリセット
  const resetToDefaults = useCallback(() => {
    const defaultSettings = purpose === 'save' ? DEFAULT_SAVE_SETTINGS : DEFAULT_USE_SETTINGS;
    setSettings({
      ...defaultSettings,
      purpose,
    });
  }, [purpose]);

  // purpose が変更された場合の対応
  const purposeRef = useRef(purpose);
  useEffect(() => {
    if (purposeRef.current !== purpose) {
      purposeRef.current = purpose;
      const defaultSettings = purpose === 'save' ? DEFAULT_SAVE_SETTINGS : DEFAULT_USE_SETTINGS;
      setSettings((prev) => {
        // purposeが実際に変更された場合のみ更新
        if (prev.purpose === purpose) {
          return prev; // 変更がない場合は現在の設定をそのまま返す
        }

        return {
          ...defaultSettings,
          purpose,
          // 既存の設定で有効なものは保持
          ...(prev.averageYield && { averageYield: prev.averageYield }),
          ...(prev.years && { years: prev.years }),
          ...(prev.monthlyAmount && { monthlyAmount: prev.monthlyAmount }),
          ...(prev.targetAmount && { targetAmount: prev.targetAmount }),
          ...(prev.initialPrincipal && { initialPrincipal: prev.initialPrincipal }),
          ...(prev.initialAssets && { initialAssets: prev.initialAssets }),
          ...(prev.withdrawalAmount && { withdrawalAmount: prev.withdrawalAmount }),
        };
      });
    }
  }, [purpose]);

  // 再計算を強制トリガーする関数
  const executeSimulation = useCallback(() => {
    // 計算状態を一時的にtrueにして再計算をトリガー
    setIsCalculating(true);
    const timer = setTimeout(() => setIsCalculating(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return {
    settings,
    result,
    isCalculating,
    updateSetting,
    updateMultipleSettings,
    setQuestionType,
    resetToDefaults,
    executeSimulation,
  };
}

// 資産形成シミュレーション専用フック
export function useAssetAccumulationSimulation(initialSettings?: Partial<SimulationSettings>) {
  return useSimulation({
    purpose: 'save',
    initialSettings,
  });
}

// 資産活用シミュレーション専用フック
export function useAssetDistributionSimulation(initialSettings?: Partial<SimulationSettings>) {
  return useSimulation({
    purpose: 'use',
    initialSettings,
  });
}

// 資産活用シミュレーション（継承資産対応版）
export function useAssetDistributionWithInheritance(
  initialSettings?: Partial<SimulationSettings>,
  inheritedAssets?: number
) {
  const simulation = useSimulation({
    purpose: 'use',
    initialSettings,
  });

  const prevInheritedAssetsRef = useRef<number | undefined>(undefined);

  // inheritedAssets が変更されたときに initialAssets を自動更新
  useEffect(() => {
    if (
      inheritedAssets !== undefined &&
      inheritedAssets > 0 &&
      inheritedAssets !== prevInheritedAssetsRef.current
    ) {
      prevInheritedAssetsRef.current = inheritedAssets;
      simulation.updateSetting('initialAssets', inheritedAssets);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inheritedAssets]);

  return simulation;
}
