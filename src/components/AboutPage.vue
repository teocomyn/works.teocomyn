<script setup>
import { stats } from '../data/projects.js'

defineEmits(['back'])

const testimonials = [
  {
    quote: 'Collaboration fluide, livrables clairs et focus sur des résultats mesurables. Le profil qu\'il faut à côté d\'une équipe e-commerce.',
    author: 'Cliente — Studio Boucle Paris',
  },
]

const timeline = [
  { year: '2018', label: 'Spécialisation Shopify exclusive' },
  { year: '2021', label: '40+ marques accompagnées' },
  { year: '2024', label: 'Fondation Experaise — agence Shopify' },
  { year: '2026', label: '60+ projets livrés — CRO, SEO, Liquid' },
]
</script>

<template>
  <div class="about">
    <button class="back" @click="$emit('back')">← retour</button>

    <div class="content">
      <p class="eyebrow">à propos</p>
      <h1>Teo Comyn</h1>
      <p class="lead">
        Consultant Shopify freelance basé à Arras. J'accompagne des marques ambitieuses sur
        l'UX, la conversion, le SEO technique et le développement Liquid — sans intermédiaire agence.
      </p>

      <div class="stats">
        <div class="stat">
          <span class="num">60+</span>
          <span class="label">marques accompagnées</span>
        </div>
        <div class="stat">
          <span class="num">{{ stats.shopify }}</span>
          <span class="label">boutiques Shopify</span>
        </div>
        <div class="stat">
          <span class="num">2018</span>
          <span class="label">Shopify exclusif</span>
        </div>
      </div>

      <div class="section">
        <h2>Expertise</h2>
        <ul>
          <li>Développement Shopify 2.0 & sections Liquid sur mesure</li>
          <li>CRO & UX e-commerce (A/B tests, parcours conversion)</li>
          <li>SEO technique (Core Web Vitals, maillage, sémantique)</li>
          <li>Sites web sur mesure & intégration front-end</li>
        </ul>
      </div>

      <div class="section">
        <h2>Parcours</h2>
        <div class="timeline">
          <div v-for="item in timeline" :key="item.year" class="tl-item">
            <span class="tl-year">{{ item.year }}</span>
            <span class="tl-label">{{ item.label }}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Clients</h2>
        <p class="clients">
          Nutripure, Felco, La Pelucherie, On The Wild Side, Profitys, Nüssa Cosmetics,
          Wazy, Piano LED, Studio Boucle Paris, Le Monde Sauvage, Sibylle de Tavernost,
          Hôtel d'Angleterre, et bien d'autres.
        </p>
      </div>

      <div v-for="t in testimonials" :key="t.author" class="quote">
        <p>« {{ t.quote }} »</p>
        <span>— {{ t.author }}</span>
      </div>

      <div class="actions">
        <a href="mailto:contact@teocomyn.com" class="cta">
          me contacter
          <span class="dot" />
        </a>
        <a href="https://teocomyn.com" target="_blank" rel="noopener" class="cta secondary">
          teocomyn.com
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: var(--color-bg-dark);
  overflow-y: auto;
  padding: calc(var(--grid-margin) + 60rem) var(--grid-margin) var(--grid-margin);
}

.back {
  position: fixed;
  top: var(--grid-margin);
  left: var(--grid-margin);
  font-size: 16rem;
  font-weight: 500;
  opacity: 0.6;
  z-index: 60;
  transition: opacity 0.2s;
}

.back:hover { opacity: 1; }

.content { max-width: 720px; margin: 0 auto; }

.eyebrow {
  font-size: 14rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  opacity: 0.4;
  margin-bottom: 16rem;
}

h1 {
  font-size: clamp(48px, 10vw, 96rem);
  font-weight: 600;
  letter-spacing: -0.05em;
  margin-bottom: 24rem;
}

.lead {
  font-size: 22rem;
  line-height: 1.5;
  opacity: 0.75;
  margin-bottom: 48rem;
  letter-spacing: -0.02em;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24rem;
  margin-bottom: 56rem;
}

.stat {
  padding: 24rem;
  border-radius: var(--radius-l);
  background: var(--color-bg-grey);
}

.num {
  display: block;
  font-size: 48rem;
  font-weight: 600;
  color: var(--color-pop-green);
  letter-spacing: -0.04em;
}

.label {
  font-size: 14rem;
  opacity: 0.5;
  margin-top: 4rem;
  display: block;
}

.section { margin-bottom: 40rem; }

.section h2 {
  font-size: 14rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  opacity: 0.4;
  margin-bottom: 16rem;
}

.section ul { list-style: none; padding: 0; margin: 0; }

.section li {
  font-size: 18rem;
  padding: 10rem 0;
  border-bottom: 1px solid var(--color-white20);
  opacity: 0.8;
}

.timeline { display: flex; flex-direction: column; gap: 16rem; }

.tl-item {
  display: grid;
  grid-template-columns: 60rem 1fr;
  gap: 16rem;
  align-items: baseline;
}

.tl-year {
  font-size: 14rem;
  font-weight: 600;
  color: var(--color-pop-green);
}

.tl-label { font-size: 17rem; opacity: 0.8; }

.clients {
  font-size: 18rem;
  line-height: 1.6;
  opacity: 0.7;
}

.quote {
  padding: 24rem;
  border-left: 3px solid var(--color-pop-green);
  margin-bottom: 32rem;
  opacity: 0.8;
}

.quote p { font-size: 17rem; line-height: 1.5; font-style: italic; }
.quote span { display: block; margin-top: 12rem; font-size: 14rem; opacity: 0.5; }

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12rem;
  margin-top: 16rem;
}

.cta {
  display: inline-flex;
  align-items: center;
  gap: 8rem;
  background: var(--color-white);
  color: var(--color-bg-dark);
  font-size: 18rem;
  font-weight: 500;
  padding: 14rem 22rem;
  border-radius: 50rem;
  transition: transform 0.2s ease;
}

.cta.secondary {
  background: transparent;
  color: var(--color-white);
  border: 1px solid var(--color-white20);
}

.cta:hover { transform: scale(0.97); }

.cta .dot {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background: var(--color-bg-dark);
}

@media screen and (max-width: 600px) {
  .stats { grid-template-columns: 1fr; }
}
</style>
