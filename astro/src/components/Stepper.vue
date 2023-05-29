<script setup lang="ts">
defineProps<{
  step: number
}>()
</script>
<template>
  <div class="flex mb-8 w-full items-center px-4 p-2 text-sm font-bold text-white">
    <div class="relative flex flex-col items-center text-lg">
      <div :data-current="$props.step === 1" :data-done="$props.step > 0"
        class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-400 bg-purple-100 text-purple-600 data-[done=true]:bg-purple-600 data-[done=true]:text-white data-[current=true]:!bg-gray-400 data-[current=true]:!border-dashed">
        1</div>
    </div>
    <div :data-done="$props.step > 1" class="h-[2px] w-full bg-purple-300 data-[done=true]:bg-purple-600"></div>
    <div class="relative flex flex-col items-center text-lg">
      <div :data-current="$props.step === 2" :data-done="$props.step > 1"
        class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-400 bg-purple-100 text-purple-600 data-[done=true]:bg-purple-600 data-[done=true]:text-white data-[current=true]:!bg-gray-400 data-[current=true]:!border-dashed">
        2</div>
    </div>
    <div :data-done="$props.step > 2" class="h-[2px] w-full bg-purple-300 data-[done=true]:bg-purple-600"></div>
    <div class="relative flex flex-col items-center text-lg">
      <div :data-current="$props.step === 3" :data-done="$props.step > 2"
        class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-400 bg-purple-100 text-purple-600 data-[done=true]:bg-purple-600 data-[done=true]:text-white data-[current=true]:!bg-gray-400 data-[current=true]:!border-dashed">
        3</div>
    </div>
    <div :data-done="$props.step > 3" class="h-[2px] w-full bg-purple-300 data-[done=true]:bg-purple-600"></div>
    <div class="relative flex flex-col items-center text-lg">
      <div :data-current="$props.step === 4" :data-done="$props.step > 3"
        class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-400 bg-purple-100 text-purple-600 data-[done=true]:bg-purple-600 data-[done=true]:text-white data-[current=true]:!bg-gray-400 data-[current=true]:!border-dashed">
        4</div>
    </div>
  </div>
</template>