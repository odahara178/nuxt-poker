<template>
  <div class="shop">
    <h2 class="shop__title">ショップ</h2>
    <div v-for="item in items" :key="item.id" class="shop__item">
      <div class="shop__item-info">
        <strong>{{ item.name }}</strong>: {{ item.description }}
      </div>
      <button
        class="shop__btn"
        :disabled="playerChips < item.cost"
        @click="buyItem(item.id)"
      >
        {{ item.cost }}pt 購入
      </button>
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
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  margin-top: 12px;
}

.shop__title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.shop__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
}

.shop__btn {
  background: #3a5fa0;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 13px;
}

.shop__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
