import { defineConfig } from 'astro/config'

// https://astro.build/config
import tailwind from '@astrojs/tailwind'
import.meta.env.NODE_VERSION = '18'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()]
})
