<script setup lang="ts">

import { t } from 'i18next'

const props = defineProps<{ modelValue: string, title: string, type?: string }>()
const emit = defineEmits(['update:modelValue'])

function handleChange(e: any) {
    emit("update:modelValue", (e as { target: HTMLInputElement }).target.value)
}

</script>
<template>
    <div class="flex flex-col ml-2">
        <label :for="props.title" class="mb-2 text-lg">{{ t(`forms.report.questions.${props.title}.title`) }}</label>
        <input :name="props.title" :id="props.title" :type="props.type ?? 'text'" :value="props.modelValue" @input="handleChange">
    </div>
</template>