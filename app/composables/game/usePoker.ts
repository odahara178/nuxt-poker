import type { Suit, Rank, HandRank, Card, EvaluatedHand } from '~/types/game/card'

export type { Suit, Rank, HandRank, Card, EvaluatedHand }

const SUITS: Suit[] = ['♠', '♥', '♦', '♣']
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

const RANK_ORDER: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14,
}

const RANK_NAMES: Record<number, string> = {
  2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9',
  10: '10', 11: 'J', 12: 'Q', 13: 'K', 14: 'A',
}

function buildDetail(handRank: HandRank, tiebreakers: number[]): string {
  const r = (n: number) => RANK_NAMES[n] ?? String(n)
  switch (handRank) {
    case 'HIGH_CARD': return `${r(tiebreakers[0]!)}ハイ`
    case 'ONE_PAIR': return `${r(tiebreakers[0]!)}のペア`
    case 'TWO_PAIR': return `${r(tiebreakers[0]!)}と${r(tiebreakers[1]!)}のツーペア`
    case 'THREE_OF_A_KIND': return `${r(tiebreakers[0]!)}のスリーカード`
    case 'STRAIGHT': return `${r(tiebreakers[0]!)}ハイ`
    case 'FLUSH': return `${r(tiebreakers[0]!)}ハイ`
    case 'FULL_HOUSE': return `${r(tiebreakers[0]!)}のフルハウス`
    case 'FOUR_OF_A_KIND': return `${r(tiebreakers[0]!)}のフォーカード`
    case 'STRAIGHT_FLUSH': return `${r(tiebreakers[0]!)}ハイ`
    case 'ROYAL_FLUSH': return ''
  }
}

const HAND_LABELS: Record<HandRank, string> = {
  HIGH_CARD: 'ハイカード',
  ONE_PAIR: 'ワンペア',
  TWO_PAIR: 'ツーペア',
  THREE_OF_A_KIND: 'スリーカード',
  STRAIGHT: 'ストレート',
  FLUSH: 'フラッシュ',
  FULL_HOUSE: 'フルハウス',
  FOUR_OF_A_KIND: 'フォーカード',
  STRAIGHT_FLUSH: 'ストレートフラッシュ',
  ROYAL_FLUSH: 'ロイヤルフラッシュ',
}

const HAND_RANK_INDEX: Record<HandRank, number> = {
  HIGH_CARD: 0,
  ONE_PAIR: 1,
  TWO_PAIR: 2,
  THREE_OF_A_KIND: 3,
  STRAIGHT: 4,
  FLUSH: 5,
  FULL_HOUSE: 6,
  FOUR_OF_A_KIND: 7,
  STRAIGHT_FLUSH: 8,
  ROYAL_FLUSH: 9,
}

export function createDeck(): Card[] {
  return SUITS.flatMap(suit =>
    RANKS.map(rank => ({
      suit,
      rank,
      id: `${rank}${suit}`,
      faceUp: true,
    }))
  )
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const swapIndex = Math.floor(Math.random() * (i + 1))
    // noUncheckedIndexedAccess: i/swapIndex は常に範囲内なので ! で確定
    const tmp = shuffled[i]!
    shuffled[i] = shuffled[swapIndex]!
    shuffled[swapIndex] = tmp
  }
  return shuffled
}

export function dealCards(deck: Card[], count: number): { cards: Card[]; remaining: Card[] } {
  return {
    cards: deck.slice(0, count),
    remaining: deck.slice(count),
  }
}

function getCombinations(cards: Card[], k: number): Card[][] {
  if (k === 0) return [[]]
  if (cards.length < k) return []
  const [first, ...rest] = cards
  if (first === undefined) return []
  const withFirst = getCombinations(rest, k - 1).map(combo => [first, ...combo])
  return [...withFirst, ...getCombinations(rest, k)]
}

function evaluateFiveCards(cards: Card[]): EvaluatedHand {
  const rankVals = cards.map(card => RANK_ORDER[card.rank]).sort((a, b) => b - a)
  const suitList = cards.map(card => card.suit)

  const isFlush = suitList.every(suit => suit === suitList[0])
  const uniqueRanks = [...new Set(rankVals)].sort((a, b) => b - a)
  // length===5 を確認済みのため ! で確定
  const isNormalStraight = uniqueRanks.length === 5 && uniqueRanks[0]! - uniqueRanks[4]! === 4
  // A-2-3-4-5 wheel: unique sorted = [14,5,4,3,2]
  const isWheel =
    uniqueRanks.length === 5 &&
    uniqueRanks[0]! === 14 &&
    uniqueRanks[1]! === 5 &&
    uniqueRanks[2]! === 4 &&
    uniqueRanks[3]! === 3 &&
    uniqueRanks[4]! === 2
  const isStraight = isNormalStraight || isWheel

  const rankCounts: Record<number, number> = {}
  for (const rv of rankVals) {
    rankCounts[rv] = (rankCounts[rv] || 0) + 1
  }
  const countGroups = Object.entries(rankCounts)
    .map(([rank, count]) => ({ rank: Number(rank), count }))
    .sort((a, b) => b.count - a.count || b.rank - a.rank)
  const counts = countGroups.map(group => group.count)

  let handRank: HandRank
  if (isFlush && isStraight) {
    handRank = !isWheel && rankVals[0]! === 14 ? 'ROYAL_FLUSH' : 'STRAIGHT_FLUSH'
  } else if (counts[0] === 4) {
    handRank = 'FOUR_OF_A_KIND'
  } else if (counts[0] === 3 && counts[1] === 2) {
    handRank = 'FULL_HOUSE'
  } else if (isFlush) {
    handRank = 'FLUSH'
  } else if (isStraight) {
    handRank = 'STRAIGHT'
  } else if (counts[0] === 3) {
    handRank = 'THREE_OF_A_KIND'
  } else if (counts[0] === 2 && counts[1] === 2) {
    handRank = 'TWO_PAIR'
  } else if (counts[0] === 2) {
    handRank = 'ONE_PAIR'
  } else {
    handRank = 'HIGH_CARD'
  }

  const tiebreakers: number[] = isStraight
    ? [isWheel ? 5 : rankVals[0]!]
    : countGroups.map(group => group.rank)

  return {
    rank: handRank,
    rankIndex: HAND_RANK_INDEX[handRank],
    bestFive: cards,
    tiebreakers,
    label: HAND_LABELS[handRank],
    detail: buildDetail(handRank, tiebreakers),
  }
}

export function evaluateBestHand(cards: Card[]): EvaluatedHand {
  if (cards.length < 5) throw new Error('Need at least 5 cards')
  const combinations = getCombinations(cards, 5)
  let best: EvaluatedHand | null = null
  for (const combo of combinations) {
    const evaluated = evaluateFiveCards(combo)
    if (!best || compareHands(evaluated, best) > 0) {
      best = evaluated
    }
  }
  return best!
}

export function compareHands(a: EvaluatedHand, b: EvaluatedHand): number {
  if (a.rankIndex !== b.rankIndex) return a.rankIndex - b.rankIndex
  for (let i = 0; i < Math.min(a.tiebreakers.length, b.tiebreakers.length); i++) {
    const aTiebreaker = a.tiebreakers[i]!
    const bTiebreaker = b.tiebreakers[i]!
    if (aTiebreaker !== bTiebreaker) return aTiebreaker - bTiebreaker
  }
  return 0
}
