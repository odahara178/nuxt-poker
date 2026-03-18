import type { Card } from './usePoker'
import { evaluateBestHand } from './usePoker'

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

const RANK_ORDER: Record<string, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14,
}

function getPreFlopScore(holeCards: Card[]): number {
  if (holeCards.length < 2) return 30
  const [c1, c2] = holeCards
  const r1 = RANK_ORDER[c1.rank]
  const r2 = RANK_ORDER[c2.rank]
  const isPair = r1 === r2
  const isSuited = c1.suit === c2.suit
  const highRank = Math.max(r1, r2)
  const gap = Math.abs(r1 - r2)

  let score = 25
  if (isPair) {
    score += 20 + r1 * 2
  } else {
    score += (highRank - 2) * 1.5
    if (isSuited) score += 8
    if (gap === 1) score += 5
    else if (gap === 2) score += 3
  }
  return Math.min(100, score)
}

function getPostFlopScore(holeCards: Card[], communityCards: Card[]): number {
  if (communityCards.length === 0) return getPreFlopScore(holeCards)
  const allCards = [...holeCards, ...communityCards]
  const evaluated = evaluateBestHand(allCards)
  return Math.min(100, evaluated.rankIndex * 11)
}

export function useAI() {
  function decideAction(
    phase: GamePhase,
    holeCards: Card[],
    communityCards: Card[],
    betting: BettingState,
    aiChips: number,
  ): BettingAction {
    let score =
      phase === 'PREFLOP'
        ? getPreFlopScore(holeCards)
        : getPostFlopScore(holeCards, communityCards)

    // 15% random variance (bluff / hero fold)
    const rand = Math.random()
    if (rand < 0.08) {
      score = Math.min(100, score + 35) // bluff
    } else if (rand < 0.15) {
      score = Math.max(0, score - 35) // hero fold
    }

    const callCost = betting.currentBet - betting.aiBet
    const canRaise = !betting.aiRaisedThisRound && aiChips >= callCost + 40

    if (score > 75) {
      if (canRaise) return 'RAISE'
      if (callCost === 0) return 'CHECK'
      return 'CALL'
    } else if (score > 40) {
      if (callCost > aiChips * 0.3) return 'FOLD'
      if (callCost === 0) return 'CHECK'
      return 'CALL'
    } else if (score > 20) {
      if (callCost === 0) return 'CHECK'
      return 'FOLD'
    } else {
      return 'FOLD'
    }
  }

  return { decideAction }
}
