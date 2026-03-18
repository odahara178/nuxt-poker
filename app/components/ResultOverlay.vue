<template>
  <div class="overlay">
    <div class="overlay__box">
      <div class="overlay__banner" :class="bannerClass">{{ bannerText }}</div>

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

      <button class="overlay__btn" @click="proceedToNextRound">次のラウンドへ</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGame } from '~/composables/useGame'

const { gameState, proceedToNextRound } = useGame()

const bannerText = computed(() => {
  if (gameState.value.winner === 'PLAYER') return 'あなたの勝ち！'
  if (gameState.value.winner === 'AI') return 'AIの勝ち...'
  return '引き分け'
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
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.overlay__box {
  background: #fff;
  border-radius: 12px;
  padding: 28px 32px;
  min-width: 300px;
  max-width: 420px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.overlay__banner {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 16px;
  padding: 8px;
  border-radius: 8px;
}

.overlay__banner--win {
  background: #e8f8e8;
  color: #1a7a1a;
}

.overlay__banner--lose {
  background: #fae8e8;
  color: #9a1a1a;
}

.overlay__banner--tie {
  background: #f0f0e8;
  color: #666;
}

.overlay__hands {
  margin-bottom: 16px;
  text-align: left;
}

.overlay__hand-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.overlay__hand-label {
  color: #666;
}

.overlay__hand-rank {
  font-weight: bold;
  color: #333;
}

.overlay__bonus {
  background: #fffbe8;
  border: 1px solid #e8d840;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  text-align: left;
}

.overlay__bonus-title {
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 8px;
  color: #666;
}

.overlay__bonus-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 2px 0;
}

.overlay__bonus-row--highlight {
  color: #c07000;
  font-weight: bold;
}

.overlay__bonus-total {
  border-top: 1px solid #e8d840;
  margin-top: 4px;
  padding-top: 4px;
  font-weight: bold;
  font-size: 15px;
}

.overlay__bonus-extra {
  color: #e67e22;
  font-weight: bold;
}

.overlay__btn {
  background: #3a5fa0;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 4px;
}

.overlay__btn:hover {
  background: #2a4f90;
}
</style>
