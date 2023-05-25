<script setup lang="ts">
import { ref } from 'vue';
import axios from "axios"

const isProgressBarOpen = ref(false)
const progressBarWidth = ref("")
const fileUploadEl = ref<HTMLInputElement>()
function handleMainFileUpload(){
    const formData = new FormData()
    formData.append("file",fileUploadEl.value?.files?.item(0) as File)
    axios.post("/api/input/upload", formData, {
        onUploadProgress({ total, loaded }: ProgressEvent){
            console.log(Math.floor(loaded * 100 / total))
        }
    })
}
</script>
<template>
    <div>
        <label
            class="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase text-purple-600 border border-blue cursor-pointer hover:bg-purple-600 hover:text-white">
            <svg class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                    d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span class="mt-2 text-base leading-normal">Select a file</span>
            <input type='file' class="hidden" ref="fileUploadEl" @input="handleMainFileUpload" />
        </label>
    </div>
</template>