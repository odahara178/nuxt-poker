<template>
  <div class="betting">
    <div class="betting__info">
      <span>ポット: <strong>{{ gameState.betting.pot }}</strong></span>
      <span v-if="canCall">コール: <strong>{{ callCost }}</strong></span>
      <span v-if="gameState.pendingAIAction" class="betting__thinking">AI思考中…</span>
    </div>
    <div class="betting__buttons">
      <BaseButton
        variant="fold"
        :disabled="!canFold || gameState.pendingAIAction"
        @click="playerFold"
      >
        フォールド
      </BaseButton>
      <BaseButton
        v-if="canCheck"
        variant="check"
        :disabled="gameState.pendingAIAction"
        @click="playerCheck"
      >
        チェック
      </BaseButton>
      <BaseButton
        v-if="canCall"
        variant="call"
        :disabled="gameState.pendingAIAction"
        @click="playerCall"
      >
        コール {{ callCost }}
      </BaseButton>
      <BaseButton
        v-if="canRaise"
        variant="raise"
        :disabled="gameState.pendingAIAction"
        @click="playerRaise"
      >
        レイズ +{{ RAISE_AMOUNT }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGame } from '~/composables/game/useGame'

const RAISE_AMOUNT = 40

const { gameState, canFold, canCall, canRaise, canCheck, playerFold, playerCall, playerRaise, playerCheck } =
  useGame()

const callCost = computed(
  () => gameState.value.betting.currentBet - gameState.value.betting.playerBet,
)
</script>

<style scoped>
.betting {
  padding: var(--space-sm) 0;
}

.betting__info {
  display: flex;
  gap: var(--space-lg);
  font-size: var(--text-md);
  margin-bottom: var(--space-sm);
  color: var(--color-text-secondary);
  align-items: center;
}

.betting__thinking {
  margin-left: auto;
  font-size: var(--text-sm);
  color: var(--color-badge-ai);
  font-style: italic;
}

.betting__buttons {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: nowrap;
}

/* ベッティングエリアではボタンを均等幅に引き伸ばす */
.betting__buttons > .base-btn {
  flex: 1;
  min-width: 0;
}
</style>
