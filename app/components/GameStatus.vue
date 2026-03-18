<template>
  <div class="status">
    <span class="status__message">{{ gameState.message }}</span>
    <span class="status__round">ラウンド {{ gameState.roundNumber }}</span>
  </div>
</template>

<script setup lang="ts">
import { useGame } from '~/composables/useGame'

const { gameState } = useGame()
</script>

<style scoped>
.status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f0f4ff;
  border-radius: 6px;
  font-size: 14px;
  margin: 8px 0;
}

.status__message {
  color: #333;
  font-weight: bold;
}

.status__round {
  color: #888;
  font-size: 12px;
}
</style>
