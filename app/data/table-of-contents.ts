import type { PageCollectionItemBase } from "@nuxt/content"

export interface TableOfContentsItem {
  name: string
  id: string
}

export interface TableOfContents {
  category: string
  items: Array<TableOfContentsItem | TableOfContents>
}

export const isTableOfContents = (item: TableOfContentsItem | TableOfContents): item is TableOfContents => 'category' in item

export function generateTableOfContentsFromIDs(ids: string[], rootName = "Root") {
  const root: TableOfContents = { category: rootName, items: [] }

  for (const id of ids) {
    const parts = id.split('/')
    const name = parts.pop()
    if (!name) break

    let current = root
    for (const category of parts) {
      let child = current.items.find((item): item is TableOfContents => 'category' in item && item.category === category)

      if (!child) {
        child = { category, items: [] }
        current.items.push(child)
      }

      current = child
    }

    current.items.push({ name, id })
  }

  return root
}

export function generateTableOfContentsFromCollection(collection?: PageCollectionItemBase[], rootName?: string) {
  const ids = (collection ?? []).map(item => item.id.split('/').slice(2).join('/'))
  return generateTableOfContentsFromIDs(ids, rootName)
}
