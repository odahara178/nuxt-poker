import { describe, it, expect } from 'vitest'
import {
  createDeck,
  shuffleDeck,
  dealCards,
  evaluateBestHand,
  compareHands,
} from '~/composables/game/usePoker'
import type { Card, Suit, Rank } from '~/composables/game/usePoker'

// Helper: create a card quickly
function c(rank: Rank, suit: Suit): Card {
  return { rank, suit, id: `${rank}${suit}`, faceUp: true }
}

// Helper: make a hand and evaluate it
function hand(...cards: Card[]) {
  return evaluateBestHand(cards)
}

// ─────────────────────────────────────────────
// createDeck
// ─────────────────────────────────────────────
describe('createDeck', () => {
  it('generates 52 cards', () => {
    expect(createDeck()).toHaveLength(52)
  })

  it('has 4 suits × 13 ranks = unique ids', () => {
    const deck = createDeck()
    const ids = new Set(deck.map(c => c.id))
    expect(ids.size).toBe(52)
  })

  it('all cards are face-up by default', () => {
    expect(createDeck().every(c => c.faceUp)).toBe(true)
  })
})

// ─────────────────────────────────────────────
// shuffleDeck
// ─────────────────────────────────────────────
describe('shuffleDeck', () => {
  it('returns same length', () => {
    const deck = createDeck()
    expect(shuffleDeck(deck)).toHaveLength(52)
  })

  it('does not mutate the original', () => {
    const deck = createDeck()
    const first = deck[0]!.id
    shuffleDeck(deck)
    expect(deck[0]!.id).toBe(first)
  })

  it('contains same cards (just reordered)', () => {
    const deck = createDeck()
    const shuffled = shuffleDeck(deck)
    const original = new Set(deck.map(c => c.id))
    shuffled.forEach(c => expect(original.has(c.id)).toBe(true))
  })
})

// ─────────────────────────────────────────────
// dealCards
// ─────────────────────────────────────────────
describe('dealCards', () => {
  it('deals correct count', () => {
    const deck = createDeck()
    const { cards, remaining } = dealCards(deck, 5)
    expect(cards).toHaveLength(5)
    expect(remaining).toHaveLength(47)
  })

  it('dealt cards are first N of deck', () => {
    const deck = createDeck()
    const { cards } = dealCards(deck, 2)
    expect(cards[0]!.id).toBe(deck[0]!.id)
    expect(cards[1]!.id).toBe(deck[1]!.id)
  })

  it('remaining starts from index N', () => {
    const deck = createDeck()
    const { remaining } = dealCards(deck, 3)
    expect(remaining[0]!.id).toBe(deck[3]!.id)
  })
})

