<script setup>
import { watch } from 'vue'

const open = defineModel('open', { type: Boolean, default: false })
const emit = defineEmits(['navigate'])

const WHATSAPP_URL =
  'https://api.whatsapp.com/send/?phone=33640189932'
  + '&text=Bonjour+Teo%2C+je+te+contacte+depuis+ton+portfolio+pour+%C3%A9changer+sur+mon+projet.'
  + '&type=phone_number&app_absent=0'

const links = [
  { id: 'home', label: 'projets', num: '01' },
  { id: 'about', label: 'à propos', num: '02' },
  { id: 'contact', label: 'contact', num: '03', href: WHATSAPP_URL, external: true },
]

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/teocomyn' },
  { label: 'Malt', href: 'https://www.malt.fr/profile/teocomyn' },
  { label: 'teocomyn.com', href: 'https://teocomyn.com' },
]

watch(open, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})

function onLink(link) {
  if (link.href) {
    window.open(link.href, '_blank', 'noopener,noreferrer')
    open.value = false
    return
  }
  emit('navigate', link.id)
  open.value = false
}
</script>

<template>
  <nav class="nav" :class="{ open }">
    <div class="backdrop" aria-hidden="true" @click="open = false" />

    <div class="shell">
      <button
        class="toggle"
        :aria-expanded="open"
        :aria-label="open ? 'Fermer le menu' : 'Ouvrir le menu'"
        @click="open = !open"
      >
        <span class="toggle-icon" aria-hidden="true">
          <span class="bar bar-1" />
          <span class="bar bar-2" />
        </span>
        <span class="toggle-label">menu</span>
        <span class="toggle-glow" aria-hidden="true" />
      </button>

      <div class="panel">
        <div class="panel-grain" aria-hidden="true" />
        <div class="panel-accent" aria-hidden="true" />

        <header class="panel-head">
          <div class="panel-brand">
            <img src="/logo.gif" alt="" class="panel-logo" />
            <div>
              <p class="panel-name">Teo Comyn</p>
              <p class="panel-role">dev web & shopify</p>
            </div>
          </div>
          <span class="panel-count">{{ String(links.length).padStart(2, '0') }}</span>
        </header>

        <ul class="panel-links">
          <li
            v-for="(link, i) in links"
            :key="link.id"
            class="link-item"
            :style="{ '--i': i }"
          >
            <button type="button" class="link" @click="onLink(link)">
              <span class="link-num">{{ link.num }}</span>
              <span class="link-label">{{ link.label }}</span>
              <span class="link-arrow" aria-hidden="true">→</span>
            </button>
          </li>
        </ul>

        <footer class="panel-foot">
          <div class="contact-block">
            <a :href="WHATSAPP_URL" target="_blank" rel="noopener noreferrer" class="contact-primary">
              WhatsApp
              <span class="contact-dot" />
            </a>
            <a href="mailto:contact@teocomyn.com" class="contact-secondary">
              contact@teocomyn.com
            </a>
          </div>
          <div class="socials">
            <a
              v-for="s in socials"
              :key="s.label"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              class="social"
            >{{ s.label }}</a>
          </div>
        </footer>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  position: fixed;
  top: var(--grid-margin);
  right: var(--grid-margin);
  z-index: 40;
}

/* ── Backdrop ── */
.backdrop {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: rgba(0, 0, 0, 0);
  pointer-events: none;
  transition: background 0.6s ease;
}

.nav.open .backdrop {
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  pointer-events: auto;
}

/* ── Shell ── */
.shell {
  position: relative;
  display: flex;
  justify-content: flex-end;
}

/* ── Toggle button ── */
.toggle {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 12rem;
  height: 52rem;
  padding: 0 22rem 0 18rem;
  border-radius: 100rem;
  background: rgba(10, 10, 10, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: var(--color-white);
  font-size: 15rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: lowercase;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  overflow: hidden;
  transition:
    background 0.4s ease,
    border-color 0.4s ease,
    box-shadow 0.4s ease,
    color 0.4s ease;
}

.toggle:hover {
  border-color: rgba(33, 255, 192, 0.45);
  box-shadow: 0 0 28px rgba(33, 255, 192, 0.12);
}

.nav.open .toggle {
  background: var(--color-white);
  color: var(--color-bg-dark);
  border-color: transparent;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

.toggle-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, rgba(33, 255, 192, 0.15), transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.toggle:hover .toggle-glow {
  opacity: 1;
}

.toggle-icon {
  position: relative;
  width: 18rem;
  height: 12rem;
  flex-shrink: 0;
}

.bar {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1.5px;
  background: currentColor;
  border-radius: 2px;
  transition: transform 0.45s var(--ease-spring), top 0.45s var(--ease-spring), opacity 0.3s ease;
}

.bar-1 { top: 1px; }
.bar-2 { top: 10px; width: 70%; }

.nav.open .bar-1 {
  top: 5px;
  transform: rotate(45deg);
}

.nav.open .bar-2 {
  top: 5px;
  width: 100%;
  transform: rotate(-45deg);
}

.toggle-label {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.nav.open .toggle-label {
  opacity: 0;
  transform: translateX(6px);
  width: 0;
  overflow: hidden;
}

/* ── Panel ── */
.panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 52rem;
  height: 52rem;
  border-radius: 26rem;
  background: #0e0e0e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
  transition:
    width 0.85s var(--ease-spring),
    height 0.9s var(--ease-spring),
    border-radius 0.7s ease,
    opacity 0.3s ease;
}

.nav.open .panel {
  width: min(440px, calc(100vw - var(--grid-margin) * 2));
  height: min(580px, calc(100dvh - var(--grid-margin) * 2 - 20rem));
  border-radius: 20rem;
  opacity: 1;
  pointer-events: auto;
}

.panel-grain {
  position: absolute;
  inset: 0;
  opacity: 0.06;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 128px;
}

.panel-accent {
  position: absolute;
  top: -80rem;
  right: -80rem;
  width: 240rem;
  height: 240rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(33, 255, 192, 0.18) 0%, transparent 70%);
  pointer-events: none;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 72rem 28rem 24rem;
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.4s ease 0.15s, transform 0.5s var(--ease-spring) 0.15s;
}

.nav.open .panel-head {
  opacity: 1;
  transform: translateY(0);
}

.panel-brand {
  display: flex;
  align-items: center;
  gap: 12rem;
}

.panel-logo {
  width: 40rem;
  height: 40rem;
  object-fit: contain;
  border-radius: 50%;
}

.panel-name {
  font-size: 15rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-white);
}

