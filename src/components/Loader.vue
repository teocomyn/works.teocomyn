<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useReducedMotion } from '../composables/useReducedMotion.js'

const MUX_STREAM = 'https://stream.mux.com/9njY8qDfS02Uvbll018C8CK39p5EksK7mn02DDC1zYvppI.m3u8'

defineProps({
  progress: { type: Number, default: 0 },
})

const emit = defineEmits(['enter', 'progress'])

const { reduced } = useReducedMotion()

const videoEl = ref(null)
const showButton = ref(false)
const videoReady = ref(false)
const leaving = ref(false)

const words = ['développeur', 'web', '&', 'créateur', 'shopify']
let hls = null
let progressInterval = null
let leaveTimer = null

async function initVideo() {
  if (reduced.value) return
  const video = videoEl.value
  if (!video) return

  const onReady = () => {
    videoReady.value = true
    video.play().catch(() => {})
  }

  try {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = MUX_STREAM
      video.addEventListener('loadeddata', onReady, { once: true })
    } else {
      const { default: Hls } = await import('hls.js')
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true })
        hls.loadSource(MUX_STREAM)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, onReady)
        hls.on(Hls.Events.ERROR, () => { videoReady.value = false })
      }
    }
  } catch {
    videoReady.value = false
  }
}

function startProgress() {
  let p = 0
  progressInterval = setInterval(() => {
    p += Math.random() * 10 + 3
    if (p >= 100) {
      p = 100
      clearInterval(progressInterval)
      setTimeout(() => { showButton.value = true }, 350)
    }
    emit('progress', Math.min(100, Math.round(p)))
  }, 100)
}

function enter() {
  if (leaving.value) return
  leaving.value = true
  leaveTimer = setTimeout(() => emit('enter'), 750)
}

function onKeydown(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    if (showButton.value) enter()
  }
}

onMounted(() => {
  initVideo()
  startProgress()
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  clearInterval(progressInterval)
  clearTimeout(leaveTimer)
  window.removeEventListener('keydown', onKeydown)
  hls?.destroy()
})
</script>

<template>
  <div class="loader" :class="{ leaving, 'video-ready': videoReady, reduced }">
    <div class="video-layer" aria-hidden="true">
      <video
        ref="videoEl"
        class="bg-video"
        muted
        playsinline
        autoplay
        loop
        preload="auto"
      />
      <div class="video-fallback" />
      <div class="vignette" />
      <div class="gradient-top" />
      <div class="gradient-bottom" />
      <div v-if="!reduced" class="grain" />
    </div>

    <span v-for="n in 4" :key="n" class="corner" :class="`corner-${n}`" aria-hidden="true" />

    <div class="content">
      <div class="logo-wrap">
        <div class="logo-glow" aria-hidden="true" />
        <img src="/logo.gif" alt="" class="loader-logo" />
      </div>

      <p class="text" aria-label="développeur web & créateur shopify">
        <span
          v-for="(word, i) in words"
          :key="word + i"
          class="word-mask"
        >
          <span class="word" :style="{ animationDelay: `${0.45 + i * 0.07}s` }">{{ word }}</span>
        </span>
      </p>

      <div class="progress-track" aria-hidden="true">
        <div class="progress-fill" :style="{ transform: `scaleX(${progress / 100})` }" />
        <div class="progress-glow" :style="{ left: `${progress}%` }" />
      </div>

      <button
        class="enter-btn"
        :class="{ show: showButton }"
        :disabled="!showButton"
        @click="enter"
      >
        entrer
        <span class="dot" />
      </button>

      <button
        class="skip"
        :class="{ show: showButton }"
        :disabled="!showButton"
        @click="enter"
      >
        passer l'intro
      </button>
    </div>

    <p class="percentage" aria-hidden="true">
      <span class="pct-num">{{ progress }}</span><span class="pct-sym">%</span>
    </p>
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
  color: var(--color-white);
  overflow: hidden;
  background: #0a0a0a;
  transition: opacity 0.75s ease, transform 0.75s ease;
}

.loader.leaving {
  opacity: 0;
  transform: scale(1.04);
  pointer-events: none;
}

/* ── Video ── */
.video-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.bg-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1.4s ease;
  filter: saturate(1.1) contrast(1.05) brightness(0.7);
}

.video-ready .bg-video {
  opacity: 1;
}

.reduced .bg-video {
  display: none;
}

