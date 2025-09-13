<template>
  <Skeleton v-if="props.loading" width="100%" height="16rem" />
  <div
    v-else
    class="bg-white border border-gray-200 rounded-xl p-4 h-full flex flex-col"
  >
    <div
      class="w-full flex justify-between items-center"
      :class="{
        'justify-end': !props.title,
      }"
    >
      <h3 v-show="!!props.title" class="font-semibold text-gray-800">
        {{ props.title }}
      </h3>
      <icon
        :is="props.icon"
        class="text-gray-400 w-5 h-5"
        style="stroke-width: 2.4"
      />
    </div>
    <div class="overflow-hidden h-full max-h-full">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LucideIcon } from "lucide-vue-next";
import { Skeleton } from "primevue";
import { defineProps } from "vue";

const props = defineProps<{
  title: string;
  icon: LucideIcon;
  loading: boolean;
}>();
</script>
