import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = env.VITE_SITE_URL || 'https://works.teocomyn.com'

  return {
    plugins: [
      vue(),
      {
        name: 'html-site-url',
        transformIndexHtml(html) {
          return html.replaceAll('%VITE_SITE_URL%', siteUrl)
        },
      },
    ],
    server: { port: 5173, open: false },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three'],
            gsap: ['gsap'],
            vendor: ['vue', 'vue-router'],
          },
        },
      },
    },
  }
})
