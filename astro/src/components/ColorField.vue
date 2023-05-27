<script setup lang="ts">

import { t } from 'i18next'
import { ref, watch } from 'vue';

let tags = ref<string[]>([])

const props = defineProps<{ modelValue: string, title: string, type?: string }>()
const emit = defineEmits(['update:modelValue'])


let tagModel = ref(props.modelValue)

watch(tagModel, function(val){
    if(val === "") return
    if(val[val.length-1]=== ","){
        let newtags = [...tags.value, val.slice(0, val.length-2)]
        tags.value = newtags
        emit("update:modelValue", newtags.join(","))
        tagModel.value = ""
    }
})

function handleAdd(){
    if(tagModel.value){
        let newLst = [...tags.value, tagModel.value.valueOf()]
        tags.value = newLst
        tagModel.value = ""
        emit("update:modelValue", newLst.join(","))
    }
}

function remove(tag: string) {
    tags.value = tags.value.filter(e=>e!==tag)
}

</script>

<template>
    <div class="flex flex-col ml-2">
        <label :for="props.title" class="text-lg">{{ t(`forms.report.questions.${props.title}.title`) }}</label>
        <span class="mb-2 text-sm font-semibold text-gray-500 ml-1">{{ t(`forms.report.questions.${props.title}.subtitle`)
        }}</span>
        <input type="text" @keydown.enter="handleAdd" autocomplete="off" :name="props.title"
            :placeholder="t(`forms.report.questions.${props.title}.placeholder`) as string" :id="props.title" v-model="tagModel" /> 
        <ul class="flex gap-2 mt-2">
            <li v-for="tag in tags" :key="tag"
                class="w-fit flex items-center gap-2 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 bg-purple-400 px-3 py-1 font-semibold text-white">
                <button @click="remove(tag)">
                    <span>{{ tag }}</span>
                </button>
            </li>
        </ul>

    </div>
</template>