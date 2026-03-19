import type { Card } from '../game/usePoker'
import { evaluateBestHand } from '../game/usePoker'
import {
  PREFLOP_DEFAULT_SCORE,
  PREFLOP_BASE_SCORE,
  PAIR_BONUS,
  PAIR_RANK_MULTIPLIER,
  HIGH_RANK_MULTIPLIER,
  SUITED_BONUS,
  CONNECTOR_GAP1_BONUS,
  CONNECTOR_GAP2_BONUS,
  MAX_SCORE,
  RANK_INDEX_MULTIPLIER,
  BLUFF_PROB,
  BLUFF_SCORE_BOOST,
  HERO_FOLD_PROB,
  HERO_FOLD_REDUCTION,
  STRONG_HAND_THRESHOLD,
  MEDIUM_HAND_THRESHOLD,
  WEAK_HAND_THRESHOLD,
  FOLD_COST_RATIO,
} from '~/config/ai'
import { RAISE_AMOUNT } from '~/config/game'

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
  const [c1, c2] = holeCards
  if (!c1 || !c2) return PREFLOP_DEFAULT_SCORE
  // RANK_ORDER は全 Rank を網羅しているため ! で確定
  const r1 = RANK_ORDER[c1.rank]!
  const r2 = RANK_ORDER[c2.rank]!
  const isPair = r1 === r2
  const isSuited = c1.suit === c2.suit
  const highRank = Math.max(r1, r2)
  const gap = Math.abs(r1 - r2)

  let score = PREFLOP_BASE_SCORE
  if (isPair) {
    score += PAIR_BONUS + r1 * PAIR_RANK_MULTIPLIER
  } else {
    score += (highRank - 2) * HIGH_RANK_MULTIPLIER
    if (isSuited) score += SUITED_BONUS
    if (gap === 1) score += CONNECTOR_GAP1_BONUS
    else if (gap === 2) score += CONNECTOR_GAP2_BONUS
  }
  return Math.min(MAX_SCORE, score)
}

function getPostFlopScore(holeCards: Card[], communityCards: Card[]): number {
  if (communityCards.length === 0) return getPreFlopScore(holeCards)
  const allCards = [...holeCards, ...communityCards]
  const evaluated = evaluateBestHand(allCards)
  return Math.min(MAX_SCORE, evaluated.rankIndex * RANK_INDEX_MULTIPLIER)
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

    // ランダム分散（ブラフ / ヒーローフォールド）
    const rand = Math.random()
    if (rand < BLUFF_PROB) {
      score = Math.min(MAX_SCORE, score + BLUFF_SCORE_BOOST)
    } else if (rand < HERO_FOLD_PROB) {
      score = Math.max(0, score - HERO_FOLD_REDUCTION)
    }

    const callCost = betting.currentBet - betting.aiBet
    const canRaise = !betting.aiRaisedThisRound && aiChips >= callCost + RAISE_AMOUNT

    if (score > STRONG_HAND_THRESHOLD) {
      if (canRaise) return 'RAISE'
      if (callCost === 0) return 'CHECK'
      return 'CALL'
    } else if (score > MEDIUM_HAND_THRESHOLD) {
      if (callCost > aiChips * FOLD_COST_RATIO) return 'FOLD'
      if (callCost === 0) return 'CHECK'
      return 'CALL'
    } else if (score > WEAK_HAND_THRESHOLD) {
      if (callCost === 0) return 'CHECK'
      return 'FOLD'
    } else {
      return 'FOLD'
    }
  }

  return { decideAction }
}