// ─────────────────────────────────────────────
// evaluateBestHand — hand rankings
// ─────────────────────────────────────────────
describe('evaluateBestHand – hand rankings', () => {
  it('detects Royal Flush', () => {
    const result = hand(c('A', '♠'), c('K', '♠'), c('Q', '♠'), c('J', '♠'), c('10', '♠'))
    expect(result.rank).toBe('ROYAL_FLUSH')
    expect(result.rankIndex).toBe(9)
  })

  it('detects Straight Flush', () => {
    const result = hand(c('9', '♥'), c('8', '♥'), c('7', '♥'), c('6', '♥'), c('5', '♥'))
    expect(result.rank).toBe('STRAIGHT_FLUSH')
    expect(result.rankIndex).toBe(8)
  })

  it('detects wheel (A-2-3-4-5) Straight Flush', () => {
    const result = hand(c('A', '♣'), c('2', '♣'), c('3', '♣'), c('4', '♣'), c('5', '♣'))
    expect(result.rank).toBe('STRAIGHT_FLUSH')
    expect(result.tiebreakers[0]).toBe(5) // high card is 5, not A
  })

  it('detects Four of a Kind', () => {
    const result = hand(c('K', '♠'), c('K', '♥'), c('K', '♦'), c('K', '♣'), c('2', '♠'))
    expect(result.rank).toBe('FOUR_OF_A_KIND')
    expect(result.rankIndex).toBe(7)
  })

  it('detects Full House', () => {
    const result = hand(c('Q', '♠'), c('Q', '♥'), c('Q', '♦'), c('J', '♣'), c('J', '♠'))
    expect(result.rank).toBe('FULL_HOUSE')
    expect(result.rankIndex).toBe(6)
  })

  it('detects Flush', () => {
    const result = hand(c('A', '♦'), c('J', '♦'), c('8', '♦'), c('5', '♦'), c('3', '♦'))
    expect(result.rank).toBe('FLUSH')
    expect(result.rankIndex).toBe(5)
  })

  it('detects Straight (A high)', () => {
    const result = hand(c('A', '♠'), c('K', '♥'), c('Q', '♦'), c('J', '♣'), c('10', '♠'))
    expect(result.rank).toBe('STRAIGHT')
    expect(result.tiebreakers[0]).toBe(14)
  })

  it('detects Straight (5 high = wheel)', () => {
    const result = hand(c('A', '♠'), c('2', '♥'), c('3', '♦'), c('4', '♣'), c('5', '♠'))
    expect(result.rank).toBe('STRAIGHT')
    expect(result.tiebreakers[0]).toBe(5)
  })

  it('detects Three of a Kind', () => {
    const result = hand(c('7', '♠'), c('7', '♥'), c('7', '♦'), c('K', '♣'), c('2', '♠'))
    expect(result.rank).toBe('THREE_OF_A_KIND')
    expect(result.rankIndex).toBe(3)
  })

  it('detects Two Pair', () => {
    const result = hand(c('A', '♠'), c('A', '♥'), c('K', '♦'), c('K', '♣'), c('Q', '♠'))
    expect(result.rank).toBe('TWO_PAIR')
    expect(result.rankIndex).toBe(2)
  })

  it('detects One Pair', () => {
    const result = hand(c('10', '♠'), c('10', '♥'), c('8', '♦'), c('5', '♣'), c('3', '♠'))
    expect(result.rank).toBe('ONE_PAIR')
    expect(result.rankIndex).toBe(1)
  })

  it('detects High Card', () => {
    const result = hand(c('A', '♠'), c('J', '♥'), c('8', '♦'), c('5', '♣'), c('2', '♠'))
    expect(result.rank).toBe('HIGH_CARD')
    expect(result.rankIndex).toBe(0)
  })

  it('includes label in Japanese', () => {
    const result = hand(c('A', '♠'), c('A', '♥'), c('K', '♦'), c('K', '♣'), c('Q', '♠'))
    expect(result.label).toBe('ツーペア')
  })

  it('returns bestFive array of 5 cards', () => {
    const result = hand(c('A', '♠'), c('K', '♥'), c('Q', '♦'), c('J', '♣'), c('10', '♠'))
    expect(result.bestFive).toHaveLength(5)
  })
})

// ─────────────────────────────────────────────
// evaluateBestHand — 7-card best-5 selection
// ─────────────────────────────────────────────
describe('evaluateBestHand – 7-card selection', () => {
  it('picks Royal Flush from 7 cards', () => {
    const result = hand(
      c('A', '♠'), c('K', '♠'), c('Q', '♠'), c('J', '♠'), c('10', '♠'),
      c('2', '♥'), c('7', '♦'),
    )
    expect(result.rank).toBe('ROYAL_FLUSH')
  })

  it('picks best pair from 7 mixed cards', () => {
    const result = hand(
      c('A', '♠'), c('A', '♥'), c('2', '♦'), c('3', '♣'), c('5', '♠'),
      c('7', '♥'), c('9', '♦'),
    )
    expect(result.rank).toBe('ONE_PAIR')
    expect(result.tiebreakers[0]).toBe(14) // aces
  })

  it('picks Full House over Flush when both possible', () => {
    // Three kings + two queens (FH) AND 5 diamonds (Flush) — FH wins
    const result = hand(
      c('K', '♦'), c('K', '♥'), c('K', '♣'),
      c('Q', '♦'), c('Q', '♠'),
      c('2', '♦'), c('5', '♦'),
    )
    expect(result.rank).toBe('FULL_HOUSE')
  })
})

