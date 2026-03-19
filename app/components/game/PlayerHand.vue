<template>
  <div class="hand">
    <div class="hand__header">
      <span class="hand__label">{{ label }}</span>
      <span v-if="blind" class="hand__blind" :class="`hand__blind--${blind.toLowerCase()}`">{{ blind }}</span>
      <span v-if="evaluation" class="hand__eval">{{ evaluation.label }}</span>
    </div>
    <div class="hand__cards">
      <Card v-for="card in cards" :key="card.id" :card="card" size="lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card, EvaluatedHand } from '~/composables/game/usePoker'

defineProps<{
  cards: Card[]
  label: string
  evaluation?: EvaluatedHand | null
  blind?: 'SB' | 'BB'
}>()
</script>

<style scoped>
.hand {
  margin: var(--space-xs) 0;
}

.hand__header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
  font-size: var(--text-md);
  color: var(--color-text-secondary);
}

.hand__blind {
  padding: 1px var(--space-sm);
  border-radius: var(--radius-xl);
  font-size: var(--text-xs, 11px);
  font-weight: var(--font-bold);
  letter-spacing: 0.5px;
}

.hand__blind--sb {
  background: var(--color-bg-page);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.hand__blind--bb {
  background: var(--color-gold);
  color: #1a1a1a;
}

.hand__eval {
  background: var(--color-badge-eval);
  color: #fff;
  padding: 2px var(--space-md);
  border-radius: var(--radius-xl);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
}

.hand__cards {
  display: flex;
  gap: var(--space-md);
}
</style>
