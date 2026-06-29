<script setup>
const mode = defineModel({ type: String, default: 'spiral' })
</script>

<template>
  <div class="switch">
    <div class="button" :class="{ active: mode === 'spiral' }">
      <button type="button" @click="mode = 'spiral'">
        <span>spirale</span><span>spirale</span>
      </button>
    </div>
    <span class="dot" />
    <div class="button" :class="{ active: mode === 'list' }">
      <button type="button" @click="mode = 'list'">
        <span>liste</span><span>liste</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.switch {
  position: fixed;
  top: calc(var(--grid-margin) + 15rem);
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 20rem;
}

.button {
  opacity: 0.4;
  transition: opacity 0.3s ease;
  min-width: 60rem;
}

.button:first-child { display: flex; justify-content: flex-end; }
.button.active { opacity: 1; }

.button button {
  position: relative;
  overflow: hidden;
  font-size: 18rem;
  font-weight: 500;
  color: var(--color-white);
  text-transform: lowercase;
}

.button button span {
  display: block;
  transition: transform 0.3s var(--ease-spring), opacity 0.3s ease;
  user-select: none;
}

.button button span:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  transform: translateY(-100%);
}

.button button:hover span:first-child,
.button.active button span:first-child {
  opacity: 0;
  transform: translateY(100%);
}

.button button:hover span:nth-child(2),
.button.active button span:nth-child(2) {
  opacity: 1;
  transform: translateY(0);
}

.dot {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  background: var(--color-white);
}
</style>
