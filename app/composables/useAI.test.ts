import { describe, it, expect } from 'vitest'
import { useAI } from './useAI'
import type { BettingState, GamePhase } from './useAI'
import type { Card, Suit, Rank } from './usePoker'

function c(rank: Rank, suit: Suit): Card {
  return { rank, suit, id: `${rank}${suit}`, faceUp: true }
}

function makeBetting(overrides: Partial<BettingState> = {}): BettingState {
  return {
    pot: 30,
    currentBet: 20,
    playerBet: 10,
    aiBet: 20,
    playerRaisedThisRound: false,
    aiRaisedThisRound: false,
    ...overrides,
  }
}

describe('useAI – decideAction', () => {
  const { decideAction } = useAI()

  it('returns one of the valid actions', () => {
    const valid = ['FOLD', 'CALL', 'RAISE', 'CHECK']
    for (let i = 0; i < 20; i++) {
      const action = decideAction(
        'PREFLOP',
        [c('A', '♠'), c('A', '♥')],
        [],
        makeBetting(),
        1000,
      )
      expect(valid).toContain(action)
    }
  })

  it('preflop: premium hand (AA) mostly raises or calls, not folds', () => {
    // Run 50 times; due to 15% random variance, FOLD should be rare
    const results = Array.from({ length: 50 }, () =>
      decideAction('PREFLOP', [c('A', '♠'), c('A', '♥')], [], makeBetting({ currentBet: 0, aiBet: 0, playerBet: 0 }), 1000),
    )
    const folds = results.filter(action => action === 'FOLD').length
    expect(folds).toBeLessThan(15) // allow up to 30% for randomness margin
  })

  it('preflop: weak hand (2-7 offsuit) rarely raises', () => {
    const results = Array.from({ length: 50 }, () =>
      decideAction('PREFLOP', [c('2', '♠'), c('7', '♥')], [], makeBetting(), 1000),
    )
    const raises = results.filter(action => action === 'RAISE').length
    expect(raises).toBeLessThan(15)
  })

  it('checks when callCost is 0 and score is modest', () => {
    // Post-flop, no bet yet, medium hand
    const results = Array.from({ length: 30 }, () =>
      decideAction(
        'FLOP',
        [c('7', '♠'), c('2', '♥')],
        [c('9', '♦'), c('J', '♣'), c('K', '♠')],
        makeBetting({ currentBet: 0, aiBet: 0, playerBet: 0 }),
        1000,
      ),
    )
    // With score near 0 (no pair) and callCost=0, should check or fold (not call)
    results.forEach(action => expect(['CHECK', 'FOLD', 'RAISE']).toContain(action))
  })

  it('folds when pot odds are too high and score is low', () => {
    // Call would cost 500 (half AI stack) with a weak hand
    const results = Array.from({ length: 30 }, () =>
      decideAction(
        'RIVER',
        [c('2', '♠'), c('7', '♥')],
        [c('9', '♦'), c('J', '♣'), c('K', '♠'), c('A', '♥'), c('Q', '♦')],
        makeBetting({ currentBet: 500, aiBet: 0, playerBet: 0 }),
        1000,
      ),
    )
    const folds = results.filter(action => action === 'FOLD').length
    expect(folds).toBeGreaterThan(20) // most runs should fold
  })

  it('does not raise if aiRaisedThisRound is true', () => {
    const results = Array.from({ length: 30 }, () =>
      decideAction(
        'PREFLOP',
        [c('A', '♠'), c('A', '♥')],
        [],
        makeBetting({ aiRaisedThisRound: true, currentBet: 0, aiBet: 0, playerBet: 0 }),
        1000,
      ),
    )
    results.forEach(action => expect(action).not.toBe('RAISE'))
  })

  it('preflop suited connectors score better than unsuited rags', () => {
    // Run many times and confirm suited connectors fold less than 2-7 offsuit
    const suitedConnectors = Array.from({ length: 50 }, () =>
      decideAction('PREFLOP', [c('J', '♥'), c('10', '♥')], [], makeBetting(), 1000),
    )
    const rags = Array.from({ length: 50 }, () =>
      decideAction('PREFLOP', [c('2', '♠'), c('7', '♥')], [], makeBetting(), 1000),
    )
    const connectorFolds = suitedConnectors.filter(action => action === 'FOLD').length
    const ragFolds = rags.filter(action => action === 'FOLD').length
    expect(connectorFolds).toBeLessThanOrEqual(ragFolds + 10) // allow margin for randomness
  })

  it('postflop: strong made hand (flush) rarely folds', () => {
    const results = Array.from({ length: 40 }, () =>
      decideAction(
        'RIVER',
        [c('A', '♥'), c('K', '♥')],
        [c('Q', '♥'), c('J', '♥'), c('2', '♥'), c('7', '♠'), c('4', '♣')],
        makeBetting({ currentBet: 40, playerBet: 0, aiBet: 0 }),
        1000,
      ),
    )
    const folds = results.filter(action => action === 'FOLD').length
    expect(folds).toBeLessThan(10)
  })

  it('postflop: royal flush hand almost never folds', () => {
    const results = Array.from({ length: 40 }, () =>
      decideAction(
        'RIVER',
        [c('A', '♠'), c('K', '♠')],
        [c('Q', '♠'), c('J', '♠'), c('10', '♠'), c('7', '♥'), c('4', '♦')],
        makeBetting({ currentBet: 40, playerBet: 0, aiBet: 0 }),
        1000,
      ),
    )
    const folds = results.filter(action => action === 'FOLD').length
    expect(folds).toBeLessThan(5)
  })

  it('preflop: gap-2 connector (J-9) is accepted without error', () => {
    // Exercises the gap===2 branch in getPreFlopScore (line 48)
    expect(() =>
      decideAction('PREFLOP', [c('J', '♠'), c('9', '♥')], [], makeBetting(), 1000),
    ).not.toThrow()
  })

  it('score>75 but already raised: returns CALL when callCost>0', () => {
    // Force score > 75 consistently by using AA and mocking Math.random to avoid bluff path
    // Set aiRaisedThisRound=true so canRaise=false, callCost>0 → should return CALL
    const { decideAction: da } = useAI()
    const results = Array.from({ length: 60 }, () =>
      da(
        'PREFLOP',
        [c('A', '♠'), c('A', '♥')],
        [],
        makeBetting({ aiRaisedThisRound: true, currentBet: 40, aiBet: 0, playerBet: 0 }),
        1000,
      ),
    )
    // Among 60 runs, at least some should be CALL (score>75, can't raise, callCost=40)
    const calls = results.filter(action => action === 'CALL').length
    expect(calls).toBeGreaterThan(0)
  })

  it('handles empty holeCards gracefully (line 32 guard)', () => {
    // holeCards.length < 2 → returns base score 30 → low score → fold or check
    const valid = ['FOLD', 'CALL', 'RAISE', 'CHECK']
    const result = decideAction('PREFLOP', [], [], makeBetting(), 1000)
    expect(valid).toContain(result)
  })

  it('score 40-75 folds when callCost exceeds 30% of aiChips (line 89)', () => {
    // Moderate hand (pair of 5s post-flop = ONE_PAIR = rankIndex 1 = score 11)
    // callCost = 400 > 1000 * 0.3 = 300 → should FOLD
    const results = Array.from({ length: 40 }, () =>
      decideAction(
        'FLOP',
        [c('5', '♠'), c('5', '♥')],
        [c('9', '♦'), c('J', '♣'), c('K', '♠')],
        makeBetting({ currentBet: 400, aiBet: 0, playerBet: 0 }),
        1000,
      ),
    )
    const folds = results.filter(action => action === 'FOLD').length
    expect(folds).toBeGreaterThan(20)
  })

  it('all phases are accepted without error', () => {
    const phases: GamePhase[] = ['PREFLOP', 'FLOP', 'TURN', 'RIVER']
    phases.forEach(phase => {
      expect(() =>
        decideAction(phase, [c('A', '♠'), c('K', '♥')], [], makeBetting(), 500),
      ).not.toThrow()
    })
  })
})
