<script setup lang="ts">
import { computed, ref } from "vue"
import { t } from 'i18next'

import DownIcon from "./icons/Down.vue"

const props = defineProps<{ api: { key: string, value: string }[], title: string, listed: string, newItem: string }>()
const emit = defineEmits(['update:listed', 'update:newItem'])
const isOther = ref(false)
const isOpen = ref(false)
function toggleOpen() {
    isOpen.value = !isOpen.value
}
const displayValue = ref("")
const searchQuery = ref("")
const queryResults = computed(() => {
    return props.api.filter(q => q.value.toLowerCase().includes(searchQuery.value.toLowerCase()))
})
function autoComplete(str: string) {
    isOpen.value = false
    let id = ""
    for (let cur of props.api) {
        if (cur.value === str) {
            id = cur.key
            break
        }
    }
    emit("update:listed", id)
    displayValue.value = str
    if (props.newItem) {
        emit("update:newItem", "")
    }
}
function handleChange(e: any) {
    emit("update:newItem", (e as { target: HTMLInputElement }).target.value)
    displayValue.value = (e as { target: HTMLInputElement }).target.value
    if (props.listed) {
        emit("update:listed", "")
    }
}
</script>
<template>
    <div class="relative w-full h-full">
        <div class="flex flex-col ml-2">
            <div :class="isOther ? 'pointer-events-none' : ''" @click="toggleOpen">
                <label :for="props.title" class='mb-2 text-lg w-full'>{{ t(`forms.report.questions.${props.title}.title`)
                }}</label>
                <div
                    :class="['border border-[#6b7280] mt-2 relative w-full h-fit py-2 px-3', isOther ? 'bg-gray-100' : '']">
                    <span v-if="displayValue">{{ displayValue }}</span>
                    <span class="text-gray-400" v-else>Select Here</span>
                    <DownIcon class="absolute right-2 top-1/2 -translate-y-1/2" />
                </div>
            </div>
            <div class="w-full bg-white border border-[#6b7280] transition-all p-1 duration-700 overflow-x-visible"
                v-if="isOpen">
                <input v-model="searchQuery" type="text" class="w-full">
                <ul class="max-h-40 overflow-y-scroll">
                    <li v-for="query in queryResults" tabindex="0" class="p-2 hover:bg-blue-100 border-b-2" :id="query.key"
                        @click="autoComplete(query.value)">{{ query.value }}</li>
                </ul>
            </div>
            <div class="flex flex-col gap-2 mt-3">
                <div class="flex items-center gap-2">
                    <input type="checkbox" v-model="isOther" :name="`other_${props.title}`" :id="`other_${props.title}`">
                    <label :for="`other_${props.title}`">Others</label>
                </div>

                <input v-if="isOther" type="text"
                    :class="['w-52', !isOther ? 'border-gray-500 bg-gray-100 pointer-events-none' : '']"
                    :value="props.newItem" @input="handleChange">
            </div>
        </div>
    </div>
</template>