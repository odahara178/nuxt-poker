import type { Card, EvaluatedHand } from './usePoker'
import { createDeck, shuffleDeck, dealCards, evaluateBestHand, compareHands } from './usePoker'
import type { GamePhase, BettingState } from './useAI'
import { useAI } from './useAI'
import { usePlayer } from './usePlayer'
import { useSound } from './useSound'


export type RoundWinner = 'PLAYER' | 'AI' | 'TIE'

const STARTING_AI_CHIPS = 1000
const SMALL_BLIND = 10
const BIG_BLIND = 20
const RAISE_AMOUNT = 40
const AI_ACTION_DELAY_MS = 800
const PLAYER_ACTION_DELAY_MS = 250  // ボタンアニメーション完了を待つ
const PHASE_REVEAL_DELAY_MS = 700   // 新カードを確認する間

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

function initialBetting(): BettingState {
  return {
    pot: 0,
    currentBet: 0,
    playerBet: 0,
    aiBet: 0,
    playerRaisedThisRound: false,
    aiRaisedThisRound: false,
  }
}

function initialGameState(): GameState {
  return {
    phase: 'IDLE',
    deck: [],
    communityCards: [],
    playerHoleCards: [],
    aiHoleCards: [],
    betting: initialBetting(),
    playerEvaluation: null,
    aiEvaluation: null,
    winner: null,
    bonusResult: null,
    roundNumber: 0,
    message: 'ゲームを開始してください',
    isPlayerTurn: false,
    pendingAIAction: false,
  }
}

function getStreakMultiplier(streak: number): number {
  if (streak >= 4) return 2.5
  if (streak >= 3) return 2.0
  if (streak >= 2) return 1.5
  if (streak >= 1) return 1.2
  return 1.0
}

function getHandMultiplier(rankIndex: number): number {
  const multipliers = [1.0, 1.0, 1.1, 1.2, 1.5, 2.0, 3.0, 5.0, 8.0, 10.0]
  return multipliers[rankIndex] ?? 1.0
}

