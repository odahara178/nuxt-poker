// ── Pre-flop Scoring ─────────────────────────────────────────────
export const PREFLOP_DEFAULT_SCORE = 30   // カードなし時のフォールバック
export const PREFLOP_BASE_SCORE = 25
export const PAIR_BONUS = 20
export const PAIR_RANK_MULTIPLIER = 2
export const HIGH_RANK_MULTIPLIER = 1.5
export const SUITED_BONUS = 8
export const CONNECTOR_GAP1_BONUS = 5
export const CONNECTOR_GAP2_BONUS = 3
export const MAX_SCORE = 100

// ── Post-flop Scoring ────────────────────────────────────────────
export const RANK_INDEX_MULTIPLIER = 11

// ── Random Variance ──────────────────────────────────────────────
export const BLUFF_PROB = 0.08          // ブラフ発動確率
export const BLUFF_SCORE_BOOST = 35     // ブラフ時のスコア上昇量
export const HERO_FOLD_PROB = 0.15      // ヒーローフォールド発動確率（累積）
export const HERO_FOLD_REDUCTION = 35   // ヒーローフォールド時のスコア低下量

// ── Decision Thresholds ──────────────────────────────────────────
export const STRONG_HAND_THRESHOLD = 75   // レイズ/コール判断の下限
export const MEDIUM_HAND_THRESHOLD = 40   // コール判断の下限
export const WEAK_HAND_THRESHOLD = 20     // チェック判断の下限
export const FOLD_COST_RATIO = 0.3        // コールコストがチップのこの割合を超えたらフォールド
