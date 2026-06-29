<script setup>
defineEmits(['click'])
</script>

<template>
  <button class="logo-wrap" aria-label="Accueil" @click="$emit('click')">
    <div class="logo">
      <img src="/logo.gif" alt="Teo Comyn" class="logo-img" />
    </div>
    <div class="tag">
      <svg class="star" viewBox="0 0 74 71" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="starGrad" x1="7" y1="65" x2="66" y2="6" gradientUnits="userSpaceOnUse">
            <stop offset="0.1" stop-color="#fdff6c" />
            <stop offset="1" stop-color="#21ffc0" />
          </linearGradient>
        </defs>
        <path fill="url(#starGrad)" d="m73 31.4-23.9-.2c-.8 0-1.2-1-.5-1.5L71.3 13c.4-.3.4-.8.2-1.2L69 8.5a.9.9 0 0 0-1.2-.1L45.3 24.8a.9.9 0 0 1-1.3-1l7.4-22.6a.9.9 0 0 0-.8-1.1L45.7 0c-.4 0-.7.2-.8.6l-8 24a.9.9 0 0 1-1.6.3L23.7 8.2a.9.9 0 0 0-1.2-.3l-5 3.6c-.4.3-.5.8-.2 1.2l11.6 17c.4.5 0 1.3-.8 1.3l-25.4-.2c-.4 0-.7.2-.9.6l-1.8 5c-.1.6.3 1.2.9 1.2l24 .2c.8 0 1.2 1 .5 1.6L1.6 56.8c-.4.2-.5.8-.2 1.2l2.3 3.5c.2.4.8.5 1.2.2l23.7-17.4a.9.9 0 0 1 1.4 1l-8.2 24.4c-.1.6.3 1.1.9 1.1l5.2.1c.4 0 .8-.2.9-.6l8.5-25.9a.9.9 0 0 1 1.5-.2L50.9 62c.3.4.8.5 1.3.2l5-3.9c.5-.3.5-.8.3-1.2L45.2 39.4A.9.9 0 0 1 46 38l25.6.2c.4 0 .7-.2.8-.6l1.5-5a.9.9 0 0 0-.8-1.1Z" />
      </svg>
      <span class="tag-text">web dev</span>
    </div>
  </button>
</template>

<style scoped>
.logo-wrap {
  position: fixed;
  top: var(--grid-margin);
  left: var(--grid-margin);
  z-index: 20;
  width: 64rem;
  height: 64rem;
}

.logo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: transform 0.2s ease;
  padding: 4rem;
}

.logo-wrap:hover .logo { transform: scale(0.95); }

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.tag {
  position: absolute;
  left: calc(100% + 8rem);
  top: 16rem;
  opacity: 0;
  transform: scale(0.5) translate(-10%, 0);
  transform-origin: left center;
  transition: opacity 0.2s ease, transform 0.5s var(--ease-spring);
  pointer-events: none;
}

.logo-wrap:hover .tag {
  opacity: 1;
  transform: scale(1) rotate(-5deg) translateY(-12rem);
}

.star {
  position: absolute;
  right: -12rem;
  top: -12rem;
  width: 32rem;
  z-index: -1;
}

.tag-text {
  display: block;
  background: var(--color-grey);
  color: var(--color-bg-dark);
  font-size: 14rem;
  font-weight: 600;
  padding: 8rem 14rem;
  border-radius: 8rem;
  white-space: nowrap;
}
</style>
