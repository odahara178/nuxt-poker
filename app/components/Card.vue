<template>
  <div class="card" :class="[`card--${size}`, card.faceUp ? 'card--face-up' : 'card--face-down']">
    <!-- 裏面 -->
    <template v-if="!card.faceUp">
      <img class="card__back-img" src="/cards/back.svg" alt="card back" >
    </template>

    <!-- 表面 -->
    <template v-else>
      <img class="card__bg" src="/cards/face-bg.svg" alt="" aria-hidden="true" >
      <div class="card__content" :class="isRed ? 'card__content--red' : ''">
        <span class="card__rank">{{ card.rank }}</span>
        <img class="card__suit-img" :src="suitSrc" :alt="card.suit" >
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Card, Suit } from '~/composables/usePoker'

const props = withDefaults(
  defineProps<{
    card: Card
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)

const SUIT_IMAGES: Record<Suit, string> = {
  '♠': '/suits/spade.svg',
  '♥': '/suits/heart.svg',
  '♦': '/suits/diamond.svg',
  '♣': '/suits/club.svg',
}

const isRed = computed(() => props.card.suit === '♥' || props.card.suit === '♦')
const suitSrc = computed(() => SUIT_IMAGES[props.card.suit])
</script>

<style scoped>
.card {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  overflow: hidden;
  user-select: none;
  box-shadow: var(--shadow-card);
}

.card--sm  { width: 40px;  height: 56px; }
.card--md  { width: 56px;  height: 78px; }
.card--lg  { width: 70px;  height: 98px; }

.card__back-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.card__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card__content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  color: var(--color-card-dark);
  line-height: 1.2;
  gap: 2px;
}

.card__content--red {
  color: var(--color-card-red);
}

.card--sm .card__rank  { font-size: var(--text-xs); }
.card--md .card__rank  { font-size: var(--text-base); }
.card--lg .card__rank  { font-size: var(--text-xl); }

.card--sm .card__suit-img  { width: 14px; height: 14px; }
.card--md .card__suit-img  { width: 20px; height: 20px; }
.card--lg .card__suit-img  { width: 26px; height: 26px; }
</style>
