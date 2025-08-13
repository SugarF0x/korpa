<script setup lang="ts">
import { isTableOfContents, type TableOfContents } from "~/data/table-of-contents"

defineProps<{
  contents: TableOfContents
  activeIdSet: Set<string>
  notRoot?: boolean
}>()
</script>

<template>
  <ul :class="{ inset: notRoot }">
    <li>
      <div class="category">{{ contents.category }}</div>
      <ul>
        <li
          v-for="item in contents.items"
          :key="isTableOfContents(item) ? item.category : item.name"
          :class="{ active: !isTableOfContents(item) && activeIdSet.has(item.id) }"
        >
          <a v-if="!isTableOfContents(item)" :href="`#${item.id}`">{{ item.name.split('.').slice(0, -1).join('.') }}</a>
          <table-of-contents v-else :contents="item" :active-id-set="activeIdSet" not-root />
        </li>
      </ul>
    </li>
  </ul>
</template>

<style scoped>
ul {
  text-transform: capitalize;
  list-style: none;
  padding: 0;
  margin: 0;

  &.inset {
    margin-left: 8px;
  }
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
</style>
