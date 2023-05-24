<script setup lang="ts">
import { t } from 'i18next'
import { ref } from 'vue';

const props = defineProps<{ modelValue: string, title: string, list: string[] }>()
const emit = defineEmits(['update:modelValue'])

function handleChange(e: any) {
    emit("update:modelValue", (e as { target: HTMLInputElement }).target.value)
}
const isOther = ref(false)
</script>
<template>
    <div class="flex flex-col ml-2">
        <label :for="props.title" class="mb-2 text-lg">{{ t(`forms.report.questions.${props.title}.title`) }}</label>
        <select :class="isOther ? 'bg-gray-100': ''" :value="props.modelValue" @input="handleChange" :name="props.title" :id="props.title">
            <option v-for="item in props.list" :value="item">{{ item[0].toUpperCase() + item.slice(1) }}</option>
        </select>
        <div class="flex flex-col gap-2 mt-3">
                <div class="flex items-center gap-2">
                    <input type="checkbox" v-model="isOther" :name="`other_${props.title}`" :id="`other_${props.title}`">
                    <label :for="`other_${props.title}`">Others</label>
                </div>

                <input v-if="isOther" type="text"
                    :class="['w-52', !isOther ? 'border-gray-500 bg-gray-100 pointer-events-none' : '']"
                    :value="isOther ? props.modelValue : ''" @input="handleChange">
            </div>
    </div>
</template>