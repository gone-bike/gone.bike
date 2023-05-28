<script setup lang="ts">
defineProps<{
  step: number
}>()
</script>
<template>
  <div class="flex mb-8 w-full items-center px-4 p-2 text-sm font-bold text-white">
    <div class="relative flex flex-col items-center text-lg">
      <div :data-done="$props.step > 1"
        class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-400 bg-purple-100 text-purple-600 data-[done=true]:bg-purple-600 data-[done=true]:text-white">
        1</div>
      <h5 class="absolute top-10 text-sm font-normal text-black">Step 1</h5>
    </div>
    <div :data-done="$props.step > 1" class="h-[2px] w-full bg-purple-300 data-[done=true]:bg-purple-600"></div>
    <div class="relative flex flex-col items-center text-lg">
      <div :data-done="$props.step > 2"
        class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-400 bg-purple-100 text-purple-600 data-[done=true]:bg-purple-600 data-[done=true]:text-white">
        2</div>
      <h5 class="absolute top-10 text-sm font-normal text-black">Step 2</h5>
    </div>
    <div :data-done="$props.step > 2" class="h-[2px] w-full bg-purple-300 data-[done=true]:bg-purple-600"></div>
    <div class="relative flex flex-col items-center text-lg">
      <div :data-done="$props.step > 3"
        class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-400 bg-purple-100 text-purple-600 data-[done=true]:bg-purple-600 data-[done=true]:text-white">
        3</div>
      <h5 class="absolute top-10 text-sm font-normal text-black">Step 3</h5>
    </div>
    <div :data-done="$props.step > 3" class="h-[2px] w-full bg-purple-300 data-[done=true]:bg-purple-600"></div>
    <div class="relative flex flex-col items-center text-lg">
      <div :data-done="$props.step > 4"
        class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-400 bg-purple-100 text-purple-600 data-[done=true]:bg-purple-600 data-[done=true]:text-white">
        4</div>
      <h5 class="absolute top-10 text-sm font-normal text-black">Step 4</h5>
    </div>
    <div :data-done="$props.step > 4" class="h-[2px] w-full bg-purple-300 data-[done=true]:bg-purple-600"></div>
    <div class="relative flex flex-col items-center text-lg">
      <div :data-done="$props.step > 5"
        class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-400 bg-purple-100 text-purple-600 data-[done=true]:bg-purple-600 data-[done=true]:text-white">
        5</div>
      <h5 class="absolute top-10 text-sm font-normal text-black">Step 5</h5>
  </div>
</div></template>