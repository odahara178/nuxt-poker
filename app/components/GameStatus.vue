<template>
  <div class="status">
    <span class="status__message">{{ gameState.message }}</span>
  </div>
</template>

<script setup lang="ts">
import { useGame } from '~/composables/useGame'

const { gameState } = useGame()
</script>

<style scoped>
.status {
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-status-bg);
  border-radius: var(--radius-lg);
  font-size: var(--text-md);
  margin: var(--space-xs) 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.status__message {
  color: var(--color-status-text);
  font-weight: var(--font-bold);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  letter-spacing: 0.02em;
}
</style>
