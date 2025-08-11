<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue"
import { useAsyncData } from "#app"
import { groupBy } from 'lodash'

const { data } = await useAsyncData('items', async () => {
  const items = await queryCollection('items').all()
  return items.map(item => ({
    ...item,
    category: item.id.split('/').filter(Boolean).slice(2,4).at(-2)
  }))
})

const toc = computed(() => {
  if (!data.value) return null
  return groupBy(data.value, item => item.category ?? 'общее')
})

const activeSections = ref(new Set())
let observer: IntersectionObserver

onMounted(() => {
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) activeSections.value.add(entry.target.id)
      else activeSections.value.delete(entry.target.id)
    }

    activeSections.value = new Set(activeSections.value)
  }, {
    root: null,
    rootMargin: "-10% 0px -10% 0px",
    threshold: [0, .5, 1]
  })

  for (const section of data.value ?? []) {
    const element = document.getElementById(section.id)
    if (element) observer.observe(element)
  }
})

onBeforeUnmount(() => { observer && observer.disconnect() })
</script>

<template>
  <div class="docs-container">
    <aside class="toc">
      <nav>
        <ul v-if="toc">
          <li
            v-for="category in Object.keys(toc)"
            :key="category"
          >
            <template v-if="toc[category]?.length">
              <h3>{{ category }}</h3>
              <ul>
                <li v-for="item in toc[category]" :key="item.id" :class="{ active: activeSections.has(item.id) }">
                  <a :href="`#${item.id}`">{{ item.title }}</a>
                </li>
              </ul>
            </template>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="content">
      <section
        v-for="section in data"
        :id="section.id"
        :key="section.id"
        class="doc-section"
      >
        <h2>{{ section.title }}</h2>
        <ContentRenderer :value="section" />
      </section>
    </main>
  </div>
</template>

<style scoped>
.docs-container {
  display: flex;
  max-width: 1200px;
  margin: auto;
  padding: 1rem;
  background: #1a1a1a;
  color: #ddd;
}

.toc {
  position: sticky;
  top: 2rem;
  align-self: flex-start;
  height: fit-content;
  width: 220px;
  padding-right: 1rem;
  border-right: 1px solid #333;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    text-decoration: none;
    color: #aaa;
    transition: color 0.2s, background 0.2s;
    padding: 4px 6px;
    border-radius: 4px;
    display: block;

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
    }

    .active & {
      font-weight: bold;
      color: #00dc82;
      background: rgba(0, 220, 130, 0.1);
    }
  }
}

.content {
  flex: 1;
  padding-left: 2rem;
}

.doc-section {
  margin-bottom: 4rem;
  scroll-margin-top: 2rem;

  h2 {
    border-bottom: 1px solid #333;
    padding-bottom: 0.25rem;
    color: #fff;
  }

  p {
    line-height: 1.6;
    color: #ccc;
  }
}
</style>
