<script setup>
const filter = defineModel('filter', { type: String, default: 'all' })
const search = defineModel('search', { type: String, default: '' })

defineProps({
  stats: { type: Object, required: true },
})

const options = [
  { id: 'all', label: 'tous' },
  { id: 'shopify', label: 'shopify' },
  { id: 'web', label: 'web' },
]
</script>

<template>
  <div class="filters">
    <div class="tabs">
      <button
        v-for="opt in options"
        :key="opt.id"
        type="button"
        class="tab"
        :class="{ active: filter === opt.id }"
        @click="filter = opt.id"
      >
        {{ opt.label }}
        <span v-if="opt.id === 'all'" class="count">{{ stats.total }}</span>
        <span v-else-if="opt.id === 'shopify'" class="count">{{ stats.shopify }}</span>
        <span v-else class="count">{{ stats.web }}</span>
      </button>
    </div>
    <input
      v-model="search"
      type="search"
      class="search"
      placeholder="Rechercher un projet…"
      aria-label="Rechercher un projet"
    />
  </div>
</template>

<style scoped>
.filters {
  position: relative;
  z-index: 12;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rem;
  padding: calc(var(--grid-margin) + 80rem) var(--grid-margin) 0;
}

.tabs {
  display: flex;
  gap: 8rem;
  background: var(--color-bg-grey);
  padding: 6rem;
  border-radius: 50rem;
}

.tab {
  display: flex;
  align-items: center;
  gap: 8rem;
  padding: 10rem 18rem;
  border-radius: 50rem;
  font-size: 14rem;
  font-weight: 500;
  text-transform: lowercase;
  color: var(--color-white);
  opacity: 0.5;
  transition: opacity 0.2s ease, background 0.2s ease;
}

.tab.active {
  opacity: 1;
  background: var(--color-white);
  color: var(--color-bg-dark);
}

.count {
  font-size: 11rem;
  opacity: 0.6;
  font-variant-numeric: tabular-nums;
}

.search {
  width: min(400px, 100%);
  padding: 14rem 20rem;
  border-radius: 50rem;
  border: 1px solid var(--color-white20);
  background: var(--color-bg-grey);
  color: var(--color-white);
  font-size: 15rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.search:focus {
  border-color: var(--color-pop-green);
}

.search::placeholder {
  color: var(--color-white);
  opacity: 0.35;
}
</style>
