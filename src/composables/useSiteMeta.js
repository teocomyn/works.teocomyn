import { SITE_URL } from '../config/site.js'

const SITE_NAME = 'Teo Comyn'
const DEFAULT_DESC = 'Développeur Shopify & web freelance. 43+ boutiques et sites sur mesure pour des marques ambitieuses : CRO, UX, Liquid, SEO.'

export function useSiteMeta({ title, description, image, path = '/' } = {}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Portfolio`
  const desc = description || DEFAULT_DESC
  const url = `${SITE_URL}${path}`
  const img = image ? `${SITE_URL}${image}` : `${SITE_URL}/og-cover.jpg`

  document.title = fullTitle

  const setMeta = (name, content, prop = 'name') => {
    let el = document.querySelector(`meta[${prop}="${name}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(prop, name)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  setMeta('description', desc)
  setMeta('og:title', fullTitle, 'property')
  setMeta('og:description', desc, 'property')
  setMeta('og:url', url, 'property')
  setMeta('og:image', img, 'property')
  setMeta('og:type', 'website', 'property')
  setMeta('twitter:card', 'summary_large_image')
  setMeta('twitter:title', fullTitle)
  setMeta('twitter:description', desc)
  setMeta('twitter:image', img)

  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = url
}

export { SITE_URL, SITE_NAME, DEFAULT_DESC }
