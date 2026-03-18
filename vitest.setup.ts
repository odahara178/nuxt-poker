import { ref, computed } from 'vue'

type GlobalWithStubs = typeof globalThis & {
  useState: <T>(key: string, init: () => T) => ReturnType<typeof ref<T>>
  computed: typeof computed
}

// Stub Nuxt auto-imports so composables can run outside Nuxt context
;(globalThis as GlobalWithStubs).useState = <T>(_key: string, init: () => T) => ref(init())
;(globalThis as GlobalWithStubs).computed = computed
