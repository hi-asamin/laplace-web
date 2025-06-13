// 開発環境でのアナリティクステスト用ユーティリティ

interface TestEvent {
  event_name: string;
  timestamp: string;
  parameters: Record<string, any>;
}

// テスト用のイベントログ
let testEventLog: TestEvent[] = [];

// 開発環境でイベント送信をモニタリング
export const enableAnalyticsDebug = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // 既存のgtag関数をラップしてログ出力
    const originalGtag = window.gtag;

    window.gtag = function (
      command: 'event' | 'config' | 'js' | 'consent',
      action: string,
      params?: any
    ) {
      if (command === 'event') {
        const testEvent: TestEvent = {
          event_name: action,
          timestamp: new Date().toISOString(),
          parameters: params || {},
        };
        testEventLog.push(testEvent);

        console.group(`🔍 GA4 Event: ${action}`);
        console.log('Category:', params?.event_category || 'N/A');
        console.log('Label:', params?.event_label || 'N/A');
        console.log('Value:', params?.value || 'N/A');
        console.log('Parameters:', params);
        console.log('Timestamp:', testEvent.timestamp);
        console.groupEnd();
      }

      // 元のgtag関数を呼び出し
      if (originalGtag) {
        originalGtag(command, action, params);
      }
    };

    // デバッグ情報をコンソールに出力
    console.log('🚀 Analytics Debug Mode Enabled');
    console.log('イベントの送信状況をコンソールで確認できます');
  }
};

// テストイベントログを取得
export const getTestEventLog = (): TestEvent[] => {
  return [...testEventLog];
};

// テストイベントログをクリア
export const clearTestEventLog = () => {
  testEventLog = [];
};

// 特定のイベントが送信されたかを確認
export const hasEventBeenSent = (eventName: string): boolean => {
  return testEventLog.some((event) => event.event_name === eventName);
};

// イベント送信履歴をCSV形式でエクスポート
export const exportEventLogAsCSV = (): string => {
  if (testEventLog.length === 0) {
    return 'No events logged';
  }

  const headers = ['Event Name', 'Timestamp', 'Category', 'Label', 'Value', 'All Parameters'];
  const rows = testEventLog.map((event) => [
    event.event_name,
    event.timestamp,
    event.parameters.event_category || '',
    event.parameters.event_label || '',
    event.parameters.value || '',
    JSON.stringify(event.parameters),
  ]);

  return [headers, ...rows].map((row) => row.join(',')).join('\n');
};

// 最近のイベントを表示（開発者向け）
export const showRecentEvents = (count: number = 10) => {
  const recentEvents = testEventLog.slice(-count);
  console.table(
    recentEvents.map((event) => ({
      Event: event.event_name,
      Time: new Date(event.timestamp).toLocaleTimeString(),
      Category: event.parameters.event_category,
      Label: event.parameters.event_label,
      Value: event.parameters.value,
    }))
  );
};

// 滞在時間関連のイベントを表示
export const showTimeSpentEvents = () => {
  const timeEvents = testEventLog.filter(
    (event) =>
      event.event_name.includes('time_spent') ||
      event.event_name.includes('session_complete') ||
      event.event_name.includes('timing_complete')
  );

  console.group('📊 滞在時間関連イベント');
  timeEvents.forEach((event) => {
    console.log(`⏱️ ${event.event_name}:`);
    console.log(`  セクション: ${event.parameters.event_label}`);
    console.log(
      `  時間: ${event.parameters.value ? (event.parameters.value / 1000).toFixed(1) : 'N/A'}秒`
    );
    if (event.parameters.custom_parameters) {
      console.log(`  詳細:`, event.parameters.custom_parameters);
    }
    console.log(`  時刻: ${new Date(event.timestamp).toLocaleTimeString()}`);
    console.log('---');
  });
  console.groupEnd();
};

// セッション統計の表示
export const showSessionStats = () => {
  const sessionEvents = testEventLog.filter((event) => event.event_name === 'session_complete');

  if (sessionEvents.length === 0) {
    console.log('📈 セッション統計: まだセッション完了イベントがありません');
    return;
  }

  const latestSession = sessionEvents[sessionEvents.length - 1];
  const params = latestSession.parameters.custom_parameters || {};

  console.group('📈 現在のセッション統計');
  console.log(`総滞在時間: ${(latestSession.parameters.value / 1000 / 60).toFixed(1)}分`);
  console.log(`資産形成セクション: ${(params.accumulation_section_time / 1000).toFixed(1)}秒`);
  console.log(`資産活用セクション: ${(params.distribution_section_time / 1000).toFixed(1)}秒`);
  console.log(`タブ切り替え回数: ${params.tab_switches}回`);
  console.log(`操作回数: ${params.total_interactions}回`);
  console.log(`エンゲージメントスコア: ${params.engagement_score}点`);
  console.groupEnd();
};

// ブラウザのグローバル関数として利用可能にする（開発環境のみ）
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).analyticsDebug = {
    getLog: getTestEventLog,
    clearLog: clearTestEventLog,
    hasEvent: hasEventBeenSent,
    exportCSV: exportEventLogAsCSV,
    showRecent: showRecentEvents,
    showTimeSpent: showTimeSpentEvents,
    showSessionStats: showSessionStats,
    enable: enableAnalyticsDebug,
  };

  // 自動的にデバッグモードを有効化
  enableAnalyticsDebug();
}
