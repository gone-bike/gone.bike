<script setup lang="ts">
import { t as i18next } from "i18next"
import { ref } from "vue"
import VueDatePicker from "@vuepic/vue-datepicker"
import '@vuepic/vue-datepicker/dist/main.css'

import DownIcon from "@components/icons/Down.vue"

let bikeModelsApi: { key: string, value: string }[] = [{ "key": "key-0", "value": "value-0" }, { "key": "key-1", "value": "value-1" }, { "key": "key-2", "value": "value-2" }, { "key": "key-3", "value": "value-3" }, { "key": "key-4", "value": "value-4" }, { "key": "key-5", "value": "value-5" }, { "key": "key-6", "value": "value-6" }, { "key": "key-7", "value": "value-7" }, { "key": "key-8", "value": "value-8" }, { "key": "key-9", "value": "value-9" }, { "key": "key-10", "value": "value-10" }, { "key": "key-11", "value": "value-11" }, { "key": "key-12", "value": "value-12" }, { "key": "key-13", "value": "value-13" }, { "key": "key-14", "value": "value-14" }, { "key": "key-15", "value": "value-15" }, { "key": "key-16", "value": "value-16" }, { "key": "key-17", "value": "value-17" }, { "key": "key-18", "value": "value-18" }, { "key": "key-19", "value": "value-19" }, { "key": "key-20", "value": "value-20" }, { "key": "key-21", "value": "value-21" }, { "key": "key-22", "value": "value-22" }, { "key": "key-23", "value": "value-23" }, { "key": "key-24", "value": "value-24" }]

let dateTest = ref("")


let bikeModelIsOpen = ref(false)

function t(str: string) {
    return i18next(`forms.report.questions.${str}.title`)
}

let currentPage = ref(1)
let theftDate = t("theft_date")
console.log(theftDate, "Here")
</script>
<template>
    <div class="flex flex-col gap-12 w-full" v-if="currentPage === 1">
        <div class="relative w-full">
            <div class="flex flex-col ml-2">
                <div @click="bikeModelIsOpen = !bikeModelIsOpen">
                    <label for="bike_brand" class="mb-2 text-lg w-full">{{ t("bike_brand") }}</label>
                    <div class="text-gray-400 border mt-2 relative w-full h-fit py-2 px-3">Select here
                        <DownIcon class="absolute right-2 top-1/2 -translate-y-1/2" />
                    </div>
                </div>
                <div class="w-full border transition-all translate-x-1 left-0 right-0 absolute top-[4.5rem] p-1 bg-white duration-700 overflow-x-visible"
                    v-if="bikeModelIsOpen">
                    <input type="text" class="w-full p-2 outline-[1px] border-2">
                    <ul class="max-h-40 overflow-y-scroll">
                        <li v-for="model in bikeModelsApi" tabindex="0" class="p-2 hover:bg-blue-100 border-b-2"
                            :id="model.key" @click="bikeModelIsOpen = false">{{ model.value }}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="flex flex-col ml-2">
            <label for="bike_model" class="mb-2 text-lg">{{ t("bike_model") }}</label>
            <input name="bike_model" id="bike_model"
                class="outline-blue-500 hover:outline-blue-500 px-4 py-3 border-x-2 border-y-2" type="text">
        </div>
        <div class="flex flex-col ml-2">
            <label for="colors" class="mb-2 text-lg">{{ t("colors") }}</label>
            <input name="colors" id="colors" class="outline-blue-500 hover:outline-blue-500 px-4 py-3 border-x-2 border-y-2"
                type="text">
        </div>
        <div class="ml-2">
            <label for="is_electric" class="mb-2 text-lg">{{ t("is_electric") }}</label>
            <br />
            <div class="flex items-center mt-3">
                <input type="radio" class="h-4 w-4 ml-2" name="is_electric" id="is_electric">
                <span class="ml-2 text-sm">Yes</span>
            </div>
            <div class="flex items-center mt-2">
                <input type="radio" class="h-4 w-4 ml-2" name="is_electric" id="is_electric">
                <span class="ml-2 text-sm">No</span>
            </div>
        </div>
        <div class="flex flex-col ml-2">
            <label for="approximate_value" class="mb-2 text-lg">{{ t("approximate_value") }}</label>
            <input name="approximate_value" id="approximate_value"
                class="outline-blue-500 hover:outline-blue-500 px-4 py-3 border-x-2 border-y-2" type="text"
                placeholder="Ex: 250">
            <span></span>
        </div>
        <div class="w-full h-[1px] bg-gray-200"></div>
        {{  i18next(`forms.report.questions.colors.title`) }} J
        <div class="flex w-full justify-between">
            <span></span>
            <button @click="currentPage++"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">Next</button>
        </div>
    </div>
    <div class="flex flex-col gap-12 w-full" v-if="currentPage === 2">
        <div class="flex flex-col ml-2">
            <label for="theft_date" class="mb-2 text-lg">{{t("colors") }}</label>
            <VueDatePicker v-model="dateTest"/>
        </div>
    </div>
</template>
