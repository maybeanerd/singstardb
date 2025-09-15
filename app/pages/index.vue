<script setup lang="ts">

const { data, columns, sorting, grouping, groupingOptions, globalFilter } = useCSVData()


</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 h-screen">
    <h1 class="font-bold text-2xl text-(--ui-primary) h-28">
      Nuxt UI - Starter
    </h1>

    <div class="overflow-scroll">
      <div class="flex px-4 py-3.5 border-b border-accented">
        <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
      </div>
      <UTable v-if="data" v-model:global-filter="globalFilter" v-model:sorting="sorting" :data="data" :columns="columns"
        :ui="{
          root: 'min-w-full',
          td: 'empty:p-0' // helps with the colspaned row added for expand slot
        }" :sticky="true" :grouping-options="groupingOptions" :grouping="grouping" class="flex-1 max-h-10/12 w-screen">
        <template #title-cell="{ row }">
          <div v-if="row.getIsGrouped()" class="flex items-center">
            <span class="inline-block" :style="{ width: `calc(${row.depth} * 1rem)` }" />
            <UButton variant="outline" color="neutral" class="mr-2" size="xs"
              :icon="row.getIsExpanded() ? 'i-lucide-minus' : 'i-lucide-plus'" @click="row.toggleExpanded()" />
            <strong v-if="row.groupingColumnId === 'title'">{{
              row.original.title
            }}</strong>
          </div>
        </template>
      </UTable>
      <div v-else>Loading...</div>
    </div>
  </div>
</template>