export function useGame() {
  const { decideAction } = useAI()
  const { chips: playerChips, winStreak, totalWon, handsPlayed, addChips, resetStreak, incrementStreak } =
    usePlayer()
  const { playCardDeal } = useSound()

  const gameState = useState<GameState>('gameState', initialGameState)
  const aiChips = useState('aiChips', () => STARTING_AI_CHIPS)

  const canFold = computed(
    () => gameState.value.isPlayerTurn && !gameState.value.pendingAIAction,
  )
  const canCheck = computed(
    () =>
      canFold.value &&
      gameState.value.betting.currentBet === gameState.value.betting.playerBet,
  )
  const canCall = computed(
    () =>
      canFold.value &&
      gameState.value.betting.currentBet > gameState.value.betting.playerBet,
  )
  const canRaise = computed(
    () =>
      canFold.value &&
      !gameState.value.betting.playerRaisedThisRound &&
      playerChips.value >= gameState.value.betting.currentBet - gameState.value.betting.playerBet + RAISE_AMOUNT,
  )

  const visibleCommunityCards = computed<Card[]>(() => {
    const phase = gameState.value.phase
    const cards = gameState.value.communityCards
    if (phase === 'FLOP') return cards.slice(0, 3)
    if (phase === 'TURN') return cards.slice(0, 4)
    if (phase === 'RIVER' || phase === 'SHOWDOWN' || phase === 'RESULT') return cards.slice(0, 5)
    return []
  })

  function startNewRound() {
    if (playerChips.value <= 0 || aiChips.value <= 0) {
      gameState.value.phase = 'GAME_OVER'
      return
    }

    const deck = shuffleDeck(createDeck())
    const { cards: playerCards, remaining: d1 } = dealCards(deck, 2)
    const { cards: aiCards, remaining: d2 } = dealCards(d1, 2)
    const { cards: community, remaining: finalDeck } = dealCards(d2, 5)

    const aiHoleCards = aiCards.map(c => ({ ...c, faceUp: false }))

    // Post blinds
    playerChips.value -= SMALL_BLIND
    aiChips.value -= BIG_BLIND

    gameState.value = {
      phase: 'PREFLOP',
      deck: finalDeck,
      communityCards: community,
      playerHoleCards: playerCards,
      aiHoleCards,
      betting: {
        pot: SMALL_BLIND + BIG_BLIND,
        currentBet: BIG_BLIND,
        playerBet: SMALL_BLIND,
        aiBet: BIG_BLIND,
        playerRaisedThisRound: false,
        aiRaisedThisRound: false,
      },
      playerEvaluation: null,
      aiEvaluation: null,
      winner: null,
      bonusResult: null,
      roundNumber: gameState.value.roundNumber + 1,
      message: 'プリフロップ：アクション選択',
      isPlayerTurn: true,
      pendingAIAction: false,
    }

    handsPlayed.value++
    playCardDeal(2)
  }

  function playerFold() {
    if (!canFold.value) return
    gameState.value.isPlayerTurn = false // 二重押し防止
    gameState.value.message = 'あなたはフォールドしました'
    setTimeout(() => resolveShowdown('AI'), PLAYER_ACTION_DELAY_MS)
  }

  function playerCall() {
    if (!canCall.value) return
    gameState.value.isPlayerTurn = false // 二重押し防止
    setTimeout(() => {
      const callCost = gameState.value.betting.currentBet - gameState.value.betting.playerBet
      playerChips.value -= callCost
      gameState.value.betting.playerBet += callCost
      gameState.value.betting.pot += callCost
      if (gameState.value.betting.aiRaisedThisRound) {
        advancePhase()
      } else {
        triggerAIAction()
      }
    }, PLAYER_ACTION_DELAY_MS)
  }

  function playerRaise() {
    if (!canRaise.value) return
    gameState.value.isPlayerTurn = false // 二重押し防止
    setTimeout(() => {
      const callCost = gameState.value.betting.currentBet - gameState.value.betting.playerBet
      const totalCost = callCost + RAISE_AMOUNT
      playerChips.value -= totalCost
      gameState.value.betting.playerBet += totalCost
      gameState.value.betting.currentBet = gameState.value.betting.playerBet
      gameState.value.betting.pot += totalCost
      gameState.value.betting.playerRaisedThisRound = true
      triggerAIAction()
    }, PLAYER_ACTION_DELAY_MS)
  }

  function playerCheck() {
    if (!canCheck.value) return
    gameState.value.isPlayerTurn = false // 二重押し防止
    setTimeout(() => triggerAIAction(), PLAYER_ACTION_DELAY_MS)
  }

  function triggerAIAction() {
    gameState.value.pendingAIAction = true
    setTimeout(() => {
      executeAIAction()
      gameState.value.pendingAIAction = false
    }, AI_ACTION_DELAY_MS)
  }

  function executeAIAction() {
    const betting = gameState.value.betting
    const callCost = betting.currentBet - betting.aiBet

    const action = decideAction(
      gameState.value.phase,
      gameState.value.aiHoleCards,
      visibleCommunityCards.value,
      betting,
      aiChips.value,
    )

    if (action === 'FOLD') {
      gameState.value.message = 'AIがフォールドしました'
      resolveShowdown('PLAYER')
      return
    }

    if (action === 'CHECK' || (action === 'CALL' && callCost === 0)) {
      gameState.value.message = 'AIはチェックしました'
      advancePhase()
      return
    }

    if (action === 'CALL') {
      aiChips.value -= callCost
      betting.aiBet += callCost
      betting.pot += callCost
      gameState.value.message = 'AIはコールしました'
      advancePhase()
      return
    }

    if (action === 'RAISE') {
      const totalCost = callCost + RAISE_AMOUNT
      aiChips.value -= totalCost
      betting.aiBet += totalCost
      betting.currentBet = betting.aiBet
      betting.pot += totalCost
      betting.aiRaisedThisRound = true
      betting.playerRaisedThisRound = true // cap: prevent re-raise
      gameState.value.message = `AIはレイズしました（+${RAISE_AMOUNT}）`
      gameState.value.isPlayerTurn = true
    }
  }

  function advancePhase() {
    // Reset per-round betting tracking
    const betting = gameState.value.betting
    betting.playerBet = 0
    betting.aiBet = 0
    betting.currentBet = 0
    betting.playerRaisedThisRound = false
    betting.aiRaisedThisRound = false

    const phase = gameState.value.phase
    if (phase === 'PREFLOP') {
      gameState.value.phase = 'FLOP'
      gameState.value.message = 'フロップ：3枚オープン'
      playCardDeal(3)
    } else if (phase === 'FLOP') {
      gameState.value.phase = 'TURN'
      gameState.value.message = 'ターン：4枚目オープン'
      playCardDeal(1)
    } else if (phase === 'TURN') {
      gameState.value.phase = 'RIVER'
      gameState.value.message = 'リバー：ラストカード'
      playCardDeal(1)
    } else if (phase === 'RIVER') {
      doShowdown()
      return
    }

    // 新しいカードを確認する間を設けてから操作UIを表示
    setTimeout(() => {
      gameState.value.isPlayerTurn = true
    }, PHASE_REVEAL_DELAY_MS)
  }

  function doShowdown() {
    // Reveal AI cards
    gameState.value.aiHoleCards = gameState.value.aiHoleCards.map(c => ({ ...c, faceUp: true }))

    const community = gameState.value.communityCards
    const playerEval = evaluateBestHand([...gameState.value.playerHoleCards, ...community])
    const aiEval = evaluateBestHand([...gameState.value.aiHoleCards, ...community])

    gameState.value.playerEvaluation = playerEval
    gameState.value.aiEvaluation = aiEval

    const cmp = compareHands(playerEval, aiEval)
    const winner: RoundWinner = cmp > 0 ? 'PLAYER' : cmp < 0 ? 'AI' : 'TIE'
    resolveShowdown(winner)
  }

  function resolveShowdown(winner: RoundWinner) {
    gameState.value.phase = 'SHOWDOWN'
    gameState.value.winner = winner
    gameState.value.isPlayerTurn = false

    // For fold-wins, reveal AI cards too if player won
    if (winner === 'PLAYER') {
      gameState.value.aiHoleCards = gameState.value.aiHoleCards.map(c => ({ ...c, faceUp: true }))
    }

    setTimeout(() => applyResult(winner), 1000)
  }

  function applyResult(winner: RoundWinner) {
    const pot = gameState.value.betting.pot

    if (winner === 'PLAYER') {
      const streakMult = getStreakMultiplier(winStreak.value)
      const handMult = gameState.value.playerEvaluation
        ? getHandMultiplier(gameState.value.playerEvaluation.rankIndex)
        : 1.0
      const finalPayout = Math.floor(pot * streakMult * handMult)
      const bonusChips = finalPayout - pot
      const messages: string[] = []
      if (streakMult > 1) messages.push(`${winStreak.value}連勝ボーナス ×${streakMult}`)
      if (handMult > 1) messages.push(`${gameState.value.playerEvaluation?.label}ボーナス ×${handMult}`)

      gameState.value.bonusResult = {
        basePot: pot,
        streakMultiplier: streakMult,
        handMultiplier: handMult,
        finalPayout,
        bonusChips,
        messages,
      }

      addChips(finalPayout)
      incrementStreak()
      gameState.value.message = 'あなたの勝ち！'
    } else if (winner === 'AI') {
      aiChips.value += pot
      resetStreak()
      gameState.value.bonusResult = null
      gameState.value.message = 'AIの勝ち...'
    } else {
      const half = Math.floor(pot / 2)
      addChips(half)
      aiChips.value += pot - half
      resetStreak()
      gameState.value.bonusResult = null
      gameState.value.message = '引き分け！'
    }

    gameState.value.phase = 'RESULT'
  }

  function proceedToNextRound() {
    if (playerChips.value <= 0 || aiChips.value <= 0) {
      gameState.value.phase = 'GAME_OVER'
      return
    }
    gameState.value.phase = 'IDLE'
    gameState.value.message = 'ゲームを開始してください'
    gameState.value.isPlayerTurn = false
  }

  return {
    gameState,
    playerChips,
    aiChips,
    winStreak,
    totalWon,
    canFold,
    canCall,
    canRaise,
    canCheck,
    visibleCommunityCards,
    startNewRound,
    playerFold,
    playerCall,
    playerRaise,
    playerCheck,
    proceedToNextRound,
  }
}