.panel-role {
  font-size: 12rem;
  opacity: 0.45;
  margin-top: 2rem;
  text-transform: lowercase;
}

.panel-count {
  font-size: 12rem;
  font-weight: 500;
  opacity: 0.3;
  letter-spacing: 0.1em;
}

/* ── Links ── */
.panel-links {
  list-style: none;
  margin: 0;
  padding: 8rem 16rem;
}

.link-item {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 0.45s ease calc(0.2s + var(--i) * 0.07s),
    transform 0.55s var(--ease-spring) calc(0.2s + var(--i) * 0.07s);
}

.nav.open .link-item {
  opacity: 1;
  transform: translateY(0);
}

.link {
  display: flex;
  align-items: center;
  gap: 16rem;
  width: 100%;
  padding: 14rem 12rem;
  border-radius: 12rem;
  text-align: left;
  color: var(--color-white);
  transition: background 0.25s ease, padding-left 0.4s var(--ease-spring);
}

@media (hover: hover) {
  .link:hover {
    background: rgba(255, 255, 255, 0.05);
    padding-left: 20rem;
  }

  .link:hover .link-num {
    color: var(--color-pop-green);
  }

  .link:hover .link-arrow {
    opacity: 1;
    transform: translateX(0);
  }
}

.link-num {
  font-size: 13rem;
  font-weight: 500;
  opacity: 0.35;
  letter-spacing: 0.05em;
  min-width: 24rem;
  transition: color 0.25s ease;
}

.link-label {
  flex: 1;
  font-size: clamp(28px, 6vw, 42rem);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 1;
  text-transform: lowercase;
}

.link-arrow {
  font-size: 20rem;
  opacity: 0;
  transform: translateX(-8px);
  color: var(--color-pop-green);
  transition: opacity 0.3s ease, transform 0.4s var(--ease-spring);
}

/* ── Footer ── */
.panel-foot {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rem 28rem 28rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.45s ease 0.35s, transform 0.5s ease 0.35s;
}

.nav.open .panel-foot {
  opacity: 1;
  transform: translateY(0);
}

.contact-block {
  display: flex;
  flex-direction: column;
  gap: 6rem;
  margin-bottom: 16rem;
}

.contact-primary {
  display: inline-flex;
  align-items: center;
  gap: 8rem;
  font-size: 15rem;
  font-weight: 600;
  color: var(--color-white);
  width: fit-content;
  transition: color 0.2s ease;
}

.contact-primary:hover {
  color: var(--color-pop-green);
}

.contact-dot {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background: var(--color-pop-green);
  box-shadow: 0 0 8px var(--color-pop-green);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.contact-secondary {
  font-size: 13rem;
  opacity: 0.4;
  transition: opacity 0.2s ease;
}

.contact-secondary:hover {
  opacity: 0.75;
}

.socials {
  display: flex;
  flex-wrap: wrap;
  gap: 8rem;
}

.social {
  font-size: 12rem;
  font-weight: 500;
  padding: 8rem 14rem;
  border-radius: 100rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.7);
  transition: border-color 0.25s ease, color 0.25s ease, background 0.25s ease;
}

.social:hover {
  border-color: rgba(33, 255, 192, 0.4);
  color: var(--color-pop-green);
  background: rgba(33, 255, 192, 0.06);
}

@media screen and (max-width: 900px) {
  .nav.open .panel {
    width: calc(100vw - var(--grid-margin) * 2);
    height: calc(100dvh - var(--grid-margin) * 2);
  }

  .link-label {
    font-size: 32rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .link-item,
  .panel-head,
  .panel-foot,
  .panel,
  .bar,
  .toggle-label {
    transition: none;
  }

  .nav.open .link-item,
  .nav.open .panel-head,
  .nav.open .panel-foot {
    opacity: 1;
    transform: none;
  }

  .contact-dot {
    animation: none;
  }
}
</style>
