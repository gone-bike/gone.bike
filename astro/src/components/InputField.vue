<script setup lang="ts">

import { t } from 'i18next'

const props = defineProps<{ modelValue: string, title: string, type?: string, isCurrency?: string }>()
const emit = defineEmits(['update:modelValue'])

function handleChange(e: any) {
    emit("update:modelValue", (e as { target: HTMLInputElement }).target.value)
}

</script>
<template>
    <div class="flex flex-col">
        <label :for="props.title" class="mb-2 text-lg">{{ t(`forms.report.questions.${props.title}.title`) }}</label>
        <input autocomplete="off" :name="props.title" :placeholder="t(`forms.report.questions.${props.title}.placeholder`) as string"  :id="props.title" :type="props.type ?? 'text'" :value="props.modelValue" @input="handleChange"/>
        <span v-show="!props.isCurrency" class="mt-1 text-sm font-semibold text-gray-500">{{ t(`forms.report.questions.${props.title}.subtitle`)  }}</span>
        <span v-show="props.isCurrency" class="mt-1 text-sm font-semibold text-gray-500">{{ t(`forms.report.questions.${props.title}.subtitle`, { currency:  props.isCurrency })  }}</span>
    </div>
</template>