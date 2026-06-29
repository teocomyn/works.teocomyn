import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: 'Teo Comyn — Portfolio développeur Shopify & web' },
    },
    {
      path: '/a-propos',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'À propos — Teo Comyn' },
    },
    {
      path: '/projet/:slug',
      name: 'project',
      component: () => import('../views/HomeView.vue'),
      meta: { title: 'Projet — Teo Comyn' },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const base = 'Teo Comyn — Développeur Shopify & web'
  document.title = to.meta.title?.includes('Teo Comyn') ? to.meta.title : `${to.meta.title || base}`
})

export default router
