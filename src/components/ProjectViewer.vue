<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  project: { type: Object, required: true },
  projects: { type: Array, required: true },
})

const emit = defineEmits(['close', 'select'])

const index = computed(() => props.projects.findIndex((p) => p.slug === props.project.slug))
const prev = computed(() => props.projects[(index.value - 1 + props.projects.length) % props.projects.length])
const next = computed(() => props.projects[(index.value + 1) % props.projects.length])

function onKey(e) {
  if (e.key === 'ArrowLeft') emit('select', prev.value)
  if (e.key === 'ArrowRight') emit('select', next.value)
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onKey)
  gsap.from('.viewer-inner', { opacity: 0, y: 40, duration: 0.6, ease: 'power3.out' })
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div class="viewer" role="dialog" aria-modal="true" :aria-label="project.title" @click.self="emit('close')">
    <button class="close" aria-label="Fermer" @click="emit('close')">
      <svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
        <path d="M9.73 1.09a.25.25 0 0 0-.35 0L5 5.47.62 1.09a.25.25 0 0 0-.35.35L4.65 5.82.27 10.2a.25.25 0 0 0 .35.35L5 6.18l4.38 4.37a.25.25 0 0 0 .35-.35L5.35 5.82l4.38-4.38a.25.25 0 0 0 0-.35z" />
      </svg>
    </button>

    <div class="viewer-inner">
      <div class="image-wrap">
        <img :src="project.image" :alt="`Aperçu du site ${project.title}`" loading="lazy" />
      </div>

      <div class="info">
        <div class="top">
          <span class="index">{{ String(index + 1).padStart(2, '0') }} / {{ projects.length }}</span>
          <span class="type" :class="project.type">{{ project.type }}</span>
          <span v-if="project.year" class="year">{{ project.year }}</span>
        </div>
        <h1>{{ project.title }}</h1>
        <p class="role">{{ project.role }}</p>
        <p class="description">{{ project.description }}</p>
        <div class="tags">
          <span v-for="tag in project.stack" :key="tag">{{ tag }}</span>
        </div>
        <a
          v-if="project.url"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="visit"
        >
          visiter le site
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </a>
      </div>

      <div class="nav">
        <button type="button" @click="emit('select', prev)">← {{ prev.title }}</button>
        <button type="button" @click="emit('select', next)">{{ next.title }} →</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.viewer {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(24px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--grid-margin);
}

.close {
  position: fixed;
  top: var(--grid-margin);
  right: var(--grid-margin);
  width: 48rem;
  height: 48rem;
  border-radius: 50%;
  background: var(--color-pop-green);
  color: var(--color-bg-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 110;
  transition: transform 0.2s ease;
}

.close:hover { transform: scale(0.92); }
.close:focus-visible { outline: 2px solid var(--color-white); outline-offset: 3px; }

.viewer-inner {
  width: min(1100px, 100%);
  max-height: calc(100dvh - var(--grid-margin) * 2);
  overflow-y: auto;
}

.image-wrap {
  border-radius: var(--radius-l);
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
  margin-bottom: var(--gap-m);
}

.image-wrap img { width: 100%; height: auto; }

.top {
  display: flex;
  align-items: center;
  gap: 12rem;
  margin-bottom: 12rem;
  flex-wrap: wrap;
}

.index {
  font-size: 14rem;
  opacity: 0.5;
  font-variant-numeric: tabular-nums;
}

.type {
  font-size: 12rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 4rem 10rem;
  border-radius: 50rem;
  background: var(--color-white20);
}

.type.shopify { background: #95bf4725; color: #95bf47; }
.type.web { background: #6ec8ff25; color: #6ec8ff; }

.year {
  font-size: 12rem;
  opacity: 0.45;
}

h1 {
  font-size: clamp(36px, 6vw, 64rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  margin-bottom: 8rem;
}

.role {
  font-size: 16rem;
  color: var(--color-pop-green);
  margin-bottom: 16rem;
  font-weight: 500;
}

.description {
  font-size: 18rem;
  line-height: 1.55;
  opacity: 0.75;
  margin-bottom: 20rem;
  max-width: 65ch;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rem;
  margin-bottom: 24rem;
}

.tags span {
  font-size: 13rem;
  padding: 6rem 14rem;
  border-radius: 50rem;
  border: 1px solid var(--color-white20);
  opacity: 0.7;
}

.visit {
  display: inline-flex;
  align-items: center;
  gap: 8rem;
  background: var(--color-white);
  color: var(--color-bg-dark);
  font-size: 15rem;
  font-weight: 500;
  padding: 12rem 20rem;
  border-radius: 50rem;
  transition: transform 0.2s ease;
}

.visit:hover { transform: scale(0.97); }

.nav {
  display: flex;
  justify-content: space-between;
  gap: 16rem;
  padding-top: var(--gap-m);
  border-top: 1px solid var(--color-white20);
}

.nav button {
  font-size: 14rem;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  max-width: 45%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav button:hover { opacity: 1; }
</style>
