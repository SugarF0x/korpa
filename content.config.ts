import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    items: defineCollection({
      type: 'page',
      source: 'items/**',
    }),
    places: defineCollection({
      type: 'page',
      source: 'places/**',
    })
  },
})
