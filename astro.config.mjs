import { defineConfig } from 'astro/config'

// https://astro.build/config
import tailwind from '@astrojs/tailwind'

import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
	site: 'https://dollar-ve.pages.dev/',
  integrations: [
		tailwind(),
		sitemap()
	]

})
