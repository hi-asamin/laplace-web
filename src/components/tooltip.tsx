'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';

type TooltipProps = {
  children: ReactNode;
  content: string;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
};

export default function Tooltip({ children, content, title, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
  };

  const renderFormattedContent = () => {
    if (!content) return null;

    const paragraphs = content.split('\n\n');

    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, i) => {
          if (paragraph.startsWith('【') && paragraph.includes('】')) {
            const headingEnd = paragraph.indexOf('】') + 1;
            const heading = paragraph.substring(0, headingEnd);
            const restContent = paragraph.substring(headingEnd).trim();

            return (
              <div key={i} className="mt-3">
                <h4 className="text-sm font-semibold text-[var(--color-lp-mint)] dark:text-[var(--color-lp-mint)] mb-1">
                  {heading}
                </h4>
                <div className="text-sm">
                  {restContent.split('\n').map((line, j) => (
                    <div key={j} className={line.startsWith('•') ? 'pl-4 relative mb-1' : ''}>
                      {line.startsWith('•') ? (
                        <>
                          <span className="absolute left-0 top-0">•</span>
                          <span>{line.substring(1).trim()}</span>
                        </>
                      ) : (
                        line
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <p key={i} className="text-sm">
              {paragraph.split('\n').map((line, j) => (
                <span key={j} className="block">
                  {line}
                </span>
              ))}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative inline-flex items-center">
      <div className="cursor-pointer flex items-center">
        {children}
        <button
          onClick={handleToggle}
          className="ml-1 flex items-center justify-center"
          aria-label="用語の説明を表示"
        >
          <Info className="h-3.5 w-3.5 text-[var(--color-gray-400)] dark:text-[var(--color-text-muted)]" />
        </button>
      </div>

      {isVisible && (
        <>
          <div
            className="fixed inset-0 z-40 bg-gray-500/10 backdrop-blur-[1px]"
            onClick={handleClose}
            aria-hidden="true"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div
              className={`bg-white/95 dark:bg-[var(--color-surface-2)]/95 backdrop-blur-sm rounded-xl max-w-xs w-[90%] h-[400px] overflow-y-auto scrollbar-none pointer-events-auto 
                shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-[var(--color-surface-3)]
                ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} 
                transition-all duration-200 ease-out`}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '400px' }}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-[var(--color-surface-3)]">
                <h3 className="text-base font-medium text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)]">
                  {title || '用語説明'}
                </h3>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-full hover:bg-[var(--color-gray-400)] hover:bg-opacity-10 dark:hover:bg-[var(--color-surface-3)] transition-colors"
                  aria-label="閉じる"
                >
                  <X className="h-4 w-4 text-[var(--color-gray-700)] dark:text-[var(--color-text-secondary)]" />
                </button>
              </div>
              <div className="p-4 text-sm text-[var(--color-gray-700)] dark:text-[var(--color-text-secondary)] flex-1 overflow-y-auto">
                {renderFormattedContent()}
              </div>
              {/* AIコメント（モザイク/ロックUI） */}
              {/* <div className="px-4 pb-4 pt-2">
                <div className="flex items-center mb-1">
                  <span className="text-xs font-semibold text-[var(--color-primary)] mr-2">
                    【AIコメント】
                  </span>
                  <span className="text-xs text-[var(--color-gray-400)] bg-[var(--color-gray-200)] rounded px-2 py-0.5 ml-auto">
                    PRO限定
                  </span>
                </div>
                <div className="relative rounded-lg bg-[var(--color-surface-alt)] p-3 min-h-[48px] overflow-hidden select-none">
                  <div className="blur-sm opacity-60 pointer-events-none select-none">
                    ここにAIによる専門的な解説や投資アドバイスが表示されます（PRO会員限定）
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      className="text-xs font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] rounded-full px-4 py-1 shadow transition-colors border-none outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                      style={{ pointerEvents: 'auto' }}
                      onClick={() => alert('PRO会員プランのご案内ページへ遷移（仮）')}
                    >
                      PRO会員でAIコメントを解禁
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
