<template>
  <div class="community">
    <div class="community__header">
      <span class="community__label">コミュニティ</span>
      <span v-if="phaseLabel" class="community__phase">{{ phaseLabel }}</span>
    </div>
    <div class="community__row">
      <template v-for="i in 5" :key="i">
        <Card
          v-if="visibleCommunityCards[i - 1]"
          :card="visibleCommunityCards[i - 1]!"
          size="md"
        />
        <div v-else class="community__slot" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGame } from '~/composables/game/useGame'
import { PHASE_LABELS } from '~/config/game'

const { gameState, visibleCommunityCards } = useGame()

const phaseLabel = computed(() => PHASE_LABELS[gameState.value.phase] ?? '')
</script>

<style scoped>
.community {
  margin: var(--space-sm) 0;
}

.community__header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.community__phase {
  background: var(--color-badge-phase);
  color: #fff;
  padding: 2px var(--space-md);
  border-radius: var(--radius-xl);
  font-size: var(--text-xs);
}

.community__row {
  display: flex;
  gap: var(--space-sm);
}

.community__slot {
  width: 56px;
  height: 78px;
  border: 2px dashed var(--color-border-dim);
  border-radius: var(--radius-md);
  background: var(--color-bg-surface);
}
</style>
