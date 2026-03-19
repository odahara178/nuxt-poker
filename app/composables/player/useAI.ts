import type { Card } from '~/types/game/card'
import type { GamePhase, BettingAction, BettingState } from '~/types/game/betting'
import { evaluateBestHand } from '~/composables/game/usePoker'

export type { GamePhase, BettingAction, BettingState }

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
  return Math.min(MAX_SCORE, POSTFLOP_BASE_SCORE + evaluated.rankIndex * RANK_INDEX_MULTIPLIER)
}

export function useAI() {
  function decideAction(
    phase: GamePhase,
    holeCards: Card[],
    communityCards: Card[],
    betting: BettingState,
    aiChips: number,
    raiseAmount: number,
  ): BettingAction {
    let score =
      phase === 'PREFLOP'
        ? getPreFlopScore(holeCards)
        : getPostFlopScore(holeCards, communityCards)

    // ブラフ / ヒーローフォールド（排他）
    const rand = Math.random()
    const isBluffing = rand < BLUFF_PROB
    const isHeroFolding = !isBluffing && rand < BLUFF_PROB + HERO_FOLD_PROB

    if (isBluffing) {
      score = Math.min(MAX_SCORE, score + BLUFF_SCORE_BOOST)
    } else if (isHeroFolding) {
      score = Math.max(0, score - HERO_FOLD_REDUCTION)
    }

    const callCost = betting.currentBet - betting.aiBet
    const canRaise = !betting.aiRaisedThisRound && aiChips >= callCost + raiseAmount

    if (score > STRONG_HAND_THRESHOLD) {
      // 強いハンド（ブラフ含む）: レイズ優先
      if (canRaise) return 'RAISE'
      if (callCost === 0) return 'CHECK'
      return 'CALL'
    } else if (score > MEDIUM_HAND_THRESHOLD) {
      // 中程度のハンド: 高額コールのみフォールド
      if (callCost > aiChips * FOLD_COST_RATIO) return 'FOLD'
      if (callCost === 0) return 'CHECK'
      return 'CALL'
    } else if (score > WEAK_HAND_THRESHOLD) {
      // 弱いハンド: 少額ならコール、高額はフォールド
      if (callCost === 0) return 'CHECK'
      if (callCost <= aiChips * WEAK_FOLD_COST_RATIO) return 'CALL'
      return 'FOLD'
    } else {
      // 非常に弱いハンド（ヒーローフォールド後など）
      if (callCost === 0) return 'CHECK'
      return 'FOLD'
    }
  }

  return { decideAction }
}
