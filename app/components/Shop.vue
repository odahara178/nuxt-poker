<template>
  <div class="shop">
    <h2 class="shop__title">ショップ</h2>
    <div v-for="item in items" :key="item.id" class="shop__item">
      <div class="shop__item-info">
        <strong>{{ item.name }}</strong>: {{ item.description }}
      </div>
      <BaseButton
        variant="accent"
        size="sm"
        :disabled="playerChips < item.cost"
        @click="buyItem(item.id)"
      >
        {{ item.cost }}pt 購入
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useItems } from '~/composables/useItems'
import { useGame } from '~/composables/useGame'

const { items, buyItem } = useItems()
const { playerChips } = useGame()
</script>

<style scoped>
.shop {
  padding: var(--space-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);
  margin-top: var(--space-lg);
}

.shop__title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-md);
  color: var(--color-text-primary);
}

.shop__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
  font-size: var(--text-md);
  color: var(--color-text-secondary);
}


</style>
