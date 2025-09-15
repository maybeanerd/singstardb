<script setup lang="ts">

const { data, columns, sorting } = useCSVData()


</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 h-screen">
    <h1 class="font-bold text-2xl text-(--ui-primary)">
      Nuxt UI - Starter
    </h1>

    <div class="flex items-center gap-2">
      <UButton>Hi Ho Button</UButton>
      <UTable v-if="data" v-model:sorting="sorting" :data="data" :columns="columns" class="flex-1" />
      <div v-else>Loading...</div>
    </div>
  </div>
</template>
