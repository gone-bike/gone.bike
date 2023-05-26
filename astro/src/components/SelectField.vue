<script setup lang="ts">
import { t } from 'i18next'
import { ref } from 'vue';

const props = defineProps<{ modelValue: string, title: string, list: string[] }>()
const emit = defineEmits(['update:modelValue'])

function handleChange(e: any) {
    let value = (e as { target: HTMLInputElement }).target.value
    if (value === "others") {
        isOther.value = true
        emit("update:modelValue", "")
    } else {
        isOther.value = false
        emit("update:modelValue", value)
    }
}
function handleOtherField(e: any){
    let value = (e as { target: HTMLInputElement }).target.value
    emit("update:modelValue", value)
}
const isOther = ref(false)
</script>
<template>
    <div class="flex flex-col ml-2">
        <label :for="props.title" class="mb-2 text-lg">{{ t(`forms.report.questions.${props.title}.title`) }}</label>
        <select :placeholder="props.modelValue" :class="isOther ? 'bg-gray-100' : ''" :value="props.modelValue"
            @input="handleChange" :name="props.title" :id="props.title">
            <option value="">{{ t("forms.report_form.you_choose") }}</option>
            <option v-for="item in props.list" :value="item">{{ item }}</option>
            <option value="others">{{ t("forms.pages.report_form.other") }}</option>
        </select>
        <div v-show="isOther" class="flex flex-col gap-2 mt-3">
            <label class="mt-2 mb-1" :for="`enter_here_${props.title}`">{{ t("pages.report_form.enter_here") }}</label>
            <input type="text" :class="['w-52', !isOther ? 'border-gray-500 bg-gray-100 pointer-events-none' : '']"
                :value="isOther ? props.modelValue : ''" @input="handleOtherField">
        </div>
    </div>
</template>