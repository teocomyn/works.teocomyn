<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projects, stats, getProjectBySlug } from '../data/projects.js'
import { useSiteMeta } from '../composables/useSiteMeta.js'
import { useReducedMotion, useIsMobile } from '../composables/useReducedMotion.js'
import Loader from '../components/Loader.vue'
import GridBackground from '../components/GridBackground.vue'
import HeaderLogo from '../components/HeaderLogo.vue'
import ViewSwitch from '../components/ViewSwitch.vue'
import MenuNav from '../components/MenuNav.vue'
import ProjectList from '../components/ProjectList.vue'
import ProjectViewer from '../components/ProjectViewer.vue'
import PortfolioBadge from '../components/PortfolioBadge.vue'
import ProjectFilters from '../components/ProjectFilters.vue'

const route = useRoute()
const router = useRouter()

const entered = ref(localStorage.getItem('tc-portfolio-entered') === '1')
const progress = ref(0)
const menuOpen = ref(false)
const activeIndex = ref(0)
const filter = ref('all')
const search = ref('')

const { reduced } = useReducedMotion()
const { mobile } = useIsMobile()

const mode = ref(localStorage.getItem('tc-portfolio-mode') || 'spiral')

watch(mobile, (m) => {
  if (m || reduced.value) mode.value = 'list'
}, { immediate: true })

watch(reduced, (r) => {
  if (r) mode.value = 'list'
})

watch(mode, (m) => {
  if (!mobile.value && !reduced.value) {
    localStorage.setItem('tc-portfolio-mode', m)
  }
})

const WebGLSpiral = ref(null)

onMounted(async () => {
  if (route.name === 'project' && route.params.slug) {
    const p = getProjectBySlug(route.params.slug)
    if (!p) router.replace({ name: 'home' })
  }

  if (!reduced.value && !mobile.value) {
    const mod = await import('../components/WebGLSpiral.vue')
    WebGLSpiral.value = mod.default
  }

  if (route.name === 'project' && route.params.slug) {
    const p = getProjectBySlug(route.params.slug)
    if (p) {
      useSiteMeta({ title: p.title, description: p.description, image: p.image, path: `/projet/${p.slug}` })
    }
  } else {
    useSiteMeta({ path: route.path })
  }

  window.addEventListener('keydown', onKeydown)
})

const filteredProjects = computed(() => {
  let list = projects
  if (filter.value !== 'all') list = list.filter((p) => p.type === filter.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.stack.some((s) => s.toLowerCase().includes(q)),
    )
  }
  return list
})

const selectedProject = computed({
  get: () => (route.name === 'project' ? getProjectBySlug(route.params.slug) : null),
  set: (p) => {
    if (p) router.push({ name: 'project', params: { slug: p.slug } })
    else if (route.name === 'project') router.push({ name: 'home' })
  },
})

const hoveredTitle = computed(() => filteredProjects.value[activeIndex.value]?.title ?? '')

function onEnter() {
  entered.value = true
  localStorage.setItem('tc-portfolio-entered', '1')
}

function openProject(project) {
  selectedProject.value = project
  const p = getProjectBySlug(project.slug)
  if (p) {
    useSiteMeta({
      title: p.title,
      description: p.description,
      image: p.image,
      path: `/projet/${p.slug}`,
    })
  }
}

function closeProject() {
  selectedProject.value = null
  useSiteMeta({ path: '/' })
}

function navigateTo(target) {
  menuOpen.value = false
  if (target === 'about') router.push({ name: 'about' })
  else router.push({ name: 'home' })
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    if (selectedProject.value) closeProject()
    else if (menuOpen.value) menuOpen.value = false
  }
}

watch(() => route.params.slug, (slug) => {
  if (slug && route.name === 'project') {
    const p = getProjectBySlug(slug)
    if (p) {
      useSiteMeta({ title: p.title, description: p.description, image: p.image, path: `/projet/${p.slug}` })
    } else {
      router.replace({ name: 'home' })
    }
  }
})

onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <GridBackground />

  <Loader
    v-if="!entered"
    :progress="progress"
    @enter="onEnter"
    @progress="progress = $event"
  />

  <template v-if="entered">
    <HeaderLogo @click="navigateTo('home')" />
    <ViewSwitch v-if="!mobile && !reduced" v-model="mode" />
    <MenuNav v-model:open="menuOpen" @navigate="navigateTo" />

    <component
      :is="WebGLSpiral"
      v-if="WebGLSpiral && mode === 'spiral' && !mobile && !reduced"
      :projects="filteredProjects"
      @select="openProject"
      @active-change="activeIndex = $event"
    />

    <template v-if="mode === 'list' || mobile || reduced">
      <ProjectFilters v-model:filter="filter" v-model:search="search" :stats="stats" />
      <ProjectList :projects="filteredProjects" @select="openProject" />
    </template>

    <PortfolioBadge :stats="stats" />

    <div
      v-if="mode === 'spiral' && !mobile && !reduced"
      class="project-hint"
      aria-live="polite"
    >
      <p class="scroll-hint">défiler</p>
      <transition name="fade" mode="out-in">
        <p :key="hoveredTitle" class="title">{{ hoveredTitle }}</p>
      </transition>
    </div>

    <ProjectViewer
      v-if="selectedProject"
      :project="selectedProject"
      :projects="projects"
      @close="closeProject"
      @select="openProject"
    />
  </template>
</template>

<style scoped>
.project-hint {
  position: fixed;
  bottom: var(--grid-margin);
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;
  pointer-events: none;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rem;
}

.project-hint .scroll-hint {
  font-size: 12rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.25;
  animation: pulse 2s ease-in-out infinite;
}

.project-hint .title {
  font-size: 14rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
  white-space: nowrap;
}

@keyframes pulse {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.4; }
}

@media (prefers-reduced-motion: reduce) {
  .project-hint .scroll-hint { animation: none; }
}
</style>
