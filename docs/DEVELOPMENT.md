# 開発ドキュメント - 富の位置可視化アプリ

最終更新: 2024年5月27日

## 📊 現在の開発状況

### ✅ 実装済み機能

#### 1. 基本UI構造
- **ヘッダー**: アプリタイトル、Aboutボタン、言語切り替えボタン
- **入力フォーム**: 年収・総資産の入力フィールド
- **結果表示**: 日本・世界での位置表示（モックデータ）
- **レスポンシブデザイン**: Tailwind CSSによるモバイル対応

#### 2. バイリンガル対応
- **実装方式**: React Context APIを使用
- **対応言語**: 日本語・英語
- **切り替えUI**: ヘッダー右上のトグルボタン
- **ファイル構成**:
  ```
  src/contexts/LanguageContext.jsx  # 言語管理とテキストデータ
  src/components/LanguageToggle.jsx # 切り替えボタンコンポーネント
  ```

#### 3. 技術基盤
- **フレームワーク**: React (Vite)
- **スタイリング**: Tailwind CSS
- **アイコン**: lucide-react
- **数値フォーマット**: numeral（インストール済み、未使用）
- **グラフ**: Chart.js（インストール済み、未使用）

### ❌ 未実装機能

#### 1. 計算ロジック（最優先）
- パレート分布・対数正規分布の実装
- 富裕度スコアの計算
- 順位・占有率の算出

#### 2. データ管理
- 統計データの定数化
- フェルミ推定パラメータの設定

#### 3. ビジュアライゼーション
- Chart.jsを使った分布グラフ
- 位置の視覚的表示

#### 4. UX改善
- 数値のカンマ区切り表示（numeralライブラリ活用）
- 入力値のバリデーション強化
- ローディング状態の表示

#### 5. About機能
- 計算方法の説明モーダル
- データソースの明示

## 🎯 今後のアクション（優先順位順）

### Phase 1: 計算ロジック実装（3-4日）

#### 1.1 データ定数の作成
**ファイル**: `src/data/constants.js`

```javascript
export const JAPAN_DATA = {
  population: 125800000,
  households: 53000000,
  giniCoefficient: 0.38,
  medianIncome: 4300000,
  meanIncome: 5500000,
  top1PercentThreshold: 15000000,
  top1PercentWealthShare: 0.20,
  // パレート分布パラメータ
  paretoAlpha: 1.5,
  paretoXm: 10000000,
  // 対数正規分布パラメータ  
  logNormalMu: 15.2,
  logNormalSigma: 0.8
};

export const WORLD_DATA = {
  population: 8000000000,
  giniCoefficient: 0.63,
  medianWealth: 8654, // USD
  top1PercentWealthShare: 0.47,
  // 地域別調整係数
  regionMultipliers: {
    japan: 1.0,
    northAmerica: 1.2,
    europe: 1.1,
    asia: 0.8
  }
};
```

#### 1.2 分布計算の実装
**ファイル**: `src/utils/distributions.js`

```javascript
// パレート分布のCDF（累積分布関数）
export function paretoCDF(x, alpha, xm) {
  if (x < xm) return 0;
  return 1 - Math.pow(xm / x, alpha);
}

// 対数正規分布のCDF
export function logNormalCDF(x, mu, sigma) {
  // 標準正規分布のCDFを使用
  const z = (Math.log(x) - mu) / sigma;
  return normalCDF(z);
}

// 混合分布での順位計算
export function calculatePercentile(wealthScore, threshold) {
  if (wealthScore > threshold) {
    // パレート分布を使用
    return paretoCDF(wealthScore, JAPAN_DATA.paretoAlpha, threshold);
  } else {
    // 対数正規分布を使用
    return logNormalCDF(wealthScore, JAPAN_DATA.logNormalMu, JAPAN_DATA.logNormalSigma);
  }
}
```

#### 1.3 計算ロジックの統合
**ファイル**: `src/utils/calculations.js`

```javascript
import { calculatePercentile } from './distributions';
import { JAPAN_DATA, WORLD_DATA } from '../data/constants';

export function calculateWealthPosition(annualIncome, totalAssets) {
  // 富裕度スコアの計算（年収の10年分 + 総資産）
  const wealthScore = (annualIncome * 10) + totalAssets;

  // 日本での位置
  const japanPercentile = calculatePercentile(wealthScore, JAPAN_DATA.top1PercentThreshold);
  const japanWealthShare = calculateWealthShare(japanPercentile, JAPAN_DATA);

  // 世界での位置（購買力平価調整）
  const worldWealthScore = wealthScore / 100; // JPY to USD簡易変換
  const worldPercentile = calculateWorldPercentile(worldWealthScore);
  const worldWealthShare = calculateWealthShare(worldPercentile, WORLD_DATA);

  return {
    japan: {
      percentile: (1 - japanPercentile) * 100, // 上位％に変換
      wealthShare: japanWealthShare
    },
    world: {
      percentile: (1 - worldPercentile) * 100,
      wealthShare: worldWealthShare
    }
  };
}
```

