<script setup lang="ts">
defineProps<{
  step: number;
}>();
</script>
<template>
  <div
    class="flex mb-8 w-full items-center px-4 p-2 text-sm font-bold text-white"
  >
    <div class="relative flex flex-col items-center text-lg">
      <div
        :data-current="$props.step === 1"
        :data-done="$props.step > 0"
        class="circle"
      >
        1
      </div>
    </div>
    <div
      :data-done="$props.step > 1"
      :data-current="$props.step === 1"
      class="line"
    ></div>
    <div class="relative flex flex-col items-center text-lg">
      <div
        :data-current="$props.step === 2"
        :data-done="$props.step > 1"
        class="circle"
      >
        2
      </div>
    </div>
    <div
      :data-done="$props.step > 2"
      :data-current="$props.step === 2"
      class="line"
    ></div>
    <div class="relative flex flex-col items-center text-lg">
      <div
        :data-current="$props.step === 3"
        :data-done="$props.step > 2"
        class="circle"
      >
        3
      </div>
    </div>
    <div
      :data-done="$props.step > 3"
      :data-current="$props.step === 3"
      class="line"
    ></div>
    <div class="relative flex flex-col items-center text-lg">
      <div
        :data-current="$props.step === 4"
        :data-done="$props.step > 3"
        class="circle"
      >
        4
      </div>
    </div>
  </div>
</template>

<style>
.circle {
  @apply flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-400 bg-gray-400 text-white data-[done=true]:bg-primary-600 data-[done=true]:text-white data-[done=true]:border-primary-600 data-[current=true]:bg-blue-100 data-[current=true]:border-dashed data-[current=true]:text-primary-600 data-[current=true]:border-primary-600;
  /* border-blue-400 bg-blue-100 text-primary-600 */
  /* data-[current=true]:bg-gray-400 data-[current=true]:!border-dashed */
}

.line {
  @apply h-1 w-full bg-gray-400 data-[done=true]:bg-primary-600 data-[current=true]:bg-blue-300;
}
</style>
