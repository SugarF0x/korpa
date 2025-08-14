<script setup lang="ts">
defineProps<{
  image: string
  rating: number
}>()
</script>

<template>
  <div class="info-box">
    <nuxt-img :src="image" :alt="image" />
    <div class="rating">Рейтинг: {{ rating }} / 10</div>
  </div>
</template>

<style scoped>
.info-box {
  float: right;
  border: 1px solid #999;
  padding-top: .5rem;
  padding-bottom: .5rem;

  & > * {
    padding-left: .5rem;
    padding-right: .5rem;
    text-align: center;

    &:not(:first-child) {
      padding-top: .25rem;
    }

    &:not(:last-child) {
      border-bottom: 1px solid white;
      padding-bottom: .25rem;
    }
  }

  img {
    max-width: min(25vw, 250px);
  }
}
</style>
