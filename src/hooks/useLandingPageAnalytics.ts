'use client';

import { useEffect, useRef } from 'react';
import { sendEvent } from '@/lib/analytics';

export const useLandingPageAnalytics = () => {
  const pageStartTimeRef = useRef<number>(Date.now());
  const sectionTimesRef = useRef<Record<string, number>>({});

  // CTA（行動喚起）ボタンクリックの追跡
  const trackCTAClick = (ctaLocation: string, ctaText: string, destination: string) => {
    sendEvent({
      action: 'cta_click',
      category: 'Landing_Page',
      label: `${ctaLocation}_${ctaText}`,
      value: 1,
    });

    // gtag推奨イベントも送信
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'select_content', {
        content_type: 'cta_button',
        content_id: ctaLocation,
        custom_parameters: {
          cta_text: ctaText,
          destination: destination,
        },
      });
    }
  };

  // 銘柄チップクリックの追跡
  const trackStockChipClick = (stockSymbol: string, stockName: string) => {
    sendEvent({
      action: 'stock_chip_click',
      category: 'Landing_Page',
      label: stockSymbol,
      value: 1,
    });

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'select_item', {
        item_list_id: 'popular_stocks',
        item_list_name: 'Popular Stocks',
        items: [
          {
            item_id: stockSymbol,
            item_name: stockName,
            item_category: 'stock',
          },
        ],
      });
    }
  };

  // セクション到達の追跡
  const trackSectionView = (sectionName: string) => {
    const currentTime = Date.now();
    sectionTimesRef.current[sectionName] = currentTime;

    sendEvent({
      action: 'section_view',
      category: 'Landing_Page',
      label: sectionName,
      value: 1,
    });

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: `LP_Section_${sectionName}`,
        page_location: window.location.href,
        custom_parameters: {
          section_name: sectionName,
        },
      });
    }
  };

  // セクション滞在時間の追跡
  const trackSectionTimeSpent = (sectionName: string) => {
    const startTime = sectionTimesRef.current[sectionName];
    if (startTime) {
      const timeSpent = Date.now() - startTime;
      sendEvent({
        action: 'section_time_spent',
        category: 'Landing_Page',
        label: sectionName,
        value: timeSpent,
      });
    }
  };

  // ナビゲーションクリックの追跡
  const trackNavigationClick = (linkText: string, destination: string) => {
    sendEvent({
      action: 'navigation_click',
      category: 'Landing_Page',
      label: linkText,
      value: 1,
    });

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        link_text: linkText,
        link_url: destination,
        outbound: destination.startsWith('http'),
      });
    }
  };

  // フォーム関連イベントの追跡
  const trackFormInteraction = (formType: string, action: string, value?: string) => {
    sendEvent({
      action: `form_${action}`,
      category: 'Landing_Page',
      label: `${formType}_${action}`,
      value: 1,
    });

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', `form_${action}`, {
        form_type: formType,
        form_value: value,
      });
    }
  };

  // FAQ展開/閉じるの追跡
  const trackFAQInteraction = (question: string, action: 'expand' | 'collapse') => {
    sendEvent({
      action: `faq_${action}`,
      category: 'Landing_Page',
      label: question,
      value: 1,
    });
  };

  // スクロール深度の追跡
  const trackScrollDepth = (percentage: number) => {
    sendEvent({
      action: 'scroll_depth',
      category: 'Landing_Page',
      label: `${percentage}%`,
      value: percentage,
    });

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'scroll', {
        percent_scrolled: percentage,
      });
    }
  };

  // ページ全体の滞在時間追跡
  const trackPageTimeSpent = () => {
    const timeSpent = Date.now() - pageStartTimeRef.current;
    sendEvent({
      action: 'page_time_spent',
      category: 'Landing_Page',
      label: 'total_time',
      value: timeSpent,
    });
    return timeSpent;
  };

  // エラーの追跡
  const trackError = (error: Error, context?: string) => {
    sendEvent({
      action: 'error',
      category: 'Landing_Page',
      label: `${context || 'unknown'}_${error.message}`,
      value: 1,
    });

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        custom_parameters: {
          context: context || 'landing_page',
        },
      });
    }
  };

  // パフォーマンス指標の追跡
  const trackPerformance = () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        // ページ読み込み時間
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        sendEvent({
          action: 'page_load_time',
          category: 'Performance',
          label: 'landing_page',
          value: loadTime,
        });

        // First Contentful Paint
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcpEntry) {
          sendEvent({
            action: 'first_contentful_paint',
            category: 'Performance',
            label: 'landing_page',
            value: Math.round(fcpEntry.startTime),
          });
        }
      }
    }
  };

  // コンポーネントマウント時の初期化
  useEffect(() => {
    pageStartTimeRef.current = Date.now();

    // パフォーマンス測定
    if (document.readyState === 'complete') {
      trackPerformance();
    } else {
      window.addEventListener('load', trackPerformance);
    }

    // ページ離脱時の滞在時間追跡
    const handleBeforeUnload = () => {
      trackPageTimeSpent();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('load', trackPerformance);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      trackPageTimeSpent();
    };
  }, []);

  return {
    trackCTAClick,
    trackStockChipClick,
    trackSectionView,
    trackSectionTimeSpent,
    trackNavigationClick,
    trackFormInteraction,
    trackFAQInteraction,
    trackScrollDepth,
    trackPageTimeSpent,
    trackError,
    trackPerformance,
  };
};
