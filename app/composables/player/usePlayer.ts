export function usePlayer() {
  const chips = useState('playerChips', () => STARTING_CHIPS)
  const score = useState('playerScore', () => 0)
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

  const addScore = (amount: number) => {
    score.value += amount
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
    score,
    points,
    winStreak,
    totalWon,
    handsPlayed,
    addChips,
    subtractChips,
    addScore,
    resetStreak,
    incrementStreak,
    addPoints,
  }
}
