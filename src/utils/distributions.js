//distributions.js
/**
 * 統計分布計算関数
 */

/**
 * 標準正規分布の累積分布関数（CDF）
 * Box-Muller法による近似
 */
export function normalCDF(z) {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = z >= 0 ? 1 : -1;
  z = Math.abs(z) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * z);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

  return 0.5 * (1.0 + sign * y);
}

/**
 * パレート分布の累積分布関数（CDF）
 * 富裕層の資産分布を表現
 * @param {number} x - 評価する値
 * @param {number} alpha - 形状パラメータ（通常1.0-2.0）
 * @param {number} xm - 最小値パラメータ
 * @returns {number} 累積確率
 */
export function paretoCDF(x, alpha, xm) {
  if (x < xm) return 0;
  return 1 - Math.pow(xm / x, alpha);
}

/**
 * 対数正規分布の累積分布関数（CDF）
 * 中間層の所得分布を表現
 * @param {number} x - 評価する値
 * @param {number} mu - 位置パラメータ（対数の平均）
 * @param {number} sigma - 尺度パラメータ（対数の標準偏差）
 * @returns {number} 累積確率
 */
export function logNormalCDF(x, mu, sigma) {
  if (x <= 0) return 0;

  const z = (Math.log(x) - mu) / sigma;
  return normalCDF(z);
}

/**
 * 混合分布モデルでの順位計算
 * 閾値以下は対数正規分布、以上はパレート分布を使用
 * @param {number} wealthScore - 富裕度スコア
 * @param {Object} params - 分布パラメータ
 * @returns {number} 順位（0-1の範囲、1が最富裕層）
 */
export function calculatePercentileWithMixedDistribution(wealthScore, params) {
  const {
    threshold,
    paretoAlpha,
    paretoXm,
    logNormalMu,
    logNormalSigma,
    mixingProportion = 0.1 // 上位10%がパレート分布に従うと仮定
  } = params;

  if (wealthScore >= threshold) {
    // パレート分布領域
    const paretoPercentile = paretoCDF(wealthScore, paretoAlpha, paretoXm);
    // 全体での位置に変換（上位10%内での位置）
    return 1 - mixingProportion * (1 - paretoPercentile);
  } else {
    // 対数正規分布領域
    const logNormalPercentile = logNormalCDF(wealthScore, logNormalMu, logNormalSigma);
    // 下位90%内での位置に調整
    return logNormalPercentile * (1 - mixingProportion);
  }
}

/**
 * 富の占有率を計算
 * 順位から、その人が全体の富の何％を保有しているかを推定
 * @param {number} percentile - 順位（0-1）
 * @param {Object} wealthData - 富の分布データ
 * @returns {number} 富の占有率（0-1）
 */
export function calculateWealthShare(percentile, wealthData) {
  const {
    top1PercentWealthShare,
    top10PercentWealthShare,
    population
  } = wealthData;

  // 簡易的な推定：上位層ほど急激に富が集中
  if (percentile >= 0.99) {
    // 上位1%
    const positionInTop1 = (percentile - 0.99) / 0.01;
    // 上位1%の富を、さらにパレート則で分配
    return (top1PercentWealthShare / population) * Math.pow(positionInTop1, 0.5) * 100;
  } else if (percentile >= 0.9) {
    // 上位1-10%
    const positionInTop10 = (percentile - 0.9) / 0.09;
    const top10ExcludingTop1 = top10PercentWealthShare - top1PercentWealthShare;
    return (top10ExcludingTop1 / population) * positionInTop10 * 10;
  } else {
    // 下位90%
    const remainingWealth = 1 - top10PercentWealthShare;
    return (remainingWealth / population) * (percentile / 0.9);
  }
}

/**
 * 世界での順位を計算（地域調整あり）
 * @param {number} wealthScoreUSD - USD換算の富裕度スコア
 * @param {Object} worldData - 世界の統計データ
 * @param {string} region - 地域（'japan', 'northAmerica'等）
 * @returns {number} 世界での順位（0-1）
 */
export function calculateWorldPercentile(wealthScoreUSD, worldData, region = 'japan') {
  // 地域調整係数を適用
  const adjustedScore = wealthScoreUSD * (worldData.regionMultipliers[region] || 1.0);

  // 混合分布で計算
  return calculatePercentileWithMixedDistribution(adjustedScore, {
    threshold: worldData.top10PercentThreshold,
    paretoAlpha: worldData.paretoAlpha,
    paretoXm: worldData.paretoXm,
    logNormalMu: worldData.logNormalMu,
    logNormalSigma: worldData.logNormalSigma,
    mixingProportion: 0.1
  });
}