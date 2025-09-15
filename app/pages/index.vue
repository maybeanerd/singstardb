<script setup lang="ts">

const { data, columns, sorting } = useCSVData()


</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 h-screen">
    <h1 class="font-bold text-2xl text-(--ui-primary) h-28">
      Nuxt UI - Starter
    </h1>

    <div class="overflow-scroll">
      <UTable v-if="data" v-model:sorting="sorting" :data="data" :columns="columns" :sticky="true"
        class="flex-1 max-h-10/12" />
      <div v-else>Loading...</div>
    </div>
  </div>
</template>
