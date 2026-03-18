<template>
  <div class="flex flex-wrap gap-2 my-4">
    <div
      v-for="item in ownedItems"
      :key="item.id"
      class="bg-gray-100 border p-2 rounded"
    >
      <div>{{ item.id }} (x{{ item.count }})</div>
      <button
        class="text-sm bg-green-500 text-white px-2 py-1 rounded mt-1"
        @click="$emit('useItem', item.id)"
      >
        使用
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  ownedItems: { id: string; count: number }[]
}>()
defineEmits(['useItem'])
</script>
