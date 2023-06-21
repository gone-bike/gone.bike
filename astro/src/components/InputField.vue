<script setup lang="ts">
import { t } from "i18next";

const props = defineProps<{
  modelValue: string;
  title: string;
  type?: string;
  isCurrency?: string;
  classInput?: string;
}>();
const emit = defineEmits(["update:modelValue"]);

function handleChange(e: any) {
  emit("update:modelValue", (e as { target: HTMLInputElement }).target.value);
}
</script>

<template>
  <div class="flex flex-col">
    <label :for="props.title" class="mb-2 text-lg">{{
      t(`forms.report.questions.${props.title}.title`)
    }}</label>
    <input
      :name="props.title"
      class="w-full block py-3 px-5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base focus:ring-primary-600"
      :placeholder="t(`forms.report.questions.${props.title}.placeholder`) as string"
      :id="props.title"
      :type="props.type ?? 'text'"
      :value="props.modelValue"
      @input="handleChange"
    />
    <span
      v-show="!props.isCurrency"
      class="mt-2 text-sm font-normal text-gray-400 italic"
      >{{ t(`forms.report.questions.${props.title}.subtitle`) }}</span
    >
    <span
      v-show="props.isCurrency"
      class="mt-2 text-sm font-normal text-gray-400 italic"
      >{{
        t(`forms.report.questions.${props.title}.subtitle`, {
          currency: props.isCurrency,
        })
      }}</span
    >
  </div>
</template>
