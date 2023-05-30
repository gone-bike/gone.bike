<script setup lang="ts">
import { t } from 'i18next'
import { ref } from 'vue';

const props = withDefaults(defineProps<{ modelValue: string, title: string, list: string[], other?: boolean, isSort?: boolean }>(), {
    other: true,
    isSort: true
});

let list = props.isSort ? props.list.sort() : props.list;

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
function handleOtherField(e: any) {
    let value = (e as { target: HTMLInputElement }).target.value
    emit("update:modelValue", value)
}
const isOther = ref(false)
</script>
<template>
    <div class="flex flex-col">
        <label :for="props.title" class="mb-2 text-lg">{{ t(`forms.report.questions.${props.title}.title`) }}</label>
        <select :placeholder="props.modelValue"
            :class='{ "bg-gray-200": isOther, "report-placeholder": props.modelValue === "" }' :value="props.modelValue"
            @input="handleChange" :name="props.title" :id="props.title">
            <option selected value="">{{ t("forms.report_form.you_choose") }}</option>
            <option v-for="item in list" :key="item" :value="item">{{
                t(`forms.report.questions.${props.title}.choices.${item}`) }}</option>
            <option v-if="props.other" value="others">{{ t("forms.report.questions.other_choice") }}</option>
        </select>
        <div v-if="props.other" v-show="isOther" class="flex flex-col gap-2 mt-3">
            <label class="mt-2 mb-1" :for="`enter_here_${props.title}`">{{ t("pages.report_form.enter_here") }}</label>
            <input type="text" :placeholder='(t("pages.report_form.enter_here") as string)' :class="['w-52', !isOther ? 'border-gray-500 report-placeholder bg-gray-100 pointer-events-none' : '']"
                :value="isOther ? props.modelValue : ''" @input="handleOtherField">
        </div>
        <span v-show="!isOther" class="mt-1 text-sm font-normal text-gray-400 italic ">{{ t(`forms.report.questions.${props.title}.subtitle`)  }}</span>
    </div>
</template>