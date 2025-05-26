// constants.js
/**
 * 統計データ定数
 * 注：これらの値は概算値であり、実際の統計データに基づいて調整が必要
 */

// 為替レート設定
export const EXCHANGE_RATES = {
  USD_TO_JPY: 150, // 1 USD = 150 JPY
  // 将来的に他の通貨も追加可能
};

// 富裕度スコア計算の重み付け
export const WEALTH_SCORE_WEIGHTS = {
  ANNUAL_INCOME_YEARS: 10, // 年収の何年分を考慮するか
  ASSET_WEIGHT: 1, // 資産の重み（将来的に調整可能）
};

// 日本の統計データ
export const JAPAN_DATA = {
  // 人口統計
  population: 125800000, // 約1.26億人
  households: 53000000, // 約5300万世帯

  // 所得分布パラメータ
  giniCoefficient: 0.38, // ジニ係数
  medianIncome: 4300000, // 中央値年収（約430万円）
  meanIncome: 5500000, // 平均年収（約550万円）

  // 富裕層の閾値
  top10PercentThreshold: 8000000, // 上位10%の年収閾値（約800万円）
  top5PercentThreshold: 10000000, // 上位5%の年収閾値（約1000万円）
  top1PercentThreshold: 15000000, // 上位1%の年収閾値（約1500万円）

  // 資産分布
  medianAssets: 15000000, // 中央値資産（約1500万円）
  meanAssets: 25000000, // 平均資産（約2500万円）
  top1PercentWealthShare: 0.20, // 上位1%が保有する富の割合（20%）
  top10PercentWealthShare: 0.50, // 上位10%が保有する富の割合（50%）

  // パレート分布パラメータ（富裕層向け）
  paretoAlpha: 1.5, // 形状パラメータ
  paretoXm: 50000000, // 最小値パラメータ（5000万円）

  // 対数正規分布パラメータ（中間層向け）
  logNormalMu: 15.5, // 位置パラメータ
  logNormalSigma: 0.8, // 尺度パラメータ

  // 総資産額（推定）
  totalWealth: 1800000000000000, // 約1800兆円
};

// 世界の統計データ
export const WORLD_DATA = {
  // 人口統計
  population: 8000000000, // 約80億人

  // 富の分布
  giniCoefficient: 0.82, // 世界のジニ係数（より不平等）
  medianWealth: 8654, // 中央値資産（USD）
  meanWealth: 87489, // 平均資産（USD）

  // 富裕層データ
  top10PercentThreshold: 138000, // 上位10%の資産閾値（USD）
  top1PercentThreshold: 1000000, // 上位1%の資産閾値（USD）
  top0_1PercentThreshold: 10000000, // 上位0.1%の資産閾値（USD）

  // 富の集中度
  top1PercentWealthShare: 0.47, // 上位1%が保有する富の割合（47%）
  top10PercentWealthShare: 0.85, // 上位10%が保有する富の割合（85%）

  // パレート分布パラメータ（世界の富裕層向け）
  paretoAlpha: 1.3, // より極端な不平等
  paretoXm: 100000, // 最小値パラメータ（10万USD）

  // 対数正規分布パラメータ（世界の中間層向け）
  logNormalMu: 9.5, // 位置パラメータ
  logNormalSigma: 1.2, // より大きな分散

  // 総資産額（推定）
  totalWealth: 500000000000000, // 約500兆USD

  // 地域別調整係数（購買力平価を考慮）
  regionMultipliers: {
    japan: 0.85, // 日本の購買力調整
    northAmerica: 1.0, // 基準
    europe: 0.95,
    asia: 0.7,
    africa: 0.5,
    southAmerica: 0.6,
    oceania: 0.9,
  },
};

// 分布の閾値（どこからパレート分布を使うか）
export const DISTRIBUTION_THRESHOLDS = {
  japan: {
    // 富裕度スコアがこの値を超えたらパレート分布を使用
    wealthScoreThreshold: 100000000, // 1億円
    percentileThreshold: 0.9, // 上位10%
  },
  world: {
    // USD換算でのスコア閾値
    wealthScoreThreshold: 1000000, // 100万USD
    percentileThreshold: 0.9, // 上位10%
  },
};