### Phase 2: ビジュアライゼーション（2-3日）

#### 2.1 分布グラフコンポーネント
**ファイル**: `src/components/DistributionChart.jsx`

- Chart.jsを使用した分布曲線の描画
- 自分の位置をマーカーで表示
- 日本/世界の切り替え可能

#### 2.2 結果表示の改善
**ファイル**: `src/components/ResultDisplay.jsx`（新規作成）

- 現在のインライン実装を独立コンポーネント化
- アニメーション強化
- より視覚的なインパクトのある表示

### Phase 3: UX/UI改善（2日）

#### 3.1 入力フォームの改善
- numeralを使った自動カンマ区切り
- リアルタイムバリデーション
- ツールチップによる説明追加

#### 3.2 Aboutモーダル実装
**ファイル**: `src/components/AboutModal.jsx`

- 計算方法の詳細説明
- データソースの明記
- 制限事項の説明

### Phase 4: 品質向上（1-2日）

#### 4.1 エラーハンドリング
- 異常値の検出と対応
- エラーメッセージの表示

#### 4.2 パフォーマンス最適化
- 計算処理の最適化
- メモ化の活用

#### 4.3 テスト
- 計算ロジックのユニットテスト
- 各種ブラウザでの動作確認

## 🔧 技術的決定事項

### 状態管理
- **現在**: useState（ローカルステート）
- **将来**: 複雑化した場合はuseReducerまたはZustandを検討

### データ取得
- **現在**: ハードコードされた定数
- **将来**: APIからの動的取得を検討（四半期更新）

### スタイリング
- **決定**: Tailwind CSSで統一
- **理由**: 高速開発、一貫性、レスポンシブ対応の容易さ

### 計算精度
- **方針**: 「統計的推定」であることを明記
- **誤差**: ±5%程度を想定

## 📁 ファイル構造（計画）

```
src/
├── components/
│   ├── InputForm.jsx         # 既存を分離
│   ├── ResultDisplay.jsx     # 新規作成
│   ├── DistributionChart.jsx # 新規作成
│   ├── AboutModal.jsx        # 新規作成
│   └── LanguageToggle.jsx    # 実装済み
├── contexts/
│   └── LanguageContext.jsx   # 実装済み
├── utils/
│   ├── calculations.js       # 新規作成
│   ├── distributions.js      # 新規作成
│   └── formatters.js         # 新規作成
├── data/
│   ├── constants.js          # 新規作成
│   └── translations.js       # LanguageContextから分離検討
├── App.jsx                   # リファクタリング予定
├── index.jsx
└── index.css
```

## 🐛 既知の問題

1. **言語切り替え時の地域名**
   - 結果表示の「日本」「世界」がハードコード
   - 翻訳オブジェクトに追加が必要

2. **入力値の扱い**
   - カンマ区切りの数値が正しくパースされない可能性
   - 数値以外の入力への対応不足

3. **モバイル表示**
   - 結果表示部分が少し窮屈
   - グラフ追加時のレイアウト調整が必要

## 💡 改善アイデア（バックログ）

1. **年齢別分析**
   - 年齢を入力に追加
   - 同年代での位置も表示

2. **地域別分析**
   - 都道府県選択
   - 地域別の順位表示

3. **推移グラフ**
   - 将来予測機能
   - 過去からの推移表示

4. **SNSシェア機能**
   - 結果画像の生成
   - Twitter/Facebook共有

5. **PWA化**
   - オフライン対応
   - インストール可能

## 📝 開発メモ

### 2024年5月27日
- プロジェクト開始
- 基本UI実装完了
- バイリンガル対応実装
- 計算ロジックは未実装（モックデータ使用中）

### 次回作業予定
1. `src/data/constants.js`の作成
2. `src/utils/distributions.js`の実装
3. 実際の計算ロジックの組み込み

---

**注意**: このドキュメントは開発者間の情報共有用です。最新の状態を反映するよう、実装時に更新してください。