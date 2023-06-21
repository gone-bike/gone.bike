<script setup lang="ts">
const props = defineProps<{
  href: string;
}>();
</script>

<template>
  <a
    :href="props.href"
    class="bg-primary-600 px-4 rounded-md active:bg-primary-700 hover:bg-primary-700 font-semibold py-2 text-white"
  >
    <slot />
  </a>
</template>

<style scoped></style>
