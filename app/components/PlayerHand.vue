<template>
  <div class="hand">
    <div class="hand__header">
      <span class="hand__label">{{ label }}</span>
      <span v-if="evaluation" class="hand__eval">{{ evaluation.label }}</span>
    </div>
    <div class="hand__cards">
      <Card v-for="card in cards" :key="card.id" :card="card" size="lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card, EvaluatedHand } from '~/composables/usePoker'

defineProps<{
  cards: Card[]
  label: string
  evaluation?: EvaluatedHand | null
}>()
</script>

<style scoped>
.hand {
  margin: 8px 0;
}

.hand__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 13px;
  color: #555;
}

.hand__eval {
  background: #e8a020;
  color: #fff;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: bold;
}

.hand__cards {
  display: flex;
  gap: 8px;
}
</style>
