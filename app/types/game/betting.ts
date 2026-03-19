export type GamePhase =
  | 'IDLE'
  | 'DEALING'
  | 'PREFLOP'
  | 'FLOP'
  | 'TURN'
  | 'RIVER'
  | 'SHOWDOWN'
  | 'RESULT'
  | 'GAME_OVER'

export type BettingAction = 'FOLD' | 'CALL' | 'RAISE' | 'CHECK'

export interface BettingState {
  pot: number
  currentBet: number
  playerBet: number
  aiBet: number
  playerRaisedThisRound: boolean
  aiRaisedThisRound: boolean
}
