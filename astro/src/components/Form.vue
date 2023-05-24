<script setup lang="ts">
import { t as i18next } from "i18next"
import { computed, reactive, ref } from "vue"
import VueDatePicker from "@vuepic/vue-datepicker"
import '@vuepic/vue-datepicker/dist/main.css'

import DownIcon from "@components/icons/Down.vue"
import DeleteIcon from "@components/icons/Delete.vue"
import EmailIcon from "@components/icons/Email.vue"
import AutoComplete from "./AutoComplete.vue"

let bikeModelsApi: { key: string, value: string }[] = [{ "key": "key-0", "value": "value-0" }, { "key": "key-1", "value": "value-1" }, { "key": "key-2", "value": "value-2" }, { "key": "key-3", "value": "value-3" }, { "key": "key-4", "value": "value-4" }, { "key": "key-5", "value": "value-5" }, { "key": "key-6", "value": "value-6" }, { "key": "key-7", "value": "value-7" }, { "key": "key-8", "value": "value-8" }, { "key": "key-9", "value": "value-9" }, { "key": "key-10", "value": "value-10" }, { "key": "key-11", "value": "value-11" }, { "key": "key-12", "value": "value-12" }, { "key": "key-13", "value": "value-13" }, { "key": "key-14", "value": "value-14" }, { "key": "key-15", "value": "value-15" }, { "key": "key-16", "value": "value-16" }, { "key": "key-17", "value": "value-17" }, { "key": "key-18", "value": "value-18" }, { "key": "key-19", "value": "value-19" }, { "key": "key-20", "value": "value-20" }, { "key": "key-21", "value": "value-21" }, { "key": "key-22", "value": "value-22" }, { "key": "key-23", "value": "value-23" }, { "key": "key-24", "value": "Value-24" }]
let bikeBrandApi: { key: string, value: string }[] = [{ "key": "key-0", "value": "value-0" }, { "key": "key-1", "value": "value-1" }, { "key": "key-2", "value": "value-2" }, { "key": "key-3", "value": "value-3" }, { "key": "key-4", "value": "value-4" }, { "key": "key-5", "value": "value-5" }, { "key": "key-6", "value": "value-6" }, { "key": "key-7", "value": "value-7" }, { "key": "key-8", "value": "value-8" }, { "key": "key-9", "value": "value-9" }, { "key": "key-10", "value": "value-10" }, { "key": "key-11", "value": "value-11" }, { "key": "key-12", "value": "value-12" }, { "key": "key-13", "value": "value-13" }, { "key": "key-14", "value": "value-14" }, { "key": "key-15", "value": "value-15" }, { "key": "key-16", "value": "value-16" }, { "key": "key-17", "value": "value-17" }, { "key": "key-18", "value": "value-18" }, { "key": "key-19", "value": "value-19" }, { "key": "key-20", "value": "value-20" }, { "key": "key-21", "value": "value-21" }, { "key": "key-22", "value": "value-22" }, { "key": "key-23", "value": "value-23" }, { "key": "key-24", "value": "Value-24" }]

let dateTest = ref("")

let formValue = reactive({
    bike_model: "",
    bike_brand: ''
})

let bikeModelIsOther = ref(false)

let bikeModelIsOpen = ref(false)

let mainImagePreviewIsOpen = ref(false)

let mainImagePreviewBg = ref<string>()

let mainImageFile = ref<File>()

let mainImagePreviewDimensions = reactive({
    width: "auto",
    height: "auto",
})

let mainImagePreviewEl = ref<HTMLInputElement>()

function autoComplete(str: string){
    bikeModelIsOpen.value = false
    formValue.bike_model = str
}

