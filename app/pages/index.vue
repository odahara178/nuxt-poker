<template>
  <div class="page">
    <ResultOverlay v-if="gameState.phase === 'RESULT'" />

    <!-- Header -->
    <div class="header">
      <div class="logo">
        <span class="logo__main">POKER</span>
        <span class="logo__sub">1 on 1</span>
      </div>
      <div class="header__stats">
        <span data-testid="player-chips">💰 {{ playerChips }}</span>
        <span data-testid="round-number">R{{ gameState.roundNumber }}</span>
      </div>
    </div>

    <!-- Game Over -->
    <div v-if="gameState.phase === 'GAME_OVER'" class="gameover">
      <div class="gameover__title">ゲームオーバー</div>
      <div class="gameover__sub">{{ playerChips <= 0 ? 'チップがなくなりました' : 'AIのチップがなくなりました' }}</div>
      <div class="gameover__stats">
        <p>プレイ手数: {{ handsPlayed }}</p>
        <p>総獲得チップ: {{ totalWon }}</p>
      </div>
      <BaseButton size="lg" data-testid="reset-game-btn" @click="resetGame">最初からやり直す</BaseButton>
    </div>

    <!-- Main Game -->
    <template v-else>
      <!-- AI Area -->
      <div class="area area--ai">
        <PlayerHand
          :cards="gameState.aiHoleCards"
          label="AI"
          :evaluation="gameState.phase === 'SHOWDOWN' || gameState.phase === 'RESULT' ? gameState.aiEvaluation : null"
        />
        <span class="chip-count">AIチップ: {{ aiChips }}</span>
      </div>

      <!-- Community Cards -->
      <CommunityCards />

      <!-- Status -->
      <GameStatus />

      <!-- Player Area -->
      <div class="area area--player">
        <PlayerHand
          :cards="gameState.playerHoleCards"
          label="あなた"
          :evaluation="gameState.phase === 'SHOWDOWN' || gameState.phase === 'RESULT' ? gameState.playerEvaluation : null"
        />
      </div>

      <!-- Betting Controls (active phases) -->
      <BettingControls
        v-if="gameState.isPlayerTurn || gameState.pendingAIAction"
      />

      <!-- Start Round Button -->
      <div v-if="gameState.phase === 'IDLE'" class="start-area">
        <BaseButton size="lg" data-testid="start-round-btn" @click="startNewRound">ゲーム開始</BaseButton>
      </div>

      <!-- Footer stats -->
      <div class="footer">
        <span>連勝: {{ winStreak }}</span>
        <span>総獲得: {{ totalWon }}</span>
        <span>手数: {{ handsPlayed }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useGame } from '~/composables/game/useGame'
import { usePlayer } from '~/composables/player/usePlayer'

const {
  gameState,
  playerChips,
  aiChips,
  winStreak,
  totalWon,
  startNewRound,
} = useGame()

const { handsPlayed } = usePlayer()

function resetGame() {
  playerChips.value = STARTING_CHIPS
  aiChips.value = STARTING_CHIPS
  gameState.value.phase = 'IDLE'
  gameState.value.roundNumber = 0
  gameState.value.message = MESSAGES.IDLE
  gameState.value.isPlayerTurn = false
  gameState.value.winner = null
  gameState.value.bonusResult = null
}
</script>

<style scoped>
.page {
  max-width: 520px;
  margin: 0 auto;
  padding: var(--space-md) 14px;
  font-family: var(--font-family-base);
  position: relative;
  height: 100vh;        /* 旧ブラウザ向けフォールバック */
  height: 100dvh;       /* URLバーを除いた実際の表示領域 */
  overflow: hidden;
  background: var(--color-bg-page);
  color: var(--color-text-primary);
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.logo {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo__main {
  font-size: var(--text-2xl);
  font-weight: var(--font-black);
  letter-spacing: 3px;
  color: var(--color-gold);
}

.logo__sub {
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--color-gold-dim);
  font-weight: var(--font-normal);
  margin-top: 1px;
}

.header__stats {
  display: flex;
  gap: var(--space-lg);
  font-size: var(--text-md);
  color: var(--color-text-primary);
  font-weight: var(--font-bold);
}

.area {
  background: var(--color-bg-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-md) var(--space-md);
  margin: var(--space-xs) 0;
}

.area--ai {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chip-count {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.start-area {
  text-align: center;
  margin: 20px 0;
}

.footer {
  display: flex;
  justify-content: space-around;
  margin-top: var(--space-md);
  padding: var(--space-sm);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
}

/* Game Over */
.gameover {
  text-align: center;
  padding: 40px 20px;
}

.gameover__title {
  font-size: 36px;
  font-weight: var(--font-bold);
  color: var(--color-gold);
  margin-bottom: var(--space-md);
}

.gameover__sub {
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  margin-bottom: var(--space-2xl);
}

.gameover__stats {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  margin-bottom: var(--space-2xl);
  line-height: 2;
}


</style>
