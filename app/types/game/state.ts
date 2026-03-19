import type { Card, EvaluatedHand } from './card'
import type { GamePhase, BettingState } from './betting'

export type RoundWinner = 'PLAYER' | 'AI' | 'TIE'

export interface BonusResult {
  basePot: number
  streakMultiplier: number
  handMultiplier: number
  finalPayout: number
  bonusChips: number
  messages: string[]
}

export interface GameState {
  phase: GamePhase
  deck: Card[]
  communityCards: Card[]
  playerHoleCards: Card[]
  aiHoleCards: Card[]
  betting: BettingState
  playerEvaluation: EvaluatedHand | null
  aiEvaluation: EvaluatedHand | null
  winner: RoundWinner | null
  bonusResult: BonusResult | null
  roundNumber: number
  message: string
  isPlayerTurn: boolean
  pendingAIAction: boolean
}
