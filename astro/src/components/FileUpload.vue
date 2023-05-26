<script setup lang="ts">
import { ref } from 'vue';
import axios from "axios"

defineProps<{
    modelValue: string | {
        upload: string;
        name: string;
    }
}>()

const emit = defineEmits(["update:modelValue"])

const fileUploadEl = ref<HTMLInputElement>()
const progressWidth = ref()
const progressBarName = ref("")
const uploadData = ref<{
    upload: string;
    lastModified: number;
    name: string;
    size: number;
    type: string;
    width: number;
    height: number;
    href: string;
}>()
const progressBarIsOpen = ref(false)
function deleteFile() {
    progressBarIsOpen.value = false
    uploadData.value = undefined
    emit("update:modelValue", "")
}
async function handleMainFileUpload() {
    let file = fileUploadEl.value?.files?.item(0) as File
    if(file.type.slice(0, 5) !== "image"){
        console.log(file.type)
        alert("Given File is not a image " + file.type)
        return 
    }
    const formData = new FormData()
    formData.append("file", file)
    progressBarName.value = file.name
    let resp: {
        data: {
            upload: string;
            lastModified: number;
            name: string;
            size: number;
            type: string;
            width: number;
            height: number;
            href: string;
        }
    } = await axios.post("/api/input/upload", formData, {
        onUploadProgress({ total, loaded }) {
            if (total) {
                if (!progressBarIsOpen.value) {
                    progressBarIsOpen.value = true
                }
                progressWidth.value = Math.floor(loaded * 100 / total) + "%"
            }
        },

    })
    if (resp.data.upload) {
        uploadData.value = resp.data
        emit("update:modelValue", { upload: resp.data.upload, name: resp.data.name })
    }
    console.log(resp.data)
}
</script>
<template>
    <div class="mb-4">
        <label v-if="!progressBarIsOpen"
            class="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase text-purple-600 border border-blue cursor-pointer hover:bg-purple-600 hover:text-white">
            <svg class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                    d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span class="mt-2 text-base leading-normal">Select a file</span>
            <input type='file' class="hidden" ref="fileUploadEl" @input="handleMainFileUpload" />
        </label>
        <div>
            <div v-if="uploadData">
                <img :src="uploadData.href" :width="uploadData.width" :height="uploadData.height" alt="">
            </div>
            <div v-if="progressBarIsOpen"
                class="w-full relative px-1 h-10 flex justify-between items-center border rounded bg-purple-300 transition-all duration-300">
                <div class="h-7 text-white flex items-center bg-purple-800 rounded-md" :style="{
                    width: progressWidth
                }">
                    <p class="text-sm m-2 font-mono ml-5 absolute">{{ progressBarName }}</p>
                </div>
                <p></p>
                <button @click="deleteFile" class="bg-red-300 text-red-700 p-1 ml-2 rounded-lg hover:bg-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="h-6 w-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>