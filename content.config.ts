import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    items: defineCollection({
      type: 'page',
      source: 'items/**',
      schema: z.object({
        image: z.string().url(),
        rating: z.number().min(0).max(10)
      })
    }),
    places: defineCollection({
      type: 'page',
      source: 'places/**',
    })
  },
})
