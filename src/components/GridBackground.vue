<template>
  <svg class="grid-bg" width="1920" height="1200" viewBox="0 0 1920 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" patternUnits="userSpaceOnUse" width="50" height="50">
        <rect width="50" height="50" fill="none" stroke="white" stroke-opacity="0.06" />
      </pattern>
      <filter id="vignette" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="120" />
      </filter>
    </defs>
    <rect width="1920" height="1200" fill="url(#grid)" />
    <ellipse cx="960" cy="600" rx="700" ry="500" fill="#0A0A0A" filter="url(#vignette)" opacity="0.85" />
  </svg>
</template>

<style scoped>
.grid-bg {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.35;
  pointer-events: none;
  z-index: 0;
}
</style>
