<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { useReducedMotion } from '../composables/useReducedMotion.js'

const MUX_STREAM = 'https://stream.mux.com/9njY8qDfS02Uvbll018C8CK39p5EksK7mn02DDC1zYvppI.m3u8'

defineProps({
  progress: { type: Number, default: 0 },
})

const emit = defineEmits(['enter', 'progress'])

const { reduced } = useReducedMotion()

const root = ref(null)
const videoEl = ref(null)
const showButton = ref(false)
const videoReady = ref(false)
const exiting = ref(false)

const words = ['développeur', 'web', '&', 'créateur', 'shopify']
let hls = null
let progressInterval = null
let gsapCtx = null

async function initVideo() {
  const video = videoEl.value
  if (!video || reduced.value) return

  const play = () => {
    video.play().catch(() => {})
    videoReady.value = true
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = MUX_STREAM
    video.addEventListener('loadeddata', play, { once: true })
  } else {
    const { default: Hls } = await import('hls.js')
    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true })
      hls.loadSource(MUX_STREAM)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, play)
    }
  }
}

function runIntroAnimation() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.from('.video-layer', { scale: 1.12, duration: 2.4, ease: 'power2.out' }, 0)
    .from('.vignette', { opacity: 0, duration: 1.2 }, 0.2)
    .from('.loader-logo', { y: 48, opacity: 0, scale: 0.85, duration: 1.1, ease: 'power4.out' }, 0.35)
    .from('.logo-glow', { scale: 0.6, opacity: 0, duration: 1.4, ease: 'power2.out' }, 0.35)
    .from('.word', { y: '110%', opacity: 0, duration: 0.9, stagger: 0.07, ease: 'power4.out' }, 0.55)
    .from('.progress-track', { scaleX: 0, duration: 1, ease: 'power3.inOut' }, 0.85)
    .from('.corner', { opacity: 0, scale: 0.6, duration: 0.8, stagger: 0.06 }, 0.9)
    .from('.percentage', { opacity: 0, y: 12, duration: 0.6 }, 1)

  if (!reduced.value) {
    gsap.to('.grain', { opacity: 0.14, duration: 0.01 })
    gsap.fromTo('.scanline', { y: '-100%' }, { y: '200%', duration: 4, repeat: -1, ease: 'none' })
  }
}

function runStaticIntro() {
  gsap.set('.word', { opacity: 1, y: 0 })
  gsap.set('.loader-logo', { opacity: 1, y: 0, scale: 1 })
  gsap.set('.progress-track', { scaleX: 1 })
  gsap.set('.corner', { opacity: 0.5 })
  gsap.set('.percentage', { opacity: 1 })
}

function startProgress() {
  let p = 0
  progressInterval = setInterval(() => {
    p += Math.random() * 10 + 3
    if (p >= 100) {
      p = 100
      clearInterval(progressInterval)
      setTimeout(() => { showButton.value = true }, 400)
      gsap.from('.enter-btn', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' })
      gsap.from('.skip', { opacity: 0, duration: 0.5, delay: 0.15 })
    }
    emit('progress', Math.min(100, Math.round(p)))
  }, 100)
}

function enter() {
  if (exiting.value) return
  exiting.value = true

  const tl = gsap.timeline({
    onComplete: () => emit('enter'),
  })

  tl.to('.content', { y: -32, opacity: 0, duration: 0.55, ease: 'power2.in' })
    .to('.percentage', { opacity: 0, duration: 0.35 }, '<')
    .to('.corner', { opacity: 0, scale: 0.8, duration: 0.4 }, '<')
    .to('.video-layer', { scale: 1.2, opacity: 0, duration: 0.9, ease: 'power2.in' }, '-=0.2')
    .to('.iris', { scale: 1, duration: 1.1, ease: 'power4.in' }, '-=0.5')
    .to(root.value, { opacity: 0, duration: 0.3 }, '-=0.15')
}

onMounted(async () => {
  initVideo()
  await nextTick()
  gsapCtx = gsap.context(() => {
    if (reduced.value) runStaticIntro()
    else runIntroAnimation()
  }, root.value)
  startProgress()
})

onUnmounted(() => {
  clearInterval(progressInterval)
  gsapCtx?.revert()
  hls?.destroy()
})
</script>

<template>
  <div ref="root" class="loader" :class="{ exiting, 'video-ready': videoReady, reduced }">
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
      <div class="grain" />
      <div class="scanline" />
    </div>

    <div class="iris" aria-hidden="true" />

    <span v-for="n in 4" :key="n" class="corner" :class="`corner-${n}`" aria-hidden="true" />

    <div class="content">
      <div class="logo-wrap">
        <div class="logo-glow" aria-hidden="true" />
        <img src="/logo.gif" alt="" class="loader-logo" />
      </div>

      <p class="text" aria-label="développeur web & créateur shopify">
        <span v-for="(word, i) in words" :key="i" class="word-line">
          <span class="word-mask">
            <span class="word">{{ word }}</span>
          </span>
          <span v-if="i < words.length - 1" class="word-space">&nbsp;</span>
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
        <span class="enter-label">entrer</span>
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
      <span class="pct-num">{{ progress }}</span>
      <span class="pct-sym">%</span>
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
  background: var(--color-bg-dark);
}

/* ── Video background ── */
.video-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  will-change: transform, opacity;
}

