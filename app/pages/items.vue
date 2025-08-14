<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue"
import { useAsyncData } from "#app"
import { generateTableOfContentsFromCollection } from "~/data/table-of-contents"

const { data } = await useAsyncData('items', async () => queryCollection('items').all())

const formatSectionId = (id: string) => id.split('/').slice(2).join('/')

const toc = computed(() => generateTableOfContentsFromCollection(data.value, 'Продукты'))
const activeSections = ref(new Set<string>())

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
    const element = document.getElementById(formatSectionId(section.id))
    if (element) observer.observe(element)
  }
})

onBeforeUnmount(() => { observer && observer.disconnect() })
</script>

<template>
  <div class="docs-container">
    <aside class="toc">
      <nav>
        <table-of-contents :contents="toc" :active-id-set="activeSections" />
      </nav>
    </aside>

    <main class="content">
      <section
        v-for="section in data"
        :id="formatSectionId(section.id)"
        :key="section.id"
        class="doc-section"
      >
        <h2>{{ section.title }}</h2>
        <content-renderer :value="section" />
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
}

.content {
  flex: 1;
  padding-left: 2rem;

  :deep(.info-box) {
    margin-left: .5rem;
    margin-bottom: .5rem;
  }
}

.doc-section {
  margin-bottom: 4rem;
  scroll-margin-top: 2rem;

  h2 {
    border-bottom: 1px solid #333;
    padding-bottom: 0.25rem;
    color: #fff;
    clear: both;
  }

  p {
    line-height: 1.6;
    color: #ccc;
  }
}
</style>
