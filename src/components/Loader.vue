<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  progress: { type: Number, default: 0 },
})

const emit = defineEmits(['enter', 'progress'])

const showButton = ref(false)
const text = 'développeur web & créateur shopify'

onMounted(() => {
  let p = 0
  const interval = setInterval(() => {
    p += Math.random() * 12 + 4
    if (p >= 100) {
      p = 100
      clearInterval(interval)
      setTimeout(() => { showButton.value = true }, 300)
    }
    emit('progress', Math.min(100, Math.round(p)))
  }, 120)
})

function enter() {
  emit('enter')
}
</script>

<template>
  <div class="loader">
    <img src="/logo.gif" alt="" class="loader-logo" />
    <p class="text">{{ text }}</p>
    <button
      class="enter-btn"
      :class="{ show: showButton }"
      @click="enter"
    >
      entrer
      <span class="dot" />
    </button>
    <button class="skip" :class="{ show: showButton }" @click="enter">
      passer l'intro
    </button>
    <p class="percentage" aria-hidden="true">{{ progress }}%</p>
  </div>
</template>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-dark);
  color: var(--color-white);
}

.loader-logo {
  width: 80rem;
  height: 80rem;
  object-fit: contain;
  margin-bottom: 28rem;
  opacity: 0.9;
}

.text {
  font-size: 24rem;
  font-weight: 500;
  text-align: center;
  max-width: calc(100% - var(--grid-margin) * 2);
  margin-bottom: 32rem;
  letter-spacing: -0.03em;
}

.enter-btn {
  display: inline-flex;
  align-items: center;
  gap: 8rem;
  background: var(--color-white);
  color: var(--color-bg-dark);
  font-size: 18rem;
  font-weight: 500;
  padding: 14rem 20rem;
  border-radius: 50rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease 0.2s, transform 0.2s ease;
}

.enter-btn.show {
  opacity: 1;
  pointer-events: auto;
}

.enter-btn:hover { transform: scale(0.97); }

.enter-btn .dot {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background: var(--color-bg-dark);
}

.skip {
  margin-top: 16rem;
  font-size: 13rem;
  pointer-events: none;
  transition: opacity 0.3s ease 0.4s;
  text-decoration: underline;
  text-underline-offset: 4px;
  opacity: 0;
}

.skip.show {
  opacity: 0.4;
  pointer-events: auto;
}

.skip:hover { opacity: 0.7; }

.percentage {
  position: absolute;
  bottom: var(--grid-margin);
  left: var(--grid-margin);
  font-size: 18rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
</style>
