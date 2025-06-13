'use client';

import { useEffect, useRef } from 'react';
import {
  sendSimulationResultView,
  sendWizardCompleted,
  sendScenarioSaved,
  sendSimulationExecuted,
  sendSurveySubmitted,
  sendError,
  sendEvent,
  sendSimulationTabSwitch,
  sendSimulationSettingChange,
  sendQuestionTypeChange,
  sendBottomSheetInteraction,
  sendRelatedStockClick,
  sendAssetInheritance,
  sendSimulationCalculationComplete,
  sendChartRendered,
  sendSectionTimeSpent,
  sendPageSessionComplete,
} from '@/lib/analytics';

export const useSimulationAnalytics = () => {
  const startTimeRef = useRef<number>(Date.now());
  const pageStartTimeRef = useRef<number>(Date.now());

  // セクション別滞在時間の管理
  const sectionTimesRef = useRef<Record<string, number>>({});
  const currentSectionRef = useRef<string>('accumulation');
  const interactionCountRef = useRef<number>(0);
  const tabSwitchCountRef = useRef<number>(0);

  // シミュレーション結果表示時のトラッキング
  const trackSimulationResultView = (wizardSteps: number, scenarioCount: number) => {
    sendSimulationResultView({
      wizard_steps: wizardSteps,
      scenario_count: scenarioCount,
    });
  };

  // ウィザード完了時のトラッキング
  const trackWizardCompleted = (stepsTotal: number) => {
    const duration = Date.now() - startTimeRef.current;
    sendWizardCompleted({
      steps_total: stepsTotal,
      duration_ms: duration,
    });
  };

  // シナリオ保存時のトラッキング
  const trackScenarioSaved = (scenarioId: string, scenarioType: string) => {
    sendScenarioSaved({
      scenario_id: scenarioId,
      scenario_type: scenarioType,
    });
  };

  // シミュレーション実行時のトラッキング
  const trackSimulationExecuted = (scenarioId: string) => {
    sendSimulationExecuted({
      scenario_id: scenarioId,
    });
  };

  // NPSアンケート送信時のトラッキング
  const trackSurveySubmitted = (score: number, surveyType: string = 'nps_d7') => {
    sendSurveySubmitted({
      score,
      survey_type: surveyType,
    });
  };

  // エラー発生時のトラッキング
  const trackError = (error: Error) => {
    sendError(error);
  };

  // 滞在時間の計測開始
  const startTimeTracking = () => {
    pageStartTimeRef.current = Date.now();
  };

  // 滞在時間の計測終了と送信
  const trackTimeSpent = (category: string = 'Simulation') => {
    const timeSpent = Date.now() - pageStartTimeRef.current;
    sendEvent({
      action: 'time_spent',
      category,
      label: 'page_duration',
      value: timeSpent,
    });
    return timeSpent;
  };

  // 詳細なセッション完了データの送信
  const trackDetailedSessionComplete = () => {
    // 現在のセクションの滞在時間を終了
    const currentSectionTime = endSectionTimer(currentSectionRef.current);

    // 各セクションの累計時間を計算
    const accumulationTime = Object.keys(sectionTimesRef.current)
      .filter((key) => key === 'accumulation')
      .reduce((total, key) => total + (Date.now() - sectionTimesRef.current[key]), 0);

    const distributionTime = Object.keys(sectionTimesRef.current)
      .filter((key) => key === 'distribution')
      .reduce((total, key) => total + (Date.now() - sectionTimesRef.current[key]), 0);

    const totalTime = Date.now() - pageStartTimeRef.current;

    sendPageSessionComplete({
      total_time_ms: totalTime,
      accumulation_time_ms: accumulationTime,
      distribution_time_ms: distributionTime,
      tab_switches: tabSwitchCountRef.current,
      interactions_count: interactionCountRef.current,
    });

    return {
      totalTime,
      accumulationTime,
      distributionTime,
      tabSwitches: tabSwitchCountRef.current,
      interactions: interactionCountRef.current,
    };
  };

  // コンポーネントマウント時に開始時間を記録
  useEffect(() => {
    startTimeRef.current = Date.now();
    startTimeTracking();

    // 初期セクション（資産形成）の計測開始
    startSectionTimer('accumulation');

    // ページの可視性変更を監視
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackDetailedSessionComplete();
      } else if (document.visibilityState === 'visible') {
        // ページが再表示された時は現在のセクションの計測を再開
        startSectionTimer(currentSectionRef.current);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // コンポーネントのアンマウント時に詳細滞在時間を送信
    return () => {
      trackTimeSpent();
      trackDetailedSessionComplete();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // セクション滞在時間の開始
  const startSectionTimer = (sectionName: string) => {
    sectionTimesRef.current[sectionName] = Date.now();
    currentSectionRef.current = sectionName;
  };

  // セクション滞在時間の終了と送信
  const endSectionTimer = (sectionName: string) => {
    const startTime = sectionTimesRef.current[sectionName];
    if (startTime) {
      const timeSpent = Date.now() - startTime;
      const sessionTotalTime = Date.now() - pageStartTimeRef.current;

      sendSectionTimeSpent({
        section_name: sectionName,
        time_spent_ms: timeSpent,
        session_total_time_ms: sessionTotalTime,
      });

      return timeSpent;
    }
    return 0;
  };

  // インタラクション数をカウント
  const incrementInteraction = () => {
    interactionCountRef.current += 1;
  };

  // タブ切り替えの追跡
  const trackTabSwitch = (fromTab: string, toTab: string) => {
    // 前のセクションの滞在時間を記録
    endSectionTimer(fromTab);

    // 新しいセクションの計測開始
    startSectionTimer(toTab);

    // タブ切り替え回数をカウント
    tabSwitchCountRef.current += 1;

    sendSimulationTabSwitch({
      from_tab: fromTab,
      to_tab: toTab,
    });
  };

  // 設定変更の追跡
  const trackSettingChange = (
    settingName: string,
    oldValue: string | number,
    newValue: string | number,
    questionType: string
  ) => {
    incrementInteraction();
    sendSimulationSettingChange({
      setting_name: settingName,
      old_value: oldValue,
      new_value: newValue,
      question_type: questionType,
    });
  };

  // 質問タイプ変更の追跡
  const trackQuestionTypeChange = (
    simulatorType: 'accumulation' | 'distribution',
    oldQuestion: string,
    newQuestion: string
  ) => {
    incrementInteraction();
    sendQuestionTypeChange({
      simulator_type: simulatorType,
      old_question: oldQuestion,
      new_question: newQuestion,
    });
  };

  // ボトムシート操作の追跡
  const trackBottomSheetInteraction = (action: 'open' | 'close', sheetType: string) => {
    incrementInteraction();
    sendBottomSheetInteraction({
      action,
      sheet_type: sheetType,
    });
  };

  // 関連銘柄クリックの追跡
  const trackRelatedStockClick = (
    clickedSymbol: string,
    currentSymbol: string,
    positionInList: number
  ) => {
    incrementInteraction();
    sendRelatedStockClick({
      clicked_symbol: clickedSymbol,
      current_symbol: currentSymbol,
      position_in_list: positionInList,
    });
  };

  // 資産連携の追跡
  const trackAssetInheritance = (
    inheritedAmount: number,
    fromSimulator: string,
    toSimulator: string
  ) => {
    sendAssetInheritance({
      inherited_amount: inheritedAmount,
      from_simulator: fromSimulator,
      to_simulator: toSimulator,
    });
  };

  // シミュレーション計算完了の追跡
  const trackCalculationComplete = (
    simulatorType: 'accumulation' | 'distribution',
    questionType: string,
    calculationTimeMs: number,
    resultValue: number
  ) => {
    sendSimulationCalculationComplete({
      simulator_type: simulatorType,
      question_type: questionType,
      calculation_time_ms: calculationTimeMs,
      result_value: resultValue,
    });
  };

  // チャート表示完了の追跡
  const trackChartRendered = (
    chartType: string,
    simulatorType: 'accumulation' | 'distribution',
    dataPoints: number
  ) => {
    sendChartRendered({
      chart_type: chartType,
      simulator_type: simulatorType,
      data_points: dataPoints,
    });
  };

  return {
    trackSimulationResultView,
    trackWizardCompleted,
    trackScenarioSaved,
    trackSimulationExecuted,
    trackSurveySubmitted,
    trackError,
    startTimeTracking,
    trackTimeSpent,
    trackTabSwitch,
    trackSettingChange,
    trackQuestionTypeChange,
    trackBottomSheetInteraction,
    trackRelatedStockClick,
    trackAssetInheritance,
    trackCalculationComplete,
    trackChartRendered,
    // 詳細滞在時間計測機能
    startSectionTimer,
    endSectionTimer,
    trackDetailedSessionComplete,
    incrementInteraction,
  };
};
