<script setup>
defineProps({
  stats: { type: Object, required: true },
})

const skills = ['Shopify', 'Liquid', 'Vue', 'Three.js', 'UI/UX', 'E-commerce']
</script>

<template>
  <div class="dock">
    <div class="card">
      <div class="status">
        <span class="dot" />
        <span>disponible pour projets</span>
      </div>

      <div class="stats">
        <div class="stat">
          <strong>{{ stats.total }}</strong>
          <span>sites livrés</span>
        </div>
        <div class="divider" />
        <div class="stat">
          <strong>{{ stats.shopify }}</strong>
          <span>Shopify</span>
        </div>
        <div class="divider" />
        <div class="stat">
          <strong>{{ stats.web }}</strong>
          <span>sur mesure</span>
        </div>
      </div>

      <a href="mailto:contact@teocomyn.com" class="cta">
        me contacter
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </div>

    <div class="ticker" aria-hidden="true">
      <div class="ticker-track">
        <span v-for="n in 2" :key="n" class="ticker-content">
          <template v-for="(skill, i) in skills" :key="`${n}-${skill}`">
            {{ skill }}<span v-if="i < skills.length - 1" class="sep">•</span>
          </template>
          <span class="sep">•</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dock {
  position: fixed;
  bottom: var(--grid-margin);
  left: var(--grid-margin);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 12rem;
  max-width: min(320px, calc(100vw - var(--grid-margin) * 2));
}

.card {
  background: var(--color-white);
  color: var(--color-bg-dark);
  border-radius: 16rem;
  padding: 18rem 20rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
}

.status {
  display: flex;
  align-items: center;
  gap: 8rem;
  font-size: 12rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.7;
  margin-bottom: 16rem;
}

.dot {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  background: var(--color-pop-green);
  box-shadow: 0 0 8px var(--color-pop-green);
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.stats {
  display: flex;
  align-items: center;
  gap: 14rem;
  margin-bottom: 16rem;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stat strong {
  font-size: 28rem;
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1;
}

.stat span {
  font-size: 11rem;
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.divider {
  width: 1px;
  height: 32rem;
  background: rgba(10, 10, 10, 0.12);
  flex-shrink: 0;
}

.cta {
  display: inline-flex;
  align-items: center;
  gap: 8rem;
  font-size: 14rem;
  font-weight: 500;
  padding: 10rem 16rem;
  background: var(--color-bg-dark);
  color: var(--color-white);
  border-radius: 50rem;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.cta:hover {
  transform: scale(0.97);
  opacity: 0.9;
}

.ticker {
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.ticker-track {
  display: flex;
  width: max-content;
  animation: scroll 18s linear infinite;
}

.ticker-content {
  font-size: 12rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.35;
  white-space: nowrap;
  padding-right: 24rem;
}

.sep {
  margin: 0 10rem;
  opacity: 0.5;
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@media screen and (max-width: 900px) {
  .dock {
    transform: scale(0.88);
    transform-origin: bottom left;
  }

  .stats { gap: 10rem; }
  .stat strong { font-size: 22rem; }
}
</style>
