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
} from '@/lib/analytics';

export const useSimulationAnalytics = () => {
  const startTimeRef = useRef<number>(Date.now());
  const pageStartTimeRef = useRef<number>(Date.now());

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

  // コンポーネントマウント時に開始時間を記録
  useEffect(() => {
    startTimeRef.current = Date.now();
    startTimeTracking();

    // コンポーネントのアンマウント時に滞在時間を送信
    return () => {
      trackTimeSpent();
    };
  }, []);

  return {
    trackSimulationResultView,
    trackWizardCompleted,
    trackScenarioSaved,
    trackSimulationExecuted,
    trackSurveySubmitted,
    trackError,
    startTimeTracking,
    trackTimeSpent,
  };
};
