# Teo Comyn — Portfolio

Portfolio immersif (spirale WebGL + vue liste) pour présenter 43 projets Shopify et web.

## Stack

- Vue 3 + Vite
- Three.js (spirale 3D)
- GSAP (animations)
- vue-router (URLs partageables `/projet/:slug`)

## Commandes

```bash
npm install
npm run dev          # http://localhost:5173
npm run generate     # régénère projects.js + sitemap.xml
npm run build        # build production (dist/)
npm run preview      # prévisualiser le build
```

## Déploiement (Vercel)

Ce portfolio est **séparé de [teocomyn.com](https://teocomyn.com)** — vit sur son propre domaine (sous-domaine ou nom dédié).

1. Push le dossier sur GitHub
2. [vercel.com/new](https://vercel.com/new) → importer le repo
3. Framework : **Vite** (détecté auto)
4. Build : `npm run build` — Output : `dist`
5. **Environment variable** (Settings → Environment Variables) :
   ```
   VITE_SITE_URL=https://ton-domaine.com
   ```
   Sans cette variable, le fallback est `https://portfolio-teocomyn.vercel.app`
6. Redéployer après avoir ajouté la variable (canonical, OG, sitemap)
7. Domaine custom : Vercel → Project → Domains → ajouter ton domaine

### Idées de domaine

- Sous-domaine : `works.teocomyn.com`, `portfolio.teocomyn.com`
- Nom dédié : `teocomyn.works`, `mode-teo.fr`, etc.
- En attendant : `*.vercel.app` (gratuit, immédiat)

### Lien depuis teocomyn.com

Ajouter un lien « Portfolio interactif » ou « Voir tous les projets » vers ce site — les deux se complètent.

## Structure

- `public/projects/` — captures des 43 projets
- `scripts/generate-projects.mjs` — génère `src/data/projects.js` + `public/sitemap.xml`
- `src/components/WebGLSpiral.vue` — expérience spirale (desktop)
- `src/views/HomeView.vue` — accueil, filtres, détail projet

## Contact

contact@teocomyn.com — [teocomyn.com](https://teocomyn.com)
