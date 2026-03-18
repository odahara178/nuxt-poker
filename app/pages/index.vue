<template>
  <div class="page">
    <ResultOverlay v-if="gameState.phase === 'RESULT'" />

    <!-- Header -->
    <div class="header">
      <h1 class="header__title">テキサスホールデム</h1>
      <div class="header__stats">
        <span>チップ: <strong>{{ playerChips }}</strong></span>
        <span>ラウンド: {{ gameState.roundNumber }}</span>
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
      <button class="gameover__btn" @click="resetGame">最初からやり直す</button>
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
        <button class="start-btn" @click="startNewRound">ゲーム開始</button>
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
import { useGame } from '~/composables/useGame'
import { usePlayer } from '~/composables/usePlayer'

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
  playerChips.value = 1000
  aiChips.value = 1000
  gameState.value.phase = 'IDLE'
  gameState.value.roundNumber = 0
  gameState.value.message = 'ゲームを開始してください'
  gameState.value.isPlayerTurn = false
  gameState.value.winner = null
  gameState.value.bonusResult = null
}
</script>

<style scoped>
.page {
  max-width: 520px;
  margin: 0 auto;
  padding: 16px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  position: relative;
  min-height: 100vh;
  background: #1a3a1a;
  color: #eee;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.header__title {
  font-size: 20px;
  font-weight: bold;
  color: #ffd700;
}

.header__stats {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #ccc;
}

.area {
  background: rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  padding: 10px 12px;
  margin: 8px 0;
}

.area--ai {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chip-count {
  font-size: 13px;
  color: #aaa;
}

.start-area {
  text-align: center;
  margin: 20px 0;
}

.start-btn {
  background: #ffd700;
  color: #1a3a1a;
  border: none;
  border-radius: 8px;
  padding: 14px 40px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.start-btn:hover {
  background: #f0c800;
}

.footer {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
  padding: 8px;
  font-size: 13px;
  color: #aaa;
  border-top: 1px solid rgba(255,255,255,0.1);
}

/* Game Over */
.gameover {
  text-align: center;
  padding: 40px 20px;
}

.gameover__title {
  font-size: 36px;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 8px;
}

.gameover__sub {
  font-size: 16px;
  color: #ccc;
  margin-bottom: 24px;
}

.gameover__stats {
  font-size: 14px;
  color: #aaa;
  margin-bottom: 24px;
  line-height: 2;
}

.gameover__btn {
  background: #ffd700;
  color: #1a3a1a;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
</style>
