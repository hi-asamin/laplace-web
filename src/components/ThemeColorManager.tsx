'use client';

import { useEffect } from 'react';

export default function ThemeColorManager() {
  useEffect(() => {
    const updateThemeColor = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const themeColor = isDark ? '#0f172a' : '#ffffff';

      // 既存のtheme-colorメタタグを更新
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute('content', themeColor);
    };

    // 初回実行
    updateThemeColor();

    // ダークモード変更を監視
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateThemeColor);

    return () => {
      mediaQuery.removeEventListener('change', updateThemeColor);
    };
  }, []);

  return null;
}
