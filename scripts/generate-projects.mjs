import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectsDir = path.join(__dirname, '../public/projects')
const outFile = path.join(__dirname, '../src/data/projects.js')

const titleMap = {
  '112mode': '112 Mode',
  'amel-atelier': 'Amel Atelier',
  'amoses-clothing': "Amose's Clothing",
  'apoticari': 'Apoticari',
  'appart17': 'Appart 17',
  'arras-patrimoine': 'Arras Patrimoine',
  'artefiko': 'Artefiko',
  'bulles-signature': 'Bulles Signature',
  'champagne-amis-de-beauregard': 'Champagne Amis de Beauregard',
  'cosy-coffee': 'Cosy Coffee',
  'digit-solution': 'Digit Solution',
  'dossiers-criminels': 'Dossiers Criminels',
  'felco': 'Felco',
  'geep-for-good': 'Geep For Good',
  'hotel-angleterre-versailles': "Hôtel d'Angleterre Versailles",
  'hotel-jeu-de-paume': 'Hôtel du Jeu de Paume',
  'hytrape': 'Hytrape',
  'kyrent': 'Kyrent',
  'la-pelucherie': 'La Pelucherie',
  'laborantin': 'Laborantin',
  'le-monde-sauvage': 'Le Monde Sauvage',
  'locrillon': 'Locrillon',
  'lumihome': 'Lumihome',
  'maison-jearom': 'Maison Jearom',
  'nalisa': 'Nalisa',
  'neije': 'Neije',
  'novagla': 'Novagla',
  'novemlab': 'Novemlab',
  'nussa-cosmetics': 'Nüssa Cosmetics',
  'nutripure': 'Nutripure',
  'on-the-wild-side': 'On The Wild Side',
  'piano-led-shop': 'Piano LED',
  'pro-roc': 'Pro-Roc',
  'profitys': 'Profitys',
  'second-step': 'Second Step',
  'shopdermopro': 'Shop Dermopro',
  'sibylle-de-tavernost': 'Sibylle de Tavernost',
  'studio-boucle-paris': 'Studio Boucle Paris',
  'sublife': 'Sug Life Store',
  'table-festive': 'Table Festive',
  'themelioo': 'Thémélioo',
  'thomas-comyn-osteo': 'Thomas Comyn Ostéo',
  'wazy': 'Wazy',
}

const urlMap = {
  '112mode': 'https://112mode.com',
  'nutripure': 'https://www.nutripure.com',
  'felco': 'https://www.felco.com',
  'la-pelucherie': 'https://www.lapelucherie.com',
  'on-the-wild-side': 'https://www.onthewildside.fr',
  'profitys': 'https://www.profitys.com',
  'wazy': 'https://www.getwazy.com',
  'nussa-cosmetics': 'https://www.nussacosmetics.com',
  'piano-led-shop': 'https://www.pianoled.fr',
  'second-step': 'https://www.secondstep.fr',
  'hotel-angleterre-versailles': 'https://www.hotel-angleterre.com',
  'hotel-jeu-de-paume': 'https://www.jeudepaume-chantilly.com',
  'le-monde-sauvage': 'https://www.monde-sauvage.be',
  'studio-boucle-paris': 'https://www.studioboucleparis.com',
  'table-festive': 'https://www.tablefestive.com',
  'themelioo': 'https://www.themelioo.com',
  'sibylle-de-tavernost': 'https://www.sibylledetavernost.com',
  'shopdermopro': 'https://www.shopdermopro.com',
  'pro-roc': 'https://www.proroc.fr',
  'novagla': 'https://www.novagla.com',
  'hytrape': 'https://www.hytrape.com',
  'digit-solution': 'https://www.digit-solution.com',
  'kyrent': 'https://www.kyrent.fr',
  'arras-patrimoine': 'https://www.arras-patrimoine.fr',
  'dossiers-criminels': 'https://www.dossiers-criminels.com',
  'geep-for-good': 'https://www.geepforgood.com',
  'lumihome': 'https://www.lumihome.fr',
  'novemlab': 'https://www.novemlab.com',
  'laborantin': 'https://www.laborantin.fr',
  'locrillon': 'https://www.locrillon.com',
  'champagne-amis-de-beauregard': 'https://www.amisdebeauregard.com',
  'thomas-comyn-osteo': 'https://www.thomas-comyn-osteo.fr',
  'on-the-wild-side': 'https://onthewildside.fr',
}

