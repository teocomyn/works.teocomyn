<script setup>
import { watch } from 'vue'

const open = defineModel('open', { type: Boolean, default: false })
const emit = defineEmits(['navigate'])

const links = [
  { id: 'home', label: 'projets' },
  { id: 'about', label: 'à propos' },
  { id: 'contact', label: 'contact', href: 'mailto:contact@teocomyn.com' },
]

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/teocomyn', icon: 'in' },
  { label: 'Malt', href: 'https://www.malt.fr/profile/teocomyn', icon: 'mt' },
  { label: 'Site', href: 'https://teocomyn.com', icon: 'www' },
]

watch(open, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})

function onLink(link) {
  if (link.href) {
    window.open(link.href, link.href.startsWith('mailto') ? '_self' : '_blank')
    return
  }
  emit('navigate', link.id)
  open.value = false
}
</script>

<template>
  <nav class="nav">
    <div class="toggle-wrap">
      <button
        class="menu-btn"
        :class="{ opened: open }"
        :aria-expanded="open"
        @click="open = !open"
      >
        <span class="letters">
          <span v-for="l in 'menu'" :key="l" class="letter">{{ l }}</span>
        </span>
      </button>

      <button
        class="close-btn"
        :class="{ opened: open }"
        aria-label="Fermer le menu"
        @click="open = false"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
          <path d="M9.73 1.09a.25.25 0 0 0-.35 0L5 5.47.62 1.09a.25.25 0 0 0-.35.35L4.65 5.82.27 10.2a.25.25 0 0 0 .35.35L5 6.18l4.38 4.37a.25.25 0 0 0 .35-.35L5.35 5.82l4.38-4.38a.25.25 0 0 0 0-.35z" />
        </svg>
      </button>
    </div>

    <div class="panel-bg" :class="{ opened: open }" />
    <div class="panel" :class="{ opened: open }">
      <div class="panel-inner">
        <div class="links" :class="{ opened: open }">
          <div v-for="link in links" :key="link.id" class="link" @click="onLink(link)">
            <span>{{ link.label }}</span>
          </div>
        </div>
        <div class="footer" :class="{ opened: open }">
          <a href="mailto:contact@teocomyn.com">contact@teocomyn.com</a>
          <div class="socials">
            <a
              v-for="s in socials"
              :key="s.label"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              class="social"
              :aria-label="s.label"
            >{{ s.icon }}</a>
          </div>
        </div>
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

.toggle-wrap {
  position: relative;
  z-index: 35;
  width: fit-content;
  height: 48rem;
}

.menu-btn {
  display: flex;
  align-items: center;
  height: 48rem;
  background: var(--color-white);
  color: var(--color-bg-dark);
  font-size: 18rem;
  font-weight: 500;
  padding: 15rem 48rem 15rem 15rem;
  border-radius: 100rem;
}

.menu-btn.opened { pointer-events: none; }

.letters {
  display: flex;
  gap: 1rem;
  transition: opacity 0.2s ease 0.35s, transform 0.2s ease 0.35s;
}

.menu-btn.opened .letters {
  opacity: 0;
  transform: translateX(5px);
  transition-delay: 0s;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 15rem;
  z-index: 36;
  width: 48rem;
  height: 48rem;
  border-radius: 24rem;
  background: var(--color-bg-dark);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0.125);
  transform-origin: top right;
  pointer-events: none;
  transition: transform 0.8s var(--ease-spring), right 0.8s var(--ease-spring);
}

.close-btn.opened {
  transform: scale(1);
  right: 20rem;
  pointer-events: auto;
}

.close-btn svg {
  opacity: 0;
  transform: rotate(-45deg);
  transition: opacity 0.3s ease, transform 0.5s ease;
}

.close-btn.opened svg {
  opacity: 1;
  transform: rotate(0);
}

.panel-bg,
.panel {
  position: fixed;
  top: var(--grid-margin);
  right: var(--grid-margin);
  width: 87rem;
  height: 48rem;
  border-radius: 24rem;
  overflow: hidden;
  transition: width 0.9s var(--ease-spring), height 1s var(--ease-spring), border-radius 0.9s ease;
  pointer-events: none;
}

.panel-bg { z-index: 15; background: var(--color-white); }
.panel { z-index: 20; color: var(--color-bg-dark); }

.panel-bg.opened,
.panel.opened {
  width: min(520px, calc(100vw - var(--grid-margin) * 2));
  height: calc(100dvh - var(--grid-margin) * 2);
  border-radius: 16rem;
  pointer-events: auto;
}

.panel-inner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: var(--gap-20) 45rem;
}

.links .link {
  font-size: clamp(40px, 8vw, 80rem);
  font-weight: 500;
  letter-spacing: -0.05em;
  line-height: 1;
  cursor: pointer;
  position: relative;
  width: fit-content;
  margin-bottom: var(--gap-s);
  transition: padding-left 0.5s var(--ease-spring);
}

@media (hover: hover) {
  .links .link:hover { padding-left: 40rem; }
  .links .link:hover::before {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
}

.links .link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 24rem;
  height: 24rem;
  border-radius: 24rem;
  background: var(--color-bg-dark);
  opacity: 0;
  transform: translateY(-50%) scale(0);
  transition: transform 0.5s var(--ease-spring), opacity 0.5s var(--ease-spring);
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: var(--gap-20) 45rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20rem;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s;
}

.footer.opened { opacity: 1; transform: translateY(0); }
.footer a { font-size: 16rem; font-weight: 500; }
.socials { display: flex; gap: 8rem; }

.social {
  width: 48rem;
  height: 48rem;
  border-radius: 50%;
  background: var(--color-bg-dark);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11rem;
  font-weight: 600;
  text-transform: uppercase;
  transition: transform 0.3s ease, background 0.3s ease;
}

.social:hover {
  transform: scale(0.92);
  background: var(--color-grey);
  color: var(--color-black);
}
</style>
