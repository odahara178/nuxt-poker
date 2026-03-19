import { ref } from 'vue'
import { usePlayer } from './usePlayer'

export interface Item {
  id: string
  name: string
  cost: number
  description: string
}

export function useItems() {
  const player = usePlayer()

  const items = ref<Item[]>([
    {
      id: 'extra-chips',
      name: 'チップ補充',
      cost: 50,
      description: 'チップを100枚補充する',
    },
  ])

  const ownedItems = ref<{ id: string; count: number }[]>([])

  const buyItem = (itemId: string) => {
    const item = items.value.find(candidate => candidate.id === itemId)
    if (!item || player.chips.value < item.cost) return

    const existing = ownedItems.value.find(ownedItem => ownedItem.id === itemId)
    if (existing) existing.count++
    else ownedItems.value.push({ id: itemId, count: 1 })

    player.chips.value -= item.cost
  }

  const useItem = (itemId: string) => {
    const entry = ownedItems.value.find(ownedItem => ownedItem.id === itemId)
    if (!entry || entry.count <= 0) return

    if (itemId === 'extra-chips') {
      player.chips.value += 100
    }
    entry.count--
  }

  return { items, ownedItems, buyItem, useItem }
}
