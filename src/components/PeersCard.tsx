'use client';

import { TrendingUp, TrendingDown, Users, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RelatedMarket } from '@/types/api';

interface PeersCardProps {
  peers: RelatedMarket[];
  industryName?: string;
  className?: string;
}

export default function PeersCard({ peers, industryName, className = '' }: PeersCardProps) {
  const router = useRouter();

  const handlePeerClick = (symbol: string) => {
    router.push(`/markets/${symbol}`);
  };

  return (
    <div
      className={`bg-[var(--color-surface)] rounded-2xl p-6 shadow-lg dark:bg-[var(--color-surface-2)] dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
            競合・関連銘柄 (Peers & Competitors)
          </h3>
          {industryName && (
            <p className="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-text-muted)] mt-1">
              {industryName}業界
            </p>
          )}
        </div>
        <Users className="w-5 h-5 text-[var(--color-lp-mint)]" />
      </div>

      {peers.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-[var(--color-gray-300)] mx-auto mb-3" />
          <p className="text-sm text-[var(--color-gray-400)]">関連銘柄が見つかりませんでした</p>
        </div>
      ) : (
        <div className="space-y-3">
          {peers.slice(0, 6).map((peer, index) => (
            <div
              key={peer.symbol}
              className="group cursor-pointer"
              onClick={() => handlePeerClick(peer.symbol)}
            >
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-surface-alt)] dark:hover:bg-[var(--color-surface-3)] transition-colors">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* ロゴ */}
                  <div className="flex-shrink-0">
                    {peer.logoUrl ? (
                      <Image
                        src={peer.logoUrl}
                        alt={`${peer.name} logo`}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-contain bg-white dark:bg-[var(--color-surface-3)] p-1"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[var(--color-surface-alt)] dark:bg-[var(--color-surface-3)] flex items-center justify-center">
                        <span className="text-xs font-medium text-[var(--color-gray-600)] dark:text-[var(--color-text-muted)]">
                          {peer.symbol.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 銘柄情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-lp-mint)] transition-colors">
                        {peer.name}
                      </h4>
                      <span className="text-xs text-[var(--color-gray-400)] flex-shrink-0">
                        {peer.symbol}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 価格情報 */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)]">
                      {peer.price}
                    </div>
                    <div
                      className={`flex items-center text-xs ${
                        !peer.changePercent.startsWith('-')
                          ? 'text-[var(--color-success)]'
                          : 'text-[var(--color-danger)]'
                      }`}
                    >
                      {!peer.changePercent.startsWith('-') ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      <span>{peer.changePercent}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--color-gray-400)] group-hover:text-[var(--color-lp-mint)] transition-colors" />
                </div>
              </div>

              {/* 区切り線（最後の要素以外） */}
              {index < Math.min(peers.length, 6) - 1 && (
                <div className="border-t border-[var(--color-surface-alt)] dark:border-[var(--color-surface-3)] mt-3" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* もっと見るボタン */}
      {peers.length > 6 && (
        <div className="mt-6 text-center">
          <button className="text-sm text-[var(--color-lp-mint)] hover:text-[var(--color-lp-mint)]/80 transition-colors font-medium">
            さらに関連銘柄を見る ({peers.length - 6}件)
          </button>
        </div>
      )}
    </div>
  );
}
