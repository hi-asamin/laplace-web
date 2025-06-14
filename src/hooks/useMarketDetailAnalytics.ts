'use client';

import { useEffect, useRef } from 'react';
import { sendEvent } from '@/lib/analytics';

export const useMarketDetailAnalytics = () => {
  const pageStartTimeRef = useRef<number>(Date.now());
  const sectionTimesRef = useRef<Record<string, number>>({});

  // ページ表示の追跡
  const trackPageView = (symbol: string, marketName?: string) => {
    sendEvent({
      action: 'page_view',
      category: 'Market_Detail',
      label: symbol,
      value: 1,
    });

    // GA4推奨イベントも送信
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: `${marketName || symbol} - 市場詳細`,
        page_location: window.location.href,
        custom_parameters: {
          stock_symbol: symbol,
          stock_name: marketName,
          page_type: 'market_detail',
        },
      });
    }
  };

  // チャート期間変更の追跡
  const trackChartPeriodChange = (symbol: string, fromPeriod: string, toPeriod: string) => {
    sendEvent({
      action: 'chart_period_change',
      category: 'Market_Detail',
      label: `${symbol}_${fromPeriod}_to_${toPeriod}`,
      value: 1,
    });

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'select_content', {
        content_type: 'chart_period',
        content_id: toPeriod,
        custom_parameters: {
          stock_symbol: symbol,
          from_period: fromPeriod,
          to_period: toPeriod,
        },
      });
    }
  };

  // ブックマーク操作の追跡
  const trackBookmarkToggle = (symbol: string, action: 'add' | 'remove') => {
    sendEvent({
      action: `bookmark_${action}`,
      category: 'Market_Detail',
      label: symbol,
      value: 1,
    });

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action === 'add' ? 'add_to_wishlist' : 'remove_from_wishlist', {
        currency: 'JPY',
        value: 1,
        items: [
          {
            item_id: symbol,
            item_name: symbol,
            item_category: 'stock',
          },
        ],
      });
    }
  };

  // シミュレーションボタンクリックの追跡
  const trackSimulationButtonClick = (symbol: string, marketName?: string) => {
    sendEvent({
      action: 'simulation_button_click',
      category: 'Market_Detail',
      label: symbol,
      value: 1,
    });

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'select_content', {
        content_type: 'cta_button',
        content_id: 'simulation_start',
        custom_parameters: {
          stock_symbol: symbol,
          stock_name: marketName,
          button_location: 'market_detail_bottom',
        },
      });
    }
  };

  // カード表示の追跡
  const trackCardView = (symbol: string, cardType: string) => {
    sendEvent({
      action: 'card_view',
      category: 'Market_Detail',
      label: `${symbol}_${cardType}`,
      value: 1,
    });

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'JPY',
        value: 1,
        items: [
          {
            item_id: `${symbol}_${cardType}`,
            item_name: cardType,
            item_category: 'market_info_card',
          },
        ],
        custom_parameters: {
          stock_symbol: symbol,
          card_type: cardType,
        },
      });
    }
  };

  // ツールチップ表示の追跡
  const trackTooltipView = (symbol: string, tooltipType: string) => {
    sendEvent({
      action: 'tooltip_view',
      category: 'Market_Detail',
      label: `${symbol}_${tooltipType}`,
      value: 1,
    });
  };

  // 関連銘柄クリックの追跡
  const trackRelatedStockClick = (fromSymbol: string, toSymbol: string, toStockName?: string) => {
    sendEvent({
      action: 'related_stock_click',
      category: 'Market_Detail',
      label: `${fromSymbol}_to_${toSymbol}`,
      value: 1,
    });

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'select_item', {
        item_list_id: 'related_stocks',
        item_list_name: 'Related Stocks',
        items: [
          {
            item_id: toSymbol,
            item_name: toStockName || toSymbol,
            item_category: 'stock',
          },
        ],
        custom_parameters: {
          from_symbol: fromSymbol,
          to_symbol: toSymbol,
        },
      });
    }
  };

  // セクション滞在時間の追跡
  const trackSectionView = (symbol: string, sectionName: string) => {
    const currentTime = Date.now();
    sectionTimesRef.current[sectionName] = currentTime;

    sendEvent({
      action: 'section_view',
      category: 'Market_Detail',
      label: `${symbol}_${sectionName}`,
      value: 1,
    });
  };

  const trackSectionTimeSpent = (symbol: string, sectionName: string) => {
    const startTime = sectionTimesRef.current[sectionName];
    if (startTime) {
      const timeSpent = Date.now() - startTime;
      sendEvent({
        action: 'section_time_spent',
        category: 'Market_Detail',
        label: `${symbol}_${sectionName}`,
        value: timeSpent,
      });
    }
  };

  // エラーの追跡
  const trackError = (symbol: string, error: Error, context?: string) => {
    sendEvent({
      action: 'error',
      category: 'Market_Detail',
      label: `${symbol}_${context || 'unknown'}_${error.message}`,
      value: 1,
    });

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        custom_parameters: {
          stock_symbol: symbol,
          context: context || 'market_detail',
        },
      });
    }
  };

  // ページ滞在時間の追跡
  const trackPageTimeSpent = (symbol: string) => {
    const timeSpent = Date.now() - pageStartTimeRef.current;
    sendEvent({
      action: 'page_time_spent',
      category: 'Market_Detail',
      label: symbol,
      value: timeSpent,
    });
    return timeSpent;
  };

  // データ読み込み完了の追跡
  const trackDataLoadComplete = (symbol: string, dataType: string, loadTime: number) => {
    sendEvent({
      action: 'data_load_complete',
      category: 'Market_Detail',
      label: `${symbol}_${dataType}`,
      value: loadTime,
    });

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: `${dataType}_load`,
        value: loadTime,
        custom_parameters: {
          stock_symbol: symbol,
          data_type: dataType,
        },
      });
    }
  };

  // コンポーネントマウント時の初期化
  useEffect(() => {
    pageStartTimeRef.current = Date.now();

    // ページ離脱時の滞在時間追跡
    const handleBeforeUnload = () => {
      // 現在表示中のセクションの滞在時間を記録
      Object.keys(sectionTimesRef.current).forEach((sectionName) => {
        trackSectionTimeSpent('', sectionName);
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return {
    trackPageView,
    trackChartPeriodChange,
    trackBookmarkToggle,
    trackSimulationButtonClick,
    trackCardView,
    trackTooltipView,
    trackRelatedStockClick,
    trackSectionView,
    trackSectionTimeSpent,
    trackError,
    trackPageTimeSpent,
    trackDataLoadComplete,
  };
};
