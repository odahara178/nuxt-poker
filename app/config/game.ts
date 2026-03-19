// ── Chips & Blinds ───────────────────────────────────────────────
export const STARTING_CHIPS = 1000

/** ラウンド毎のブラインドレベル（fromRound 以降に適用、降順で定義） */
export const BLIND_LEVELS = [
  { fromRound: 21, small: 150, big: 300, raise: 600 },
  { fromRound: 16, small: 75,  big: 150, raise: 300 },
  { fromRound: 11, small: 40,  big: 80,  raise: 160 },
  { fromRound: 6,  small: 20,  big: 40,  raise: 80  },
  { fromRound: 1,  small: 10,  big: 20,  raise: 40  },
] as const

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
