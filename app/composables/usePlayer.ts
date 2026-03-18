export function usePlayer() {
  const chips = useState('playerChips', () => 1000)
  const winStreak = useState('winStreak', () => 0)
  const totalWon = useState('totalWon', () => 0)
  const handsPlayed = useState('handsPlayed', () => 0)

  // Backward-compat alias used by useItems.ts
  const points = chips

  const addChips = (amount: number) => {
    chips.value += amount
    totalWon.value += amount
  }

  const subtractChips = (amount: number) => {
    chips.value -= amount
  }

  const resetStreak = () => {
    winStreak.value = 0
  }

  const incrementStreak = () => {
    winStreak.value++
  }

  // Legacy alias
  const addPoints = addChips

  return {
    chips,
    points,
    winStreak,
    totalWon,
    handsPlayed,
    addChips,
    subtractChips,
    resetStreak,
    incrementStreak,
    addPoints,
  }
}
