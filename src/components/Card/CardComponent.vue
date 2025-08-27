<template>
  <div class="bg-white border border-gray-200 rounded-xl p-4">
    <div class="w-full flex justify-between items-center mb-4">
      <h3 class="font-semibold text-gray-800">{{ props.title }}</h3>
      <icon
        :is="props.icon"
        class="text-gray-400 w-5 h-5"
        style="stroke-width: 2.4"
      />
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import type { LucideIcon } from "lucide-vue-next";
import { defineProps } from "vue";

const props = defineProps<{
  title: string;
  icon: LucideIcon;
}>();
</script>
