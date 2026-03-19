// ── Chips & Blinds ───────────────────────────────────────────────
export const STARTING_CHIPS = 1000
export const SMALL_BLIND = 10
export const BIG_BLIND = 20
export const RAISE_AMOUNT = 40

// ── Action Delays (ms) ──────────────────────────────────────────
export const AI_ACTION_DELAY_MS = 800
export const PLAYER_ACTION_DELAY_MS = 250  // ボタンアニメーション完了を待つ
export const PHASE_REVEAL_DELAY_MS = 700   // 新カードを確認する間
export const SHOWDOWN_RESULT_DELAY_MS = 1000

// ── Bonus Multipliers ────────────────────────────────────────────
/** 連勝ボーナス：min 以上の連勝で multiplier 倍 */
export const STREAK_MULTIPLIERS = [
  { min: 4, multiplier: 2.5 },
  { min: 3, multiplier: 2.0 },
  { min: 2, multiplier: 1.5 },
  { min: 1, multiplier: 1.2 },
] as const

/** 役ごとの獲得チップ倍率（rankIndex に対応） */
export const HAND_MULTIPLIERS = [1.0, 1.0, 1.1, 1.2, 1.5, 2.0, 3.0, 5.0, 8.0, 10.0] as const

// ── Shop Items ───────────────────────────────────────────────────
export const ITEM_IDS = {
  EXTRA_CHIPS: 'extra-chips',
} as const

export const EXTRA_CHIPS_COST = 50
export const EXTRA_CHIPS_GRANT = 100

// ── Game Messages ────────────────────────────────────────────────
export const MESSAGES = {
  IDLE: 'ゲームを開始してください',
  PREFLOP_ACTION: 'プリフロップ：アクション選択',
  FLOP_OPEN: 'フロップ：3枚オープン',
  TURN_OPEN: 'ターン：4枚目オープン',
  RIVER_LAST: 'リバー：ラストカード',
  PLAYER_FOLD: 'あなたはフォールドしました',
  AI_FOLD: 'AIがフォールドしました',
  AI_CHECK: 'AIはチェックしました',
  AI_CALL: 'AIはコールしました',
  PLAYER_WIN: 'あなたの勝ち！',
  AI_WIN: 'AIの勝ち...',
  TIE: '引き分け',
} as const

// ── Phase Labels (UI Badge) ──────────────────────────────────────
export const PHASE_LABELS: Record<string, string> = {
  IDLE: '',
  DEALING: '',
  PREFLOP: 'プリフロップ',
  FLOP: 'フロップ',
  TURN: 'ターン',
  RIVER: 'リバー',
  SHOWDOWN: 'ショーダウン',
  RESULT: 'ショーダウン',
  GAME_OVER: '',
}
