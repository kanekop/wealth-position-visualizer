import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

function App() {
  const [income, setIncome] = useState('');
  const [assets, setAssets] = useState('');
  const [results, setResults] = useState(null);

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
          <div className="flex items-center space-x-3">
            <Calculator className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-display font-bold text-gray-900">
              富の位置可視化ツール
            </h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            あなたの経済的立ち位置を知る
          </h2>
          <p className="text-lg text-gray-600">
            年収と資産を入力するだけで、日本と世界での位置がわかります
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                年収（円）
              </label>
              <input
                type="text"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="例: 5,000,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                総資産（円）
              </label>
              <input
                type="text"
                value={assets}
                onChange={(e) => setAssets(e.target.value)}
                placeholder="例: 10,000,000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              位置を計算する
            </button>
          </form>
        </div>

        {/* 結果表示 */}
        {results && (
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-4">計算結果</h3>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-medium text-gray-700 mb-2">日本での位置</h4>
                <p className="text-2xl font-bold text-primary-600">
                  上位 {results.japan.percentile}%
                </p>
                <p className="text-sm text-gray-600">
                  日本の総資産の {(results.japan.wealthShare * 100).toFixed(4)}% を保有
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">世界での位置</h4>
                <p className="text-2xl font-bold text-primary-600">
                  上位 {results.world.percentile}%
                </p>
                <p className="text-sm text-gray-600">
                  世界の総資産の {(results.world.wealthShare * 100).toFixed(6)}% を保有
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;