.bg-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1.2s ease;
  filter: saturate(1.15) contrast(1.05) brightness(0.75);
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
    radial-gradient(ellipse 80% 60% at 50% 40%, #1a2a28 0%, transparent 70%),
    radial-gradient(ellipse 60% 50% at 70% 80%, #0d1f1a 0%, transparent 60%),
    linear-gradient(160deg, #0a0a0a 0%, #111916 50%, #0a0a0a 100%);
  transition: opacity 1.2s ease;
}

.video-ready .video-fallback {
  opacity: 0.25;
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.75) 100%);
  pointer-events: none;
}

.gradient-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(to bottom, rgba(10, 10, 10, 0.9) 0%, transparent 100%);
  pointer-events: none;
}

.gradient-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 45%;
  background: linear-gradient(to top, rgba(10, 10, 10, 0.95) 0%, transparent 100%);
  pointer-events: none;
}

.grain {
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  opacity: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  background-size: 128px 128px;
  animation: grain-shift 0.5s steps(2) infinite;
}

@keyframes grain-shift {
  0% { transform: translate(0, 0); }
  50% { transform: translate(-2%, -1%); }
  100% { transform: translate(1%, 2%); }
}

.scanline {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(33, 255, 192, 0.15), transparent);
  opacity: 0.6;
  pointer-events: none;
}

/* ── Iris exit wipe ── */
.iris {
  position: absolute;
  inset: 0;
  z-index: 50;
  background: var(--color-bg-dark);
  pointer-events: none;
  transform: scale(0);
  will-change: transform;
}

/* ── Corner brackets ── */
.corner {
  position: absolute;
  width: 32rem;
  height: 32rem;
  z-index: 5;
  opacity: 0.45;
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

/* ── Content ── */
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
  margin-bottom: 32rem;
}

.logo-glow {
  position: absolute;
  inset: -40%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(33, 255, 192, 0.25) 0%, transparent 70%);
  filter: blur(24px);
  pointer-events: none;
}

.loader-logo {
  position: relative;
  width: 88rem;
  height: 88rem;
  object-fit: contain;
  filter: drop-shadow(0 0 32px rgba(33, 255, 192, 0.2));
}

.text {
  font-size: clamp(18px, 4vw, 28rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.35;
  margin-bottom: 36rem;
  max-width: 90vw;
}

.word-line {
  display: inline;
}

.word-mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
}

.word {
  display: inline-block;
}

.word-space {
  display: inline;
}

/* ── Progress bar ── */
.progress-track {
  position: relative;
  width: min(280px, 70vw);
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin-bottom: 36rem;
  transform-origin: left center;
  overflow: visible;
}

.progress-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--color-pop-green), var(--color-pop-blue));
  transform-origin: left center;
  transform: scaleX(0);
}

.progress-glow {
  position: absolute;
  top: 50%;
  width: 6px;
  height: 6px;
  margin-left: -3px;
  margin-top: -3px;
  border-radius: 50%;
  background: var(--color-pop-green);
  box-shadow: 0 0 12px var(--color-pop-green), 0 0 24px rgba(33, 255, 192, 0.4);
  transition: left 0.15s ease-out;
}

/* ── Buttons ── */
.enter-btn {
  display: inline-flex;
  align-items: center;
  gap: 10rem;
  background: var(--color-white);
  color: var(--color-bg-dark);
  font-size: 18rem;
  font-weight: 500;
  padding: 16rem 28rem;
  border-radius: 50rem;
  opacity: 0;
  pointer-events: none;
  position: relative;
  overflow: hidden;
  transition: transform 0.25s var(--ease-expo-out), box-shadow 0.25s ease;
  box-shadow: 0 0 0 0 rgba(33, 255, 192, 0);
}

.enter-btn.show {
  opacity: 1;
  pointer-events: auto;
}

.enter-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(33, 255, 192, 0.15) 50%, transparent 60%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.enter-btn.show:hover {
  transform: scale(1.03);
  box-shadow: 0 0 32px rgba(33, 255, 192, 0.25);
}

.enter-btn.show:hover::before {
  transform: translateX(100%);
}

.enter-label {
  position: relative;
  z-index: 1;
}

.enter-btn .dot {
  position: relative;
  z-index: 1;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background: var(--color-bg-dark);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.7; }
}

.skip {
  margin-top: 20rem;
  font-size: 13rem;
  pointer-events: none;
  opacity: 0;
  text-decoration: underline;
  text-underline-offset: 4px;
  color: rgba(255, 255, 255, 0.35);
  transition: color 0.2s ease, opacity 0.3s ease;
}

.skip.show {
  opacity: 1;
  pointer-events: auto;
}

.skip:hover {
  color: rgba(255, 255, 255, 0.7);
}

/* ── Percentage ── */
.percentage {
  position: absolute;
  bottom: var(--grid-margin);
  left: var(--grid-margin);
  z-index: 10;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  display: flex;
  align-items: baseline;
  gap: 2rem;
  line-height: 1;
}

.pct-num {
  font-size: clamp(48px, 12vw, 96rem);
  letter-spacing: -0.05em;
  background: linear-gradient(180deg, var(--color-white) 0%, rgba(255, 255, 255, 0.35) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.pct-sym {
  font-size: clamp(20px, 4vw, 28rem);
  opacity: 0.35;
}

/* ── Reduced motion ── */
.reduced .grain,
.reduced .scanline {
  display: none;
}

.reduced .bg-video {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .grain,
  .scanline {
    display: none;
  }

  .enter-btn .dot {
    animation: none;
  }
}
</style>