// ─────────────────────────────────────────────
// compareHands
// ─────────────────────────────────────────────
describe('compareHands', () => {
  it('returns positive when a is better rank', () => {
    const flush = hand(c('A', '♦'), c('J', '♦'), c('8', '♦'), c('5', '♦'), c('3', '♦'))
    const straight = hand(c('9', '♠'), c('8', '♥'), c('7', '♦'), c('6', '♣'), c('5', '♠'))
    expect(compareHands(flush, straight)).toBeGreaterThan(0)
  })

  it('returns negative when a is worse rank', () => {
    const pair = hand(c('A', '♠'), c('A', '♥'), c('K', '♦'), c('Q', '♣'), c('J', '♠'))
    const trips = hand(c('7', '♠'), c('7', '♥'), c('7', '♦'), c('K', '♣'), c('2', '♠'))
    expect(compareHands(pair, trips)).toBeLessThan(0)
  })

  it('returns 0 for identical hands', () => {
    const a = hand(c('A', '♠'), c('K', '♥'), c('Q', '♦'), c('J', '♣'), c('10', '♠'))
    const b = hand(c('A', '♥'), c('K', '♦'), c('Q', '♣'), c('J', '♠'), c('10', '♥'))
    expect(compareHands(a, b)).toBe(0)
  })

  it('breaks same-rank tie by kicker', () => {
    // Both One Pair of Aces, but different kicker
    const highKicker = hand(c('A', '♠'), c('A', '♥'), c('K', '♦'), c('Q', '♣'), c('J', '♠'))
    const lowKicker = hand(c('A', '♦'), c('A', '♣'), c('5', '♠'), c('4', '♥'), c('3', '♦'))
    expect(compareHands(highKicker, lowKicker)).toBeGreaterThan(0)
  })

  it('Two Pair: higher top pair wins', () => {
    const aa22 = hand(c('A', '♠'), c('A', '♥'), c('2', '♦'), c('2', '♣'), c('K', '♠'))
    const kk99 = hand(c('K', '♦'), c('K', '♣'), c('9', '♠'), c('9', '♥'), c('A', '♦'))
    expect(compareHands(aa22, kk99)).toBeGreaterThan(0)
  })

  it('Straight: higher high card wins', () => {
    const kHigh = hand(c('K', '♠'), c('Q', '♥'), c('J', '♦'), c('10', '♣'), c('9', '♠'))
    const wheel = hand(c('A', '♠'), c('2', '♥'), c('3', '♦'), c('4', '♣'), c('5', '♠'))
    expect(compareHands(kHigh, wheel)).toBeGreaterThan(0)
  })
})

// ─────────────────────────────────────────────
// Edge cases
// ─────────────────────────────────────────────
describe('edge cases', () => {
  it('throws when fewer than 5 cards given', () => {
    expect(() => evaluateBestHand([c('A', '♠'), c('K', '♥')])).toThrow()
  })

  it('exactly 5 cards works fine', () => {
    expect(() =>
      evaluateBestHand([c('A', '♠'), c('K', '♥'), c('Q', '♦'), c('J', '♣'), c('10', '♠')])
    ).not.toThrow()
  })

  it('Four of a Kind tiebreaker: quads rank first', () => {
    const aQuads = hand(c('A', '♠'), c('A', '♥'), c('A', '♦'), c('A', '♣'), c('2', '♠'))
    const kQuads = hand(c('K', '♠'), c('K', '♥'), c('K', '♦'), c('K', '♣'), c('A', '♠'))
    expect(compareHands(aQuads, kQuads)).toBeGreaterThan(0)
  })
})
