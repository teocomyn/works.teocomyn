<script setup>
defineProps({
  projects: { type: Array, required: true },
})

const emit = defineEmits(['select'])
</script>

<template>
  <main class="list">
    <article
      v-for="(project, i) in projects"
      :key="project.slug"
      class="project"
      :style="{ transitionDelay: `${Math.min(i, 12) * 0.02}s` }"
      @click="emit('select', project)"
    >
      <div class="thumb">
        <img :src="project.image" :alt="project.title" loading="lazy" />
      </div>
      <div class="meta">
        <p class="title">{{ project.title }}</p>
        <span class="category">{{ project.category }} · {{ project.year }}</span>
      </div>
    </article>
    <p v-if="projects.length === 0" class="empty">Aucun projet trouvé.</p>
  </main>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100dvh;
  padding: 0 var(--grid-margin) 160rem;
  width: 100%;
}

.project {
  display: grid;
  grid-template-columns: 120rem 1fr;
  align-items: center;
  gap: 24rem;
  width: min(700px, 100%);
  cursor: pointer;
  padding: 14rem 0;
  border-bottom: 1px solid var(--color-white20);
  transition: opacity 0.3s ease;
}

.thumb {
  border-radius: 10rem;
  overflow: hidden;
  aspect-ratio: 16/10;
  opacity: 0.7;
  transition: opacity 0.3s ease, transform 0.3s var(--ease-spring);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meta { text-align: left; }

.title {
  font-size: clamp(22px, 4vw, 36rem);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 1.1;
}

.category {
  display: block;
  font-size: 13rem;
  opacity: 0.35;
  margin-top: 6rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.empty {
  padding: 60rem 0;
  opacity: 0.4;
  font-size: 16rem;
}

@media (hover: hover) {
  .list:has(.project:hover) .project:not(:hover) { opacity: 0.35; }
  .project:hover { opacity: 1 !important; }
  .project:hover .thumb {
    opacity: 1;
    transform: scale(1.03);
  }
}

@media screen and (max-width: 600px) {
  .project {
    grid-template-columns: 80rem 1fr;
    gap: 16rem;
  }
}
</style>
