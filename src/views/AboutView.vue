<script setup>
import AboutPage from '../components/AboutPage.vue'
import GridBackground from '../components/GridBackground.vue'
import { useSiteMeta } from '../composables/useSiteMeta.js'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  useSiteMeta({
    title: 'À propos',
    description: 'Teo Comyn — consultant Shopify freelance. CRO, UX, Liquid, SEO. 60+ marques accompagnées depuis 2018.',
    path: '/a-propos',
  })
})

function goHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <GridBackground />
  <AboutPage @back="goHome" />
</template>
