// src/App.jsx の更新例
import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageToggle from './components/LanguageToggle';

function AppContent() {
  const [income, setIncome] = useState('');
  const [assets, setAssets] = useState('');
  const [results, setResults] = useState(null);
  const { t } = useLanguage();

  const handleCalculate = (e) => {
    e.preventDefault();
    // 仮の計算結果（後で実装を追加）
    const mockResults = {
      japan: {
        percentile: 15.3,
        wealthShare: 0.0012
      },
      world: {
        percentile: 1.2,
        wealthShare: 0.00001
      }
    };
    setResults(mockResults);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-display font-bold text-gray-900">
                {t('header.title')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-sm text-gray-600 hover:text-gray-900 underline">
                {t('header.about')}
              </button>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('main.headline')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('main.subtitle')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('main.income')}
              </label>
              <input
                type="text"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder={t('main.incomePlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('main.incomeHint')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('main.assets')}
              </label>
              <input
                type="text"
                value={assets}
                onChange={(e) => setAssets(e.target.value)}
                placeholder={t('main.assetsPlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('main.assetsHint')}
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              {t('main.calculate')}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 leading-relaxed">
              ※ {t('disclaimer.privacy')}<br/>
              ※ {t('disclaimer.accuracy')}
            </p>
          </div>
        </div>

        {/* 結果表示 */}
        {results && (
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('results.title')}</h3>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-medium text-gray-700 mb-2">{t('results.japanPosition')}</h4>
                <p className="text-2xl font-bold text-primary-600">
                  {t('results.topPercent').replace('{percent}', results.japan.percentile)}
                </p>
                <p className="text-sm text-gray-600">
                  {t('results.wealthShare')
                    .replace('{region}', '日本')
                    .replace('{share}', (results.japan.wealthShare * 100).toFixed(4))}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">{t('results.worldPosition')}</h4>
                <p className="text-2xl font-bold text-primary-600">
                  {t('results.topPercent').replace('{percent}', results.world.percentile)}
                </p>
                <p className="text-sm text-gray-600">
                  {t('results.wealthShare')
                    .replace('{region}', '世界')
                    .replace('{share}', (results.world.wealthShare * 100).toFixed(6))}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;