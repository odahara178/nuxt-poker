import { describe, it, expect, beforeEach } from 'vitest'
import { ref, type Ref } from 'vue'
import { usePlayer } from './usePlayer'

type GlobalWithStubs = typeof globalThis & {
  // テスト用スタブ: Nuxt の useState を ref で代替
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useState: (key: string, init: () => unknown) => Ref<any>
}

// Reset useState stub per test so each test gets fresh state
beforeEach(() => {
  ;(globalThis as GlobalWithStubs).useState = (_key: string, init: () => unknown) => ref(init())
})

describe('usePlayer', () => {
  it('initialises chips to 1000', () => {
    const { chips } = usePlayer()
    expect(chips.value).toBe(1000)
  })

  it('points is an alias for chips', () => {
    const { chips, points } = usePlayer()
    expect(chips.value).toBe(points.value)
    chips.value = 500
    expect(points.value).toBe(500)
  })

  it('addChips increases chips', () => {
    const { chips, addChips } = usePlayer()
    addChips(200)
    expect(chips.value).toBe(1200)
  })

  it('addChips also increases totalWon', () => {
    const { totalWon, addChips } = usePlayer()
    addChips(300)
    expect(totalWon.value).toBe(300)
    addChips(100)
    expect(totalWon.value).toBe(400)
  })

  it('subtractChips decreases chips', () => {
    const { chips, subtractChips } = usePlayer()
    subtractChips(150)
    expect(chips.value).toBe(850)
  })

  it('subtractChips does NOT affect totalWon', () => {
    const { totalWon, subtractChips } = usePlayer()
    subtractChips(100)
    expect(totalWon.value).toBe(0)
  })

  it('incrementStreak increases winStreak', () => {
    const { winStreak, incrementStreak } = usePlayer()
    incrementStreak()
    incrementStreak()
    expect(winStreak.value).toBe(2)
  })

  it('resetStreak sets winStreak to 0', () => {
    const { winStreak, incrementStreak, resetStreak } = usePlayer()
    incrementStreak()
    incrementStreak()
    resetStreak()
    expect(winStreak.value).toBe(0)
  })

  it('handsPlayed starts at 0', () => {
    const { handsPlayed } = usePlayer()
    expect(handsPlayed.value).toBe(0)
  })

  it('addPoints is alias for addChips', () => {
    const { chips, totalWon, addPoints } = usePlayer()
    addPoints(50)
    expect(chips.value).toBe(1050)
    expect(totalWon.value).toBe(50)
  })
})