const featured = new Set([
  'nutripure', 'felco', 'la-pelucherie', 'on-the-wild-side', 'profitys',
  'wazy', 'nussa-cosmetics', 'piano-led-shop', 'second-step', 'studio-boucle-paris',
])

const yearMap = {
  nutripure: 2023, felco: 2024, profitys: 2024, wazy: 2024, hytrape: 2023,
  'la-pelucherie': 2023, 'on-the-wild-side': 2022, 'studio-boucle-paris': 2024,
}

function describe(title, type) {
  if (type === 'shopify') {
    return `Conception et développement de la boutique Shopify ${title} : UX, sections sur mesure, performance et optimisation conversion.`
  }
  return `Création du site web ${title} : design, intégration front-end et expérience utilisateur sur mesure.`
}

function stackFor(type) {
  return type === 'shopify'
    ? ['Shopify', 'Liquid', 'JavaScript', 'CRO', 'SEO']
    : ['HTML/CSS', 'JavaScript', 'UI/UX', 'SEO', 'Performance']
}

const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith('.png')).sort()

const projects = files.map((filename) => {
  const m = filename.match(/^(.+)-creation-site-(shopify|web)-teo-comyn/)
  if (!m) return null
  const slug = m[1]
  const type = m[2]
  const title = titleMap[slug] || slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return {
    slug,
    title,
    type,
    category: type === 'shopify' ? 'E-commerce Shopify' : 'Site web sur mesure',
    tags: type === 'shopify' ? ['Shopify', 'E-commerce', 'CRO'] : ['Web', 'UI/UX', 'Sur mesure'],
    image: `/projects/${filename}`,
    url: urlMap[slug] || null,
    year: yearMap[slug] || (type === 'shopify' ? 2023 : 2024),
    description: describe(title, type),
    role: type === 'shopify' ? 'Développement Shopify & UX' : 'Développement web & intégration',
    stack: stackFor(type),
    featured: featured.has(slug),
  }
}).filter(Boolean)

projects.sort((a, b) => {
  if (a.featured !== b.featured) return a.featured ? -1 : 1
  return a.title.localeCompare(b.title, 'fr')
})

const stats = {
  total: projects.length,
  shopify: projects.filter((p) => p.type === 'shopify').length,
  web: projects.filter((p) => p.type === 'web').length,
}

const content = `// Auto-generated — run: node scripts/generate-projects.mjs
export const projects = ${JSON.stringify(projects, null, 2)}

export const stats = ${JSON.stringify(stats, null, 2)}

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug) ?? null
}
`

fs.writeFileSync(outFile, content)
console.log(`Generated ${projects.length} projects`)

const SITE_URL = process.env.VITE_SITE_URL || 'https://works.teocomyn.com'
const today = new Date().toISOString().slice(0, 10)

const urls = [
  { loc: `${SITE_URL}/`, priority: '1.0' },
  { loc: `${SITE_URL}/a-propos`, priority: '0.8' },
  ...projects.map((p) => ({
    loc: `${SITE_URL}/projet/${p.slug}`,
    priority: p.featured ? '0.9' : '0.7',
  })),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`

const sitemapPath = path.join(__dirname, '../public/sitemap.xml')
fs.writeFileSync(sitemapPath, sitemap)
console.log(`Generated sitemap with ${urls.length} URLs`)

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
fs.writeFileSync(path.join(__dirname, '../public/robots.txt'), robots)
