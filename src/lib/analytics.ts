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

// シミュレーションページ固有のイベント

// ページ遷移（タブ切り替え）イベント
export const sendSimulationTabSwitch = (params: { from_tab: string; to_tab: string }) => {
  sendEvent({
    action: 'tab_switch',
    category: 'Simulation_Page',
    label: `${params.from_tab}_to_${params.to_tab}`,
    value: 1,
  });
};

// 設定変更イベント
export const sendSimulationSettingChange = (params: {
  setting_name: string;
  old_value: string | number;
  new_value: string | number;
  question_type: string;
}) => {
  sendEvent({
    action: 'setting_change',
    category: 'Simulation_Page',
    label: `${params.setting_name}_${params.question_type}`,
    value: typeof params.new_value === 'number' ? params.new_value : 1,
  });
};

// 質問タイプ変更イベント
export const sendQuestionTypeChange = (params: {
  simulator_type: 'accumulation' | 'distribution';
  old_question: string;
  new_question: string;
}) => {
  sendEvent({
    action: 'question_type_change',
    category: 'Simulation_Page',
    label: `${params.simulator_type}_${params.old_question}_to_${params.new_question}`,
    value: 1,
  });
};

// ボトムシート開閉イベント
export const sendBottomSheetInteraction = (params: {
  action: 'open' | 'close';
  sheet_type: string;
}) => {
  sendEvent({
    action: `bottom_sheet_${params.action}`,
    category: 'Simulation_Page',
    label: params.sheet_type,
    value: 1,
  });
};

// 関連銘柄クリックイベント
export const sendRelatedStockClick = (params: {
  clicked_symbol: string;
  current_symbol: string;
  position_in_list: number;
}) => {
  sendEvent({
    action: 'related_stock_click',
    category: 'Simulation_Page',
    label: `${params.current_symbol}_to_${params.clicked_symbol}`,
    value: params.position_in_list,
  });
};

// 資産連携イベント（資産形成→資産活用）
export const sendAssetInheritance = (params: {
  inherited_amount: number;
  from_simulator: string;
  to_simulator: string;
}) => {
  sendEvent({
    action: 'asset_inheritance',
    category: 'Simulation_Page',
    label: `${params.from_simulator}_to_${params.to_simulator}`,
    value: params.inherited_amount,
  });
};

// シミュレーション計算完了イベント
export const sendSimulationCalculationComplete = (params: {
  simulator_type: 'accumulation' | 'distribution';
  question_type: string;
  calculation_time_ms: number;
  result_value: number;
}) => {
  sendEvent({
    action: 'calculation_complete',
    category: 'Simulation_Page',
    label: `${params.simulator_type}_${params.question_type}`,
    value: params.calculation_time_ms,
  });
};

// チャート表示完了イベント
export const sendChartRendered = (params: {
  chart_type: string;
  simulator_type: 'accumulation' | 'distribution';
  data_points: number;
}) => {
  sendEvent({
    action: 'chart_rendered',
    category: 'Simulation_Page',
    label: `${params.simulator_type}_${params.chart_type}`,
    value: params.data_points,
  });
};

// セクション滞在時間イベント
export const sendSectionTimeSpent = (params: {
  section_name: string;
  time_spent_ms: number;
  session_total_time_ms: number;
}) => {
  sendEvent({
    action: 'section_time_spent',
    category: 'Simulation_Page',
    label: params.section_name,
    value: params.time_spent_ms,
  });

  // GA4推奨イベントも送信
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: params.section_name,
      value: params.time_spent_ms,
      custom_parameters: {
        section_engagement_ratio: (
          (params.time_spent_ms / params.session_total_time_ms) *
          100
        ).toFixed(2),
        session_total_time: params.session_total_time_ms,
      },
    });
  }
};

// ページ離脱時の詳細滞在時間
export const sendPageSessionComplete = (params: {
  total_time_ms: number;
  accumulation_time_ms: number;
  distribution_time_ms: number;
  tab_switches: number;
  interactions_count: number;
}) => {
  sendEvent({
    action: 'session_complete',
    category: 'Simulation_Page',
    label: 'page_session',
    value: params.total_time_ms,
  });

  // GA4推奨イベントも送信
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'session_complete', {
      session_duration: params.total_time_ms,
      custom_parameters: {
        accumulation_section_time: params.accumulation_time_ms,
        distribution_section_time: params.distribution_time_ms,
        tab_switches: params.tab_switches,
        total_interactions: params.interactions_count,
        engagement_score: Math.min(100, params.interactions_count * 10 + params.tab_switches * 5),
      },
    });
  }
};