let mainPhotoFileUpload = ref<HTMLInputElement>()
function t(str: string, param?: {}) {
    if(param){
        return i18next(`forms.report.questions.${str}.title`, param)
    }
    return i18next(`forms.report.questions.${str}.title`)
}
let imageTypes = ['image/png', 'image/jpeg']
function handleMainFileUpload() {
    let file = mainPhotoFileUpload.value?.files?.item(0);
    if (file) {
        if (imageTypes.indexOf(file.type) > 0) {
            const fileReader = new FileReader
            fileReader.onload = function (fileParam) {
                let img = new Image
                img.onload = function () {
                    let elDimension = mainImagePreviewEl.value?.getClientRects().item(0)
                    let widthForPreview = (elDimension?.width as number) * 0.6
                    let aspectRatioOfMainImagePreview = img.height / img.width
                    mainImagePreviewDimensions.width = widthForPreview + "px"
                    mainImagePreviewDimensions.height = (aspectRatioOfMainImagePreview * widthForPreview ) + "px"
                    console.log({ width: img.width, parentWidth: widthForPreview })
                }
                if (fileParam.target?.result) {
                    // @ts-ignore
                    mainImagePreviewBg.value = fileParam.target.result
                    // @ts-ignore
                    img.src = fileParam.target.result
                    mainImagePreviewIsOpen.value = true
                }
            }
            fileReader.readAsDataURL(file)
            mainImageFile.value = file
        }
    }
}
 function removeMainFile(){
    // @ts-ignore
    mainPhotoFileUpload.value.value = ""
    mainImagePreviewIsOpen.value = false
    mainImageFile.value = undefined
 }

 let bikeModelAutoComplete = ref("")
 let bikeModelList = computed(()=>{
    return bikeModelsApi.filter(model=>model.value.toLowerCase().includes(bikeModelAutoComplete.value.toLowerCase()))
 })
 function toggleBikeModelIsOpen(){
    bikeModelIsOpen.value = !bikeModelIsOpen.value
 }
