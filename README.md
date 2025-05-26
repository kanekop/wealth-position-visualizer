# 富の位置可視化アプリ（Wealth Position Visualizer）

## 🎯 プロジェクト概要

「有史以来最大の貧富の差」について語る人々の多くが、実は世界的に見れば富裕層に属しているという無意識の事実を数値化し、可視化するWebアプリケーションです。

### 問題意識
- 貧富の差について議論する際の「立ち位置」の無自覚さ
- 自分の経済的位置を客観的に把握する機会の不足
- グローバルな視点での富の偏在に対する認識不足

### ミッション
誰もが簡単に自分の経済的立ち位置を確認でき、社会的な気づきを促すプラットフォームを提供する

## 🚀 主要機能

### コア機能
1. **収入・資産入力**
   - シンプルな入力フォーム
   - 年収と総資産の2項目のみ

2. **日本国内での位置表示**
   - 上位何％に位置するか
   - 日本の総資産の何％を占めるか

3. **世界での位置表示**
   - 世界での順位（上位何％）
   - 世界の総資産の何％を占めるか

4. **ビジュアライゼーション**
   - 分布グラフでの位置表示
   - インパクトのある数値表現

### 追加予定機能
- SNSシェア機能
- 経年変化の追跡
- 地域別の詳細分析

## 🛠 技術スタック

### フロントエンド
- **React** (Vite) - 高速な開発環境
- **Tailwind CSS** - レスポンシブデザイン
- **Chart.js** or **D3.js** - データビジュアライゼーション

### バックエンド
- **Node.js** (Express) または **Python** (FastAPI)
- **PostgreSQL** - Replit DB
- **Redis** - キャッシュ層（オプション）

### インフラ
- **Replit** - ホスティング環境
- **GitHub** - ソースコード管理

## 📊 データモデリング

### 採用手法：パレート・対数正規混合分布モデル

#### 理論的背景
- **パレート分布**：富裕層（上位20%）の資産分布を表現
- **対数正規分布**：中間層の収入分布を表現
- 両分布を組み合わせることで、現実の富の分布を高精度で近似

### データソース

#### 日本データ
```yaml
primary_sources:
  - 国税庁「民間給与実態統計調査」
  - 総務省「全国消費実態調査」
  - 日本銀行「資金循環統計」

key_metrics:
  - ジニ係数: 0.38
  - 上位1%の資産保有率: 約20%
  - 中央値年収: 約430万円
```

#### 世界データ
```yaml
primary_sources:
  - World Bank "Global Database on Household Income"
  - Credit Suisse/UBS "Global Wealth Report"
  - IMF Economic Data

key_metrics:
  - 世界の上位1%の資産保有率: 約47%
  - 購買力平価（PPP）調整済みデータ使用
```

### 計算アルゴリズム

```python
def calculate_wealth_position(annual_income, total_assets):
    """
    個人の富の位置を計算
    
    Parameters:
    - annual_income: 年収（円）
    - total_assets: 総資産（円）
    
    Returns:
    - japan_percentile: 日本での上位％
    - japan_wealth_share: 日本の富の占有率
    - world_percentile: 世界での上位％
    - world_wealth_share: 世界の富の占有率
    """
    
    # 1. 統合富裕度スコアの計算
    wealth_score = calculate_wealth_score(annual_income, total_assets)
    
    # 2. 分布モデルによる順位計算
    if wealth_score > PARETO_THRESHOLD:
        position = pareto_distribution.cdf(wealth_score)
    else:
        position = lognormal_distribution.cdf(wealth_score)
    
    # 3. 富の占有率計算
    wealth_share = calculate_wealth_share(position)
    
    return position, wealth_share
```

### 推定の透明性
- 全ての計算式を公開
- 使用データソースの明記
- 推定誤差の範囲を表示
- 定期的なデータ更新（四半期ごと）

## 📅 開発スケジュール

### Phase 1: MVP開発（Week 1）
- [x] プロジェクト設計
- [ ] 環境構築（Replit）
- [ ] 基本UI実装
- [ ] 日本国内の順位計算機能

### Phase 2: 機能拡張（Week 2）
- [ ] 世界順位計算機能
- [ ] データビジュアライゼーション
- [ ] レスポンシブデザイン対応

### Phase 3: 品質向上（Week 3）
- [ ] データ精度の向上
- [ ] パフォーマンス最適化
- [ ] ユーザビリティテスト

### Phase 4: リリース準備（Week 4）
- [ ] セキュリティ対策
- [ ] ドキュメント整備
- [ ] マーケティング準備

## 🎨 UI/UXデザイン方針

### デザイン原則
1. **シンプル**: 2つの数値入力のみ
2. **即座**: リアルタイムで結果表示
3. **インパクト**: 視覚的に訴求力のある表現
4. **モバイルファースト**: スマホでの利用を優先

### ユーザーフロー
```
トップページ → 数値入力 → 即座に結果表示 → シェア/詳細確認
```

## 🚦 今後の展開

### 短期目標（3ヶ月）
- ユーザー数10,000人達成
- メディア掲載3件以上
- データ精度の継続的改善

### 中期目標（1年）
- 多言語対応（英語、中国語）
- 企業向けAPI提供
- 教育機関での活用

### 長期ビジョン
- グローバルな富の可視化プラットフォーム
- 政策提言への活用
- 社会的インパクトの創出

## 🔧 セットアップ方法

```bash
# リポジトリのクローン
git clone https://github.com/[username]/wealth-position-visualizer.git

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集

# 開発サーバーの起動
npm run dev
```

## 📝 環境変数

```env
# データベース接続
DATABASE_URL=postgresql://...

# API設定
API_PORT=3000
NODE_ENV=development

# 外部API（将来的に使用）
WORLD_BANK_API_KEY=...
```

## 🤝 コントリビューション

このプロジェクトへの貢献を歓迎します！

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 👥 開発チーム

- プロジェクトリード: [Your Name]
- 開発パートナー: Claude (Anthropic)

## 📞 お問い合わせ

- Email: [your-email@example.com]
- Twitter: [@your-twitter]
- Issues: [GitHub Issues](https://github.com/[username]/wealth-position-visualizer/issues)

## 🙏 謝辞

- データ提供元の各機関
- オープンソースコミュニティ
- 初期テスターの皆様

---

**このアプリは、社会的な気づきと対話を促進することを目的としています。**
**Together, we can visualize and understand global wealth inequality.**