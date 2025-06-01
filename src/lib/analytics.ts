// イベントの種類を定義
export type AnalyticsEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

// ページビューの送信
export const sendPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_title: document.title,
    });
  }
};

// カスタムイベントの送信
export const sendEvent = (event: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  }
};

// シミュレーション開始イベント
export const sendSimulationStart = (params: {
  symbol: string;
  initialAmount: number;
  monthlyContribution: number;
  years: number;
}) => {
  sendEvent({
    action: 'simulation_start',
    category: 'Simulation',
    label: params.symbol,
    value: params.initialAmount,
  });
};

// シミュレーション完了イベント
export const sendSimulationComplete = (params: {
  symbol: string;
  finalAmount: number;
  totalDividend: number;
}) => {
  sendEvent({
    action: 'simulation_complete',
    category: 'Simulation',
    label: params.symbol,
    value: params.finalAmount,
  });
};

// 銘柄詳細表示イベント
export const sendStockDetailView = (symbol: string) => {
  sendEvent({
    action: 'stock_detail_view',
    category: 'Stock',
    label: symbol,
  });
};

// 銘柄検索イベント
export const sendStockSearch = (query: string) => {
  sendEvent({
    action: 'stock_search',
    category: 'Search',
    label: query,
  });
};

// シミュレーション結果表示イベント
export const sendSimulationResultView = (params: {
  wizard_steps: number;
  scenario_count: number;
}) => {
  sendEvent({
    action: 'simulation_result_view',
    category: 'Simulation',
    label: `steps_${params.wizard_steps}_scenarios_${params.scenario_count}`,
  });
};

// ウィザード完了イベント
export const sendWizardCompleted = (params: { steps_total: number; duration_ms: number }) => {
  sendEvent({
    action: 'wizard_completed',
    category: 'Wizard',
    label: `steps_${params.steps_total}`,
    value: params.duration_ms,
  });
};

// シナリオ保存イベント
export const sendScenarioSaved = (params: { scenario_id: string; scenario_type: string }) => {
  sendEvent({
    action: 'scenario_saved',
    category: 'Scenario',
    label: params.scenario_id,
    value: 1,
  });
};

// シミュレーション実行イベント
export const sendSimulationExecuted = (params: { scenario_id: string }) => {
  sendEvent({
    action: 'simulation_executed',
    category: 'Simulation',
    label: params.scenario_id,
  });
};

// NPSアンケート送信イベント
export const sendSurveySubmitted = (params: { score: number; survey_type: string }) => {
  sendEvent({
    action: 'survey_submitted',
    category: 'Survey',
    label: params.survey_type,
    value: params.score,
  });
};

// 課金イベント
export const sendPurchase = (params: { value: number; currency: string; payment_type: string }) => {
  sendEvent({
    action: 'purchase',
    category: 'Purchase',
    label: params.payment_type,
    value: params.value,
  });
};

// エラー発生イベント
export const sendError = (error: Error) => {
  sendEvent({
    action: 'error',
    category: 'Error',
    label: error.message,
  });
};
