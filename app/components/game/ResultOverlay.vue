<template>
  <div class="overlay">
    <div class="overlay__box">
      <div class="overlay__banner" data-testid="result-banner" :class="bannerClass">{{ bannerText }}</div>

      <div class="overlay__hands">
        <div class="overlay__hand-row">
          <span class="overlay__hand-label">あなた</span>
          <span class="overlay__hand-rank">{{ gameState.playerEvaluation?.label ?? '－' }}</span>
        </div>
        <div class="overlay__hand-row">
          <span class="overlay__hand-label">AI</span>
          <span class="overlay__hand-rank">{{ gameState.aiEvaluation?.label ?? '－' }}</span>
        </div>
      </div>

      <div v-if="bonus" class="overlay__bonus">
        <div class="overlay__bonus-title">ボーナス内訳</div>
        <div class="overlay__bonus-row">
          <span>ベースポット</span><span>{{ bonus.basePot }}</span>
        </div>
        <div v-for="msg in bonus.messages" :key="msg" class="overlay__bonus-row overlay__bonus-row--highlight">
          <span>{{ msg }}</span>
        </div>
        <div class="overlay__bonus-row overlay__bonus-total">
          <span>獲得チップ</span><span>{{ bonus.finalPayout }}</span>
        </div>
        <div v-if="bonus.bonusChips > 0" class="overlay__bonus-row overlay__bonus-extra">
          <span>ボーナス分</span><span>+{{ bonus.bonusChips }}</span>
        </div>
      </div>

      <BaseButton variant="accent" size="lg" data-testid="next-round-btn" @click="proceedToNextRound">次のラウンドへ</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGame } from '~/composables/game/useGame'

const { gameState, proceedToNextRound } = useGame()

const bannerText = computed(() => {
  if (gameState.value.winner === 'PLAYER') return MESSAGES.PLAYER_WIN
  if (gameState.value.winner === 'AI') return MESSAGES.AI_WIN
  return MESSAGES.TIE
})

const bannerClass = computed(() => ({
  'overlay__banner--win': gameState.value.winner === 'PLAYER',
  'overlay__banner--lose': gameState.value.winner === 'AI',
  'overlay__banner--tie': gameState.value.winner === 'TIE',
}))

const bonus = computed(() => gameState.value.bonusResult)
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: var(--color-overlay-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-overlay);
}

.overlay__box {
  background: var(--color-overlay-card);
  border-radius: var(--radius-2xl);
  padding: 28px var(--space-3xl);
  min-width: 300px;
  max-width: 420px;
  width: 90%;
  text-align: center;
  box-shadow: var(--shadow-overlay);
}

.overlay__banner {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-xl);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
}

.overlay__banner--win  { background: var(--color-win-bg);  color: var(--color-win-text); }
.overlay__banner--lose { background: var(--color-lose-bg); color: var(--color-lose-text); }
.overlay__banner--tie  { background: var(--color-tie-bg);  color: var(--color-tie-text); }

.overlay__hands {
  margin-bottom: var(--space-xl);
  text-align: left;
}

.overlay__hand-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-xs) 0;
  border-bottom: 1px solid #eee;
  font-size: var(--text-base);
}

.overlay__hand-label {
  color: var(--color-text-dark);
}

.overlay__hand-rank {
  font-weight: var(--font-bold);
  color: var(--color-text-dark);
}

.overlay__bonus {
  background: var(--color-bonus-bg);
  border: 1px solid var(--color-bonus-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
  text-align: left;
}

.overlay__bonus-title {
  font-weight: var(--font-bold);
  font-size: var(--text-md);
  margin-bottom: var(--space-md);
  color: var(--color-text-darker);
}

.overlay__bonus-row {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-md);
  padding: 2px 0;
  color: var(--color-raise-dark);
}

.overlay__bonus-row--highlight {
  color: var(--color-bonus-highlight);
  font-weight: var(--font-bold);
}

.overlay__bonus-total {
  border-top: 1px solid var(--color-bonus-border);
  margin-top: var(--space-xs);
  padding-top: var(--space-xs);
  font-weight: var(--font-bold);
  font-size: var(--text-lg);
}

.overlay__bonus-extra {
  color: var(--color-raise);
  font-weight: var(--font-bold);
}


</style>
