<template>
  <div class="community">
    <div class="community__header">
      <span class="community__label">コミュニティカード</span>
      <span class="community__phase">{{ phaseLabel }}</span>
    </div>
    <div class="community__row">
      <template v-for="i in 5" :key="i">
        <Card
          v-if="visibleCommunityCards[i - 1]"
          :card="visibleCommunityCards[i - 1]"
          size="md"
        />
        <div v-else class="community__slot" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGame } from '~/composables/useGame'

const { gameState, visibleCommunityCards } = useGame()

const PHASE_LABELS: Record<string, string> = {
  IDLE: '',
  DEALING: '',
  PREFLOP: 'プリフロップ',
  FLOP: 'フロップ',
  TURN: 'ターン',
  RIVER: 'リバー',
  SHOWDOWN: 'ショーダウン',
  RESULT: 'ショーダウン',
  GAME_OVER: '',
}

const phaseLabel = computed(() => PHASE_LABELS[gameState.value.phase] ?? '')
</script>

<style scoped>
.community {
  margin: 12px 0;
}

.community__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #555;
}

.community__phase {
  background: #3a5fa0;
  color: #fff;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
}

.community__row {
  display: flex;
  gap: 8px;
}

.community__slot {
  width: 56px;
  height: 78px;
  border: 2px dashed #bbb;
  border-radius: 6px;
  background: #f5f5f5;
}
</style>
