'use client';

import { ExternalLink, Clock, Newspaper } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  publishedAt: string;
  source: string;
  url: string;
  imageUrl?: string;
}

interface NewsCardProps {
  newsItems: NewsItem[];
  className?: string;
}

export default function NewsCard({ newsItems, className = '' }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

      if (diffInHours < 1) {
        return '1時間未満前';
      } else if (diffInHours < 24) {
        return `${diffInHours}時間前`;
      } else if (diffInHours < 48) {
        return '1日前';
      } else {
        return date.toLocaleDateString('ja-JP', {
          month: 'short',
          day: 'numeric',
        });
      }
    } catch {
      return '';
    }
  };

  const handleNewsClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`bg-[var(--color-surface)] rounded-2xl p-6 shadow-lg dark:bg-[var(--color-surface-2)] dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] relative overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
          関連ニュース (Latest News)
        </h3>
        <Newspaper className="w-5 h-5 text-[var(--color-lp-mint)]" />
      </div>

      {/* モザイク効果を適用したコンテンツ */}
      <div className="relative min-h-[200px]">
        {/* ぼかしとモザイク効果を適用したコンテンツ */}
        <div className="blur-sm opacity-60 pointer-events-none select-none">
          {newsItems.length === 0 ? (
            <div className="text-center py-8">
              <Newspaper className="w-12 h-12 text-[var(--color-gray-300)] mx-auto mb-3" />
              <p className="text-sm text-[var(--color-gray-400)]">
                関連ニュースが見つかりませんでした
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {newsItems.slice(0, 3).map((news, index) => (
                <div key={news.id} className="group">
                  <div className="flex items-start space-x-3 p-3 rounded-xl bg-[var(--color-surface-alt)] dark:bg-[var(--color-surface-3)]">
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-[var(--color-gray-300)] dark:bg-[var(--color-gray-600)]"></div>
                    <div className="flex-1 min-w-0">
                      <div className="h-4 bg-[var(--color-gray-300)] dark:bg-[var(--color-gray-600)] rounded mb-2"></div>
                      <div className="h-3 bg-[var(--color-gray-200)] dark:bg-[var(--color-gray-700)] rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-[var(--color-gray-200)] dark:bg-[var(--color-gray-700)] rounded w-1/2"></div>
                    </div>
                  </div>
                  {index < 2 && (
                    <div className="border-t border-[var(--color-surface-alt)] dark:border-[var(--color-surface-3)] mt-4" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* オーバーレイメッセージ */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-[var(--color-surface)]/90 dark:bg-[var(--color-surface-2)]/90 backdrop-blur-sm rounded-xl p-6 border border-[var(--color-gray-200)] dark:border-[var(--color-surface-3)] shadow-lg max-w-xs">
            <Newspaper className="w-8 h-8 text-[var(--color-lp-mint)] mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-2">
              関連ニュース機能
            </h4>
            <p className="text-xs text-[var(--color-gray-600)] dark:text-[var(--color-text-muted)] mb-4">
              ユーザーからのニーズがあれば開発します
            </p>
            <div className="text-xs text-[var(--color-gray-500)] dark:text-[var(--color-text-muted)]">
              フィードバックをお待ちしています
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
