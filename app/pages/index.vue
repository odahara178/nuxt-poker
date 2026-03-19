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
        <div class="score-display">
          <span class="score-display__label">スコア</span>
          <span class="score-display__value" data-testid="player-score">{{ playerScore }}</span>
        </div>
        <span class="blind-level">SB {{ currentBlindLevel.small }} / BB {{ currentBlindLevel.big }}</span>
        <span data-testid="round-number">R{{ gameState.roundNumber }}</span>
      </div>
    </div>

    <!-- Game Over -->
    <div v-if="gameState.phase === 'GAME_OVER'" class="gameover">
      <div v-if="playerChips <= 0" class="gameover__result gameover__result--lose">敗北</div>
      <div v-else class="gameover__result gameover__result--win">勝利</div>
      <div class="gameover__sub">{{ playerChips <= 0 ? 'チップがなくなりました' : 'AIのチップを全て奪いました！' }}</div>
      <div class="gameover__stats">
        <p>最終スコア: {{ playerScore }}</p>
        <p>プレイ手数: {{ handsPlayed }}</p>
        <p>連勝記録: {{ winStreak }}</p>
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
          :blind="gameState.phase !== 'IDLE' ? 'BB' : undefined"
        />
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
          :blind="gameState.phase !== 'IDLE' ? 'SB' : undefined"
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

      <!-- Chip Counter -->
      <div class="chips-bar">
        <div class="chips-bar__label">所持チップ</div>
        <div class="chips-bar__counts">
          <span class="chips-bar__player" data-testid="player-chips">あなた {{ playerChips }}</span>
          <span class="chips-bar__vs">vs</span>
          <span class="chips-bar__ai">AI {{ aiChips }}</span>
        </div>
      </div>

      <!-- Footer stats -->
      <div class="footer">
        <span>連勝: {{ winStreak }}</span>
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
  playerScore,
  aiChips,
  winStreak,
  currentBlindLevel,
  startNewRound,
} = useGame()

const { handsPlayed, score } = usePlayer()

function resetGame() {
  playerChips.value = STARTING_CHIPS
  aiChips.value = STARTING_CHIPS
  score.value = 0
  gameState.value.phase = 'IDLE'
  gameState.value.roundNumber = 0
  gameState.value.message = MESSAGES.IDLE
  gameState.value.isPlayerTurn = false
  gameState.value.winner = null
  gameState.value.scoreResult = null
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
  align-items: center;
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.2;
}

.score-display__label {
  font-size: 10px;
  color: var(--color-gold-dim);
  font-weight: var(--font-normal);
  letter-spacing: 1px;
}

.score-display__value {
  font-size: var(--text-lg);
  color: var(--color-gold);
  font-weight: var(--font-black);
}

.blind-level {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-weight: var(--font-normal);
}

.area {
  background: var(--color-bg-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-md) var(--space-md);
  margin: var(--space-xs) 0;
}

.start-area {
  text-align: center;
  margin: 20px 0;
}

/* 所持チップ表示バー */
.chips-bar {
  background: var(--color-bg-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-sm) var(--space-md);
  margin: var(--space-xs) 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chips-bar__label {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-weight: var(--font-bold);
}

.chips-bar__counts {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--text-md);
  font-weight: var(--font-bold);
}

.chips-bar__player {
  color: var(--color-win-text);
}

.chips-bar__vs {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-weight: var(--font-normal);
}

.chips-bar__ai {
  color: var(--color-lose-text);
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

.gameover__result {
  font-size: 52px;
  font-weight: var(--font-black);
  margin-bottom: var(--space-md);
  letter-spacing: 4px;
}

.gameover__result--win  { color: var(--color-win-text); }
.gameover__result--lose { color: var(--color-lose-text); }

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