let currentPage = ref(1)
function handleBikeModelChange(e: any){
    formValue.bike_model = (e as { target: HTMLInputElement }).target.value
}
</script>
<template>
    <div class="flex flex-col gap-12 w-full" v-show="currentPage === 1">
        <div class="relative w-full h-full">
            <AutoComplete v-model="formValue.bike_model" :api="bikeModelsApi" title="bike_model" />
        </div>
        <div class="relative w-full h-full">
            <AutoComplete v-model="formValue.bike_brand" :api="bikeBrandApi" title="bike_brand" />
        </div>
        <div class="flex flex-col ml-2">
            <label for="colors" class="mb-2 text-lg">{{ t("colors") }}</label>
            <input name="colors" id="colors" type="text">
        </div>
        <div class="ml-2">
            <label for="is_electric" class="mb-2 text-lg">{{ t("is_electric") }}</label>
            <br />
            <div class="flex items-center mt-3">
                <input type="radio" aria-labelledby="is_electric" class="h-4 w-4 ml-2" name="is_electric"
                    id="is_electric_1">
                <label for="is_electric_1" class="ml-2 text-sm">Yes</label>
            </div>
            <div class="flex items-center mt-2">
                <input type="radio" aria-labelledby="is_electric" class="h-4 w-4 ml-2" name="is_electric"
                    id="is_electric_1">
                <label for="is_electric_1" class="ml-2 text-sm">No</label>
            </div>
        </div>
        <div class="flex flex-col ml-2">
            <label for="approximate_value" class="mb-2 text-lg">{{ t("approximate_value") }}</label>
            <input name="approximate_value" id="approximate_value" type="text" placeholder="Ex: 250">
            <span></span>
        </div>
        <div class="w-full h-[1px] bg-gray-200"></div>
        <div class="flex w-full justify-between">
            <span></span>
            <button @click="currentPage++"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">Next</button>
        </div>
    </div>
    <div class="flex flex-col gap-12 w-full" v-show="currentPage === 2">
        <div class="flex flex-col ml-2">
            <label for="theft_date" class="mb-2 text-lg">{{ t("theft_date") }}</label>
            <VueDatePicker v-model="dateTest" />
        </div>
        <div class="flex flex-col ml-2">
            <label for="location_type" class="mb-2 text-lg">{{ t("location_type") }}</label>
            <select name="location_type" id="location_type">
                <option default value="choose">You Choose</option>
                <option value="street">Street</option>
                <option value="park">Park</option>
                <option value="garage">Garage</option>
                <option value="home">Home</option>
            </select>
        </div>
        <div class="flex flex-col ml-2">
            <label for="lock_type" class="mb-2 text-lg">{{ t("lock_type") }}</label>
            <select name="lock_type" id="lock_type">
                <option default value="choose">You Choose</option>
                <option value="nobody">Nobody</option>
                <option value="chain">Chain</option>
                <option value="unlock">Unlock</option>
                <option value="cable">Cable</option>
            </select>
        </div>
        <div class="flex flex-col ml-2">
            <label for="lock_anchor" class="mb-2 text-lg">{{ t("lock_anchor") }}</label>
            <input name="lock_anchor" id="lock_anchor" type="text">
        </div>
        <div class="flex flex-col ml-2">
            <label for="location" class="text-lg">{{ t("location") }}</label>
            <p class="text-sm text-gray-500 mb-2 font-semibold">{{ i18next("forms.report.questions.location.subtitle") }}
            </p>
        </div>
        <div class="flex w-full justify-between">
            <button @click="currentPage--"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">Back</button>
            <button @click="currentPage++"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">Next</button>
        </div>
    </div>
    <div class="flex flex-col gap-12 w-full h-full" v-show="currentPage === 3">
        <div class="flex flex-col ml-2 justify-center" ref="mainImagePreviewEl">
            <label for="main_photo" class="mb-2 text-lg">{{ t("main_photo") }}</label>
            <img v-if="mainImagePreviewIsOpen" id="main_image_preview" :style="{
                height: mainImagePreviewDimensions.height,
                width: mainImagePreviewDimensions.width,
                background: `url(${mainImagePreviewBg})`
            }" class="main-image-preview mb-4" />
            <label
                class="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase text-purple-600 border border-blue cursor-pointer hover:bg-purple-600 hover:text-white">
                <svg class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path
                        d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span class="mt-2 text-base leading-normal">Select a file</span>
                <input type='file' class="hidden" ref="mainPhotoFileUpload" @input="handleMainFileUpload" />
            </label>
            <div v-if="mainImageFile" class="flex justify-around p-3 border my-4 text-lg">
                <span>{{ mainImageFile.name }}</span>
                <button @click="removeMainFile">
                    <DeleteIcon class="text-red-800 bg-red-300 h-10 rounded-md hover:bg-red-400 focus:bg-red-400 w-10 p-2"/>
                </button>
            </div>
            <button
                class="bg-purple-500 text-white hover:bg-purple-600 rounded-md shadow-md mt-2 focus:bg-purple-600 px-4 py-3">Upload</button>
        </div>
        <div class="flex w-full justify-between">
            <button @click="currentPage--"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">Back</button>
            <button @click="currentPage++"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">Next</button>
        </div>
    </div>
    <div class="flex flex-col gap-12 w-full h-full" v-show="currentPage === 4">
        <div class="flex flex-col ml-2 justify-center" ref="mainImagePreviewEl">
            <label for="main_photo" class="mb-2 text-lg">{{ t("photos", { n: 3 }) }}</label>
            <img v-if="mainImagePreviewIsOpen" id="main_image_preview" :style="{
                height: mainImagePreviewDimensions.height,
                width: mainImagePreviewDimensions.width,
                background: `url(${mainImagePreviewBg})`
            }" class="main-image-preview mb-4" />
            <label
                class="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase text-purple-600 border border-blue cursor-pointer hover:bg-purple-600 hover:text-white">
                <svg class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path
                        d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span class="mt-2 text-base leading-normal">Select a file</span>
                <input type='file' class="hidden" ref="mainPhotoFileUpload" @input="handleMainFileUpload" />
            </label>
            <div v-if="mainImageFile" class="flex justify-around p-3 border my-4 text-lg">
                <span>{{ mainImageFile.name }}</span>
                <button @click="removeMainFile">
                    <DeleteIcon class="text-red-800 bg-red-300 h-10 rounded-md hover:bg-red-400 focus:bg-red-400 w-10 p-2"/>
                </button>
            </div>
            <button
                class="bg-purple-500 text-white hover:bg-purple-600 rounded-md shadow-md mt-2 focus:bg-purple-600 px-4 py-3">Upload</button>
        </div>
        <div class="flex w-full justify-between">
            <button @click="currentPage--"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">Back</button>
            <button @click="currentPage++"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">Next</button>
        </div>
    </div>
    <div class="flex flex-col gap-12 w-full" v-show="currentPage === 5">
        <div class="flex flex-col ml-2">
            <label for="description" class="mb-2 text-lg">{{ t("description") }}</label>
            <textarea name="description" id="description" cols="30" rows="10"></textarea>
        </div>
        <div class="flex w-full justify-between">
            <button @click="currentPage--"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">Back</button>
            <button @click="currentPage++"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">Next</button>
        </div>
    </div>
    <div class="flex flex-col gap-12 w-full" v-show="currentPage === 6">
        <div class="flex flex-col ml-2">
            <label for="email" class="mb-2 text-lg">Enter you Email</label>
            <input name="email" type="text" id="email"/>
        </div>
        <div class="flex w-full justify-between">
            <button @click="currentPage--"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">Back</button>
            <button @click="currentPage++"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">Next</button>
        </div>
    </div>
    <div class="flex flex-col w-full h-full justify-center" v-show="currentPage === 7">
        <EmailIcon class="h-40 text-3xl text-purple-500"/>
        <h1 class="text-3xl mb-4 font-semibold text-center">Thank you!</h1>
    </div>
</template>
<style>
.main-image-preview {
    display: block;
    cursor: pointer;
    background-repeat: no-repeat !important;
    background-size: cover !important;
}
</style>