.video-fallback {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 35%, #1a2f28 0%, transparent 65%),
    radial-gradient(ellipse 50% 40% at 80% 70%, #0d1a16 0%, transparent 55%),
    linear-gradient(180deg, #0a0a0a 0%, #101816 50%, #0a0a0a 100%);
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 25%, rgba(0, 0, 0, 0.8) 100%);
  pointer-events: none;
}

.gradient-top,
.gradient-bottom {
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
}

.gradient-top {
  top: 0;
  height: 35%;
  background: linear-gradient(to bottom, rgba(10, 10, 10, 0.85), transparent);
}

.gradient-bottom {
  bottom: 0;
  height: 40%;
  background: linear-gradient(to top, rgba(10, 10, 10, 0.9), transparent);
}

.grain {
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  opacity: 0.1;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  background-size: 128px 128px;
  animation: grain-shift 0.6s steps(2) infinite;
}

@keyframes grain-shift {
  0% { transform: translate(0, 0); }
  50% { transform: translate(-2%, -1%); }
  100% { transform: translate(1%, 2%); }
}

/* ── Corners ── */
.corner {
  position: absolute;
  width: 28rem;
  height: 28rem;
  z-index: 2;
  opacity: 0.5;
  pointer-events: none;
}

.corner::before,
.corner::after {
  content: '';
  position: absolute;
  background: var(--color-pop-green);
}

.corner-1 { top: var(--grid-margin); left: var(--grid-margin); }
.corner-1::before { top: 0; left: 0; width: 100%; height: 1px; }
.corner-1::after { top: 0; left: 0; width: 1px; height: 100%; }

.corner-2 { top: var(--grid-margin); right: var(--grid-margin); }
.corner-2::before { top: 0; right: 0; width: 100%; height: 1px; }
.corner-2::after { top: 0; right: 0; width: 1px; height: 100%; }

.corner-3 { bottom: var(--grid-margin); left: var(--grid-margin); }
.corner-3::before { bottom: 0; left: 0; width: 100%; height: 1px; }
.corner-3::after { bottom: 0; left: 0; width: 1px; height: 100%; }

.corner-4 { bottom: var(--grid-margin); right: var(--grid-margin); }
.corner-4::before { bottom: 0; right: 0; width: 100%; height: 1px; }
.corner-4::after { bottom: 0; right: 0; width: 1px; height: 100%; }

/* ── Content — toujours visible, jamais opacity:0 par défaut ── */
.content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 var(--grid-margin);
}

.logo-wrap {
  position: relative;
  margin-bottom: 28rem;
  animation: logo-in 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}

@keyframes logo-in {
  from { transform: translateY(24px) scale(0.9); opacity: 0.5; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.logo-glow {
  position: absolute;
  inset: -50%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(33, 255, 192, 0.3) 0%, transparent 70%);
  filter: blur(28px);
  pointer-events: none;
}

.loader-logo {
  position: relative;
  width: 88rem;
  height: 88rem;
  object-fit: contain;
}

.text {
  font-size: clamp(20px, 4.5vw, 30rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.4;
  margin-bottom: 32rem;
  max-width: 92vw;
}

.word-mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  margin-right: 0.28em;
}

.word-mask:last-child {
  margin-right: 0;
}

.word {
  display: inline-block;
  animation: word-in 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes word-in {
  from { transform: translateY(110%); }
  to { transform: translateY(0); }
}

.progress-track {
  position: relative;
  width: min(300px, 75vw);
  height: 2px;
  background: rgba(255, 255, 255, 0.15);
  margin-bottom: 32rem;
  transform-origin: left center;
}

.progress-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--color-pop-green), var(--color-pop-blue));
  transform-origin: left center;
  transform: scaleX(0);
  transition: transform 0.12s ease-out;
}

.progress-glow {
  position: absolute;
  top: 50%;
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  border-radius: 50%;
  background: var(--color-pop-green);
  box-shadow: 0 0 16px var(--color-pop-green);
  transition: left 0.12s ease-out;
}

.enter-btn {
  display: inline-flex;
  align-items: center;
  gap: 10rem;
  background: #fafafa;
  color: #0a0a0a;
  font-size: 18rem;
  font-weight: 500;
  padding: 16rem 28rem;
  border-radius: 50rem;
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
}

.enter-btn.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.enter-btn.show:hover {
  box-shadow: 0 0 40px rgba(33, 255, 192, 0.35);
  transform: translateY(0) scale(1.03);
}

.enter-btn .dot {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background: #0a0a0a;
}

.skip {
  margin-top: 18rem;
  font-size: 13rem;
  opacity: 0;
  pointer-events: none;
  text-decoration: underline;
  text-underline-offset: 4px;
  color: rgba(255, 255, 255, 0.45);
  transition: opacity 0.4s ease 0.1s, color 0.2s ease;
}

.skip.show {
  opacity: 1;
  pointer-events: auto;
}

.skip:hover {
  color: rgba(255, 255, 255, 0.8);
}

.percentage {
  position: absolute;
  bottom: var(--grid-margin);
  left: var(--grid-margin);
  z-index: 10;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  animation: fade-in 0.8s ease 0.2s both;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.pct-num {
  font-size: clamp(56px, 14vw, 100rem);
  letter-spacing: -0.05em;
  color: rgba(255, 255, 255, 0.92);
}

.pct-sym {
  font-size: clamp(22px, 5vw, 32rem);
  color: rgba(255, 255, 255, 0.35);
  margin-left: 4rem;
}

@media (prefers-reduced-motion: reduce) {
  .grain { display: none; }
  .logo-wrap,
  .word,
  .percentage { animation: none; }
  .enter-btn.show { transition: none; }
}
</style>
