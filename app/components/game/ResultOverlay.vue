<template>
  <div class="overlay">
    <div class="overlay__box">
      <div class="overlay__banner" data-testid="result-banner" :class="bannerClass">{{ bannerText }}</div>

      <div class="overlay__hands">
        <div class="overlay__hand-row">
          <span class="overlay__hand-label">あなた</span>
          <span class="overlay__hand-rank">
            {{ gameState.playerEvaluation?.label ?? '－' }}
            <span v-if="gameState.playerEvaluation?.detail" class="overlay__hand-detail">（{{ gameState.playerEvaluation.detail }}）</span>
          </span>
        </div>
        <div class="overlay__hand-row">
          <span class="overlay__hand-label">AI</span>
          <span class="overlay__hand-rank">
            {{ gameState.aiEvaluation?.label ?? '－' }}
            <span v-if="gameState.aiEvaluation?.detail" class="overlay__hand-detail">（{{ gameState.aiEvaluation.detail }}）</span>
          </span>
        </div>
        <div v-if="reason" class="overlay__reason">{{ reason }}</div>
      </div>

      <div v-if="scoreResult" class="overlay__score">
        <div class="overlay__score-title">スコア内訳</div>
        <div class="overlay__score-body">
          <div class="overlay__score-row">
            <span>ベース（ポット）</span>
            <span>{{ scoreResult.basePot }}</span>
          </div>
          <div v-for="msg in scoreResult.messages" :key="msg" class="overlay__score-row overlay__score-row--bonus">
            <span>{{ msg }}</span>
          </div>
        </div>
        <div class="overlay__score-total">
          <span>獲得スコア</span>
          <span>{{ scoreResult.totalScore }}</span>
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

const scoreResult = computed(() => gameState.value.scoreResult)

const reason = computed(() => {
  const winner = gameState.value.winner
  const playerEval = gameState.value.playerEvaluation
  const aiEval = gameState.value.aiEvaluation

  if (winner === 'TIE') return '完全に同じ強さで引き分け'

  if (!playerEval || !aiEval) {
    if (winner === 'PLAYER') return 'AIがフォールドしました'
    if (winner === 'AI') return 'あなたがフォールドしました'
    return null
  }

  if (playerEval.rankIndex !== aiEval.rankIndex) {
    if (winner === 'PLAYER') return `あなたの「${playerEval.label}」がAIの「${aiEval.label}」より強い`
    return `AIの「${aiEval.label}」があなたの「${playerEval.label}」より強い`
  }

  if (winner === 'PLAYER') return `同じ「${playerEval.label}」でもあなたのカードが上`
  return `同じ「${aiEval.label}」でもAIのカードが上`
})
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
  padding: 20px var(--space-3xl);
  min-width: 300px;
  max-width: 420px;
  width: 90%;
  max-height: 92dvh;
  display: flex;
  flex-direction: column;
  text-align: center;
  box-shadow: var(--shadow-overlay);
}

.overlay__banner {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-lg);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-lg);
  flex-shrink: 0;
}

.overlay__banner--win  { background: var(--color-win-bg);  color: var(--color-win-text); }
.overlay__banner--lose { background: var(--color-lose-bg); color: var(--color-lose-text); }
.overlay__banner--tie  { background: var(--color-tie-bg);  color: var(--color-tie-text); }

.overlay__hands {
  margin-bottom: var(--space-lg);
  text-align: left;
  flex-shrink: 0;
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

.overlay__hand-detail {
  font-weight: var(--font-normal, 400);
  font-size: var(--text-sm);
  opacity: 0.75;
}

.overlay__reason {
  margin-top: var(--space-sm);
  font-size: var(--text-sm);
  color: var(--color-text-dark);
  text-align: center;
  font-style: italic;
  opacity: 0.8;
}

/* スコア内訳ブロック */
.overlay__score {
  background: var(--color-bonus-bg);
  border: 1px solid var(--color-bonus-border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-lg);
  text-align: left;
  flex-shrink: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.overlay__score-title {
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
  padding: var(--space-sm) var(--space-md);
  padding-bottom: 0;
  color: var(--color-text-darker);
  flex-shrink: 0;
}

/* スクロール対象エリア */
.overlay__score-body {
  overflow-y: auto;
  max-height: 120px;
  padding: var(--space-xs) var(--space-md);
  scrollbar-width: thin;
  scrollbar-color: var(--color-bonus-border) transparent;
}

.overlay__score-body::-webkit-scrollbar {
  width: 4px;
}

.overlay__score-body::-webkit-scrollbar-thumb {
  background: var(--color-bonus-border);
  border-radius: 2px;
}

.overlay__score-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: var(--text-sm);
  padding: 1px 0;
  color: var(--color-text-dark);
}

.overlay__score-row--bonus {
  color: var(--color-bonus-highlight);
  font-weight: var(--font-bold);
  margin-top: 4px;
}

/* 合計行: スクロール外に常時表示 */
.overlay__score-total {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-md);
  padding: var(--space-xs) var(--space-md);
  font-weight: var(--font-bold);
  color: var(--color-text-dark);
  border-top: 1px solid var(--color-bonus-border);
  flex-shrink: 0;
}
</style>
