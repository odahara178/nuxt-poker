<template>
  <button
    class="base-btn"
    :class="[`base-btn--${variant}`, `base-btn--${size}`]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'accent' | 'fold' | 'check' | 'call' | 'raise'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
)
</script>

<style scoped>
/* ── Base ───────────────────────────────── */
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-family-base);
  font-weight: var(--font-bold);
  letter-spacing: 0.04em;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  top: 0;
  /* リリース時だけ素早く戻るアニメーション（押下は即座） */
  transition:
    top 0.08s ease-out,
    box-shadow 0.08s ease-out,
    opacity var(--transition-fast);
}

.base-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  box-shadow: none !important;
  top: 0 !important;
}

/* ── Sizes ──────────────────────────────── */
.base-btn--sm {
  padding: var(--space-xs) var(--space-lg);
  font-size: var(--text-sm);
}

.base-btn--md {
  padding: var(--space-md) var(--space-md);
  font-size: var(--text-md);
}

.base-btn--lg {
  padding: 14px 40px;
  font-size: var(--text-xl);
}

/* ── Variants ───────────────────────────── */

/* Primary (gold) */
.base-btn--primary {
  background: linear-gradient(180deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
  color: var(--color-primary-text);
  box-shadow: var(--shadow-btn-primary);
}
.base-btn--primary:not(:disabled):hover  { background: linear-gradient(180deg, #ffed70 0%, var(--color-primary) 100%); }
.base-btn--primary:not(:disabled):active { top: 3px; box-shadow: var(--shadow-btn-primary-active); transition: none; }

/* Accent (blue) */
.base-btn--accent {
  background: linear-gradient(180deg, var(--color-accent-light) 0%, var(--color-accent) 100%);
  color: #fff;
  box-shadow: var(--shadow-btn-accent);
}
.base-btn--accent:not(:disabled):hover  { background: linear-gradient(180deg, #5882cc 0%, var(--color-accent) 100%); }
.base-btn--accent:not(:disabled):active { top: 3px; box-shadow: var(--shadow-btn-accent-active); transition: none; }

/* Fold (red) */
.base-btn--fold {
  background: linear-gradient(180deg, var(--color-fold-light) 0%, var(--color-fold) 100%);
  color: #fff;
  box-shadow: var(--shadow-btn-fold);
}
.base-btn--fold:not(:disabled):hover  { background: linear-gradient(180deg, #e85040 0%, var(--color-fold) 100%); }
.base-btn--fold:not(:disabled):active { top: 3px; box-shadow: var(--shadow-btn-fold-active); transition: none; }

/* Check (gray) */
.base-btn--check {
  background: linear-gradient(180deg, var(--color-check-light) 0%, var(--color-check) 100%);
  color: #fff;
  box-shadow: var(--shadow-btn-check);
}
.base-btn--check:not(:disabled):hover  { background: linear-gradient(180deg, #a8b6b7 0%, var(--color-check) 100%); }
.base-btn--check:not(:disabled):active { top: 3px; box-shadow: var(--shadow-btn-check-active); transition: none; }

/* Call (green) */
.base-btn--call {
  background: linear-gradient(180deg, var(--color-call-light) 0%, var(--color-call) 100%);
  color: #fff;
  box-shadow: var(--shadow-btn-call);
}
.base-btn--call:not(:disabled):hover  { background: linear-gradient(180deg, #36d97a 0%, var(--color-call) 100%); }
.base-btn--call:not(:disabled):active { top: 3px; box-shadow: var(--shadow-btn-call-active); transition: none; }

/* Raise (orange) */
.base-btn--raise {
  background: linear-gradient(180deg, var(--color-raise-light) 0%, var(--color-raise) 100%);
  color: #fff;
  box-shadow: var(--shadow-btn-raise);
}
.base-btn--raise:not(:disabled):hover  { background: linear-gradient(180deg, #f5a825 0%, var(--color-raise) 100%); }
.base-btn--raise:not(:disabled):active { top: 3px; box-shadow: var(--shadow-btn-raise-active); transition: none; }
</style>
