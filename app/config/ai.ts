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
export const POSTFLOP_BASE_SCORE = 20  // Post-flopの最低ベーススコア（ハイカードでも即フォールドしない）
export const RANK_INDEX_MULTIPLIER = 11
// 結果スコア目安: ハイカード=20, ワンペア=31, ツーペア=42, スリカ=53,
//               ストレート=64, フラッシュ=75, フルハウス=86, フォーカード=97

// ── Random Variance ──────────────────────────────────────────────
export const BLUFF_PROB = 0.15          // ブラフ発動確率（8%→15%）
export const BLUFF_SCORE_BOOST = 45     // ブラフ時のスコア上昇量
export const HERO_FOLD_PROB = 0.08      // ヒーローフォールド発動確率（15%→8%）
export const HERO_FOLD_REDUCTION = 25   // ヒーローフォールド時のスコア低下量

// ── Decision Thresholds ──────────────────────────────────────────
export const STRONG_HAND_THRESHOLD = 74  // フラッシュ以上でレイズ
export const MEDIUM_HAND_THRESHOLD = 30  // ワンペア以上でコール（40→30）
export const WEAK_HAND_THRESHOLD = 18    // ハイカードはチェック優先（20→18）
export const FOLD_COST_RATIO = 0.4       // コールコストがチップのこの割合を超えたらフォールド（0.3→0.4）
export const WEAK_FOLD_COST_RATIO = 0.12 // ハイカードでも少額ならコール
