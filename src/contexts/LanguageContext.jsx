import React, { createContext, useContext, useState } from 'react';

// 翻訳データ
const translations = {
  ja: {
    header: {
      title: '富の位置可視化ツール',
      about: 'このツールについて'
    },
    main: {
      headline: 'あなたの経済的立ち位置を知る',
      subtitle: '年収と資産を入力するだけで、日本と世界での位置がわかります',
      income: '年収（円）',
      assets: '総資産（円）',
      incomePlaceholder: '例: 5,000,000',
      assetsPlaceholder: '例: 10,000,000',
      calculate: '位置を計算する',
      incomeHint: '税引き前の年間総収入を入力してください',
      assetsHint: '預貯金、有価証券、不動産等の時価総額を入力してください'
    },
    results: {
      title: '計算結果',
      japanPosition: '日本での位置',
      worldPosition: '世界での位置',
      topPercent: '上位 {percent}%',
      wealthShare: '{region}の総資産の {share}% を保有'
    },
    disclaimer: {
      privacy: '入力されたデータは計算のみに使用され、保存されることはありません。',
      accuracy: '計算結果は統計的推定に基づくもので、実際の順位とは異なる場合があります。'
    }
  },
  en: {
    header: {
      title: 'Wealth Position Visualizer',
      about: 'About this tool'
    },
    main: {
      headline: 'Discover Your Economic Position',
      subtitle: 'Simply enter your income and assets to see your position in Japan and the world',
      income: 'Annual Income (JPY)',
      assets: 'Total Assets (JPY)',
      incomePlaceholder: 'e.g., 5,000,000',
      assetsPlaceholder: 'e.g., 10,000,000',
      calculate: 'Calculate Position',
      incomeHint: 'Enter your pre-tax annual income',
      assetsHint: 'Enter total value of savings, securities, real estate, etc.'
    },
    results: {
      title: 'Results',
      japanPosition: 'Position in Japan',
      worldPosition: 'Position in the World',
      topPercent: 'Top {percent}%',
      wealthShare: 'Owns {share}% of {region}\'s total wealth'
    },
    disclaimer: {
      privacy: 'Your data is used only for calculations and is not stored.',
      accuracy: 'Results are based on statistical estimates and may differ from actual rankings.'
    }
  }
};

// Context作成
const LanguageContext = createContext();

// Provider コンポーネント
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ja');

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ja' ? 'en' : 'ja');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// カスタムフック
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};