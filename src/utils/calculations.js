// calculations.js
/**
 * 富の位置計算メイン関数
 */

import {
  calculatePercentileWithMixedDistribution,
  calculateWealthShare,
  calculateWorldPercentile
} from './distributions';

import {
  JAPAN_DATA,
  WORLD_DATA,
  EXCHANGE_RATES,
  WEALTH_SCORE_WEIGHTS,
  DISTRIBUTION_THRESHOLDS
} from '../data/constants';

/**
 * 富裕度スコアを計算
 * @param {number} annualIncome - 年収（円）
 * @param {number} totalAssets - 総資産（円）
 * @returns {number} 富裕度スコア（円）
 */
export function calculateWealthScore(annualIncome, totalAssets) {
  // 年収の10年分 + 総資産 という計算式
  // WEALTH_SCORE_WEIGHTS.ANNUAL_INCOME_YEARS で年数を調整可能
  const incomeComponent = annualIncome * WEALTH_SCORE_WEIGHTS.ANNUAL_INCOME_YEARS;
  const assetComponent = totalAssets * WEALTH_SCORE_WEIGHTS.ASSET_WEIGHT;

  return incomeComponent + assetComponent;
}

/**
 * メイン計算関数
 * @param {number} annualIncome - 年収（円）
 * @param {number} totalAssets - 総資産（円）
 * @returns {Object} 計算結果
 */
export function calculateWealthPosition(annualIncome, totalAssets) {
  // 入力値のバリデーション
  const validatedIncome = Math.max(0, annualIncome || 0);
  const validatedAssets = Math.max(0, totalAssets || 0);

  // 富裕度スコアの計算
  const wealthScore = calculateWealthScore(validatedIncome, validatedAssets);

  // 日本での位置を計算
  const japanPercentile = calculatePercentileWithMixedDistribution(wealthScore, {
    threshold: DISTRIBUTION_THRESHOLDS.japan.wealthScoreThreshold,
    paretoAlpha: JAPAN_DATA.paretoAlpha,
    paretoXm: JAPAN_DATA.paretoXm,
    logNormalMu: JAPAN_DATA.logNormalMu,
    logNormalSigma: JAPAN_DATA.logNormalSigma,
    mixingProportion: 0.1 // 上位10%
  });

  const japanWealthShare = calculateWealthShare(japanPercentile, JAPAN_DATA);

  // 世界での位置を計算（USD換算）
  const wealthScoreUSD = wealthScore / EXCHANGE_RATES.USD_TO_JPY;
  const worldPercentile = calculateWorldPercentile(wealthScoreUSD, WORLD_DATA, 'japan');
  const worldWealthShare = calculateWealthShare(worldPercentile, WORLD_DATA);

  // 結果を返す（上位％表示のため、1から引く）
  return {
    japan: {
      percentile: (1 - japanPercentile) * 100, // 上位何％
      wealthShare: japanWealthShare,
      wealthScore: wealthScore, // デバッグ用
      estimatedRank: Math.round((1 - japanPercentile) * JAPAN_DATA.population)
    },
    world: {
      percentile: (1 - worldPercentile) * 100, // 上位何％
      wealthShare: worldWealthShare,
      wealthScoreUSD: wealthScoreUSD, // デバッグ用
      estimatedRank: Math.round((1 - worldPercentile) * WORLD_DATA.population)
    },
    metadata: {
      exchangeRate: EXCHANGE_RATES.USD_TO_JPY,
      calculationMethod: 'mixed_distribution',
      dataVersion: '2024.05'
    }
  };
}

/**
 * 数値をパースする（カンマ区切り対応）
 * @param {string} value - 入力値
 * @returns {number} パースされた数値
 */
export function parseNumberInput(value) {
  if (typeof value === 'number') return value;
  if (!value || typeof value !== 'string') return 0;

  // カンマと全角数字を処理
  const normalized = value
    .replace(/,/g, '') // カンマを除去
    .replace(/０/g, '0')
    .replace(/１/g, '1')
    .replace(/２/g, '2')
    .replace(/３/g, '3')
    .replace(/４/g, '4')
    .replace(/５/g, '5')
    .replace(/６/g, '6')
    .replace(/７/g, '7')
    .replace(/８/g, '8')
    .replace(/９/g, '9');

  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * 結果の妥当性をチェック
 * @param {Object} results - 計算結果
 * @returns {boolean} 妥当性
 */
export function validateResults(results) {
  // 基本的なチェック
  if (!results || !results.japan || !results.world) return false;

  // パーセンタイルは0-100の範囲
  if (results.japan.percentile < 0 || results.japan.percentile > 100) return false;
  if (results.world.percentile < 0 || results.world.percentile > 100) return false;

  // 富の占有率は0-1の範囲
  if (results.japan.wealthShare < 0 || results.japan.wealthShare > 1) return false;
  if (results.world.wealthShare < 0 || results.world.wealthShare > 1) return false;

  // 日本での順位 <= 世界での順位（通常）
  // ただし、購買力調整により逆転する可能性もある

  return true;
}