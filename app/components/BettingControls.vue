<template>
  <div class="betting">
    <div class="betting__info">
      <span>ポット: <strong>{{ gameState.betting.pot }}</strong></span>
      <span v-if="canCall">コール: <strong>{{ callCost }}</strong></span>
    </div>
    <div class="betting__buttons">
      <button
        class="btn btn--fold"
        :disabled="!canFold || gameState.pendingAIAction"
        @click="playerFold"
      >
        フォールド
      </button>
      <button
        v-if="canCheck"
        class="btn btn--check"
        :disabled="gameState.pendingAIAction"
        @click="playerCheck"
      >
        チェック
      </button>
      <button
        v-if="canCall"
        class="btn btn--call"
        :disabled="gameState.pendingAIAction"
        @click="playerCall"
      >
        コール {{ callCost }}
      </button>
      <button
        v-if="canRaise"
        class="btn btn--raise"
        :disabled="gameState.pendingAIAction"
        @click="playerRaise"
      >
        レイズ +{{ RAISE_AMOUNT }}
      </button>
    </div>
    <div v-if="gameState.pendingAIAction" class="betting__thinking">
      AIが考え中...
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGame } from '~/composables/useGame'

const RAISE_AMOUNT = 40

const { gameState, canFold, canCall, canRaise, canCheck, playerFold, playerCall, playerRaise, playerCheck } =
  useGame()

const callCost = computed(
  () => gameState.value.betting.currentBet - gameState.value.betting.playerBet,
)
</script>

<style scoped>
.betting {
  padding: 10px 0;
}

.betting__info {
  display: flex;
  gap: 16px;
  font-size: 14px;
  margin-bottom: 8px;
  color: #444;
}

.betting__buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 18px;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn--fold {
  background: #c0392b;
  color: #fff;
}

.btn--check {
  background: #7f8c8d;
  color: #fff;
}

.btn--call {
  background: #27ae60;
  color: #fff;
}

.btn--raise {
  background: #e67e22;
  color: #fff;
}

.betting__thinking {
  margin-top: 8px;
  font-size: 13px;
  color: #888;
  font-style: italic;
}
</style>
