<script setup lang="ts">
const { data } = useCSVData()

</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 h-screen">
    <h1 class="font-bold text-2xl text-(--ui-primary)">
      Nuxt UI - Starter
    </h1>

    <div class="flex items-center gap-2">
      <UTable v-if="data" :data="data" class="flex-1" />
      <div v-else>Loading...</div>
    </div>
  </div>
</template>
