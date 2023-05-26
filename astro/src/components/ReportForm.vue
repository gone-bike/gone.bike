<script setup lang="ts">
import { t as i18next } from "i18next"
import { onMounted, reactive, ref, toRaw, watch } from "vue"
// @ts-ignore
import VueDatePicker from "@vuepic/vue-datepicker"
import '@vuepic/vue-datepicker/dist/main.css'

import EmailIcon from "@components/icons/Email.vue"

import AutoComplete from "./AutoComplete.vue"
import InputField from "./InputField.vue"
import SelectField from "./SelectField.vue"
import FileUpload from "./FileUpload.vue"

import GoogleMap from "./GoogleMap.vue"


const props = withDefaults(defineProps<{ currency?: string }>(), {
    currency: "EU"
})

function validateEmail(email: string) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

let bikeModelsApi: { key: string, value: string }[] = [{ "key": "key-0", "value": "value-0" }, { "key": "key-1", "value": "value-1" }, { "key": "key-2", "value": "value-2" }, { "key": "key-3", "value": "value-3" }, { "key": "key-4", "value": "value-4" }, { "key": "key-5", "value": "value-5" }, { "key": "key-6", "value": "value-6" }, { "key": "key-7", "value": "value-7" }, { "key": "key-8", "value": "value-8" }, { "key": "key-9", "value": "value-9" }, { "key": "key-10", "value": "value-10" }, { "key": "key-11", "value": "value-11" }, { "key": "key-12", "value": "value-12" }, { "key": "key-13", "value": "value-13" }, { "key": "key-14", "value": "value-14" }, { "key": "key-15", "value": "value-15" }, { "key": "key-16", "value": "value-16" }, { "key": "key-17", "value": "value-17" }, { "key": "key-18", "value": "value-18" }, { "key": "key-19", "value": "value-19" }, { "key": "key-20", "value": "value-20" }, { "key": "key-21", "value": "value-21" }, { "key": "key-22", "value": "value-22" }, { "key": "key-23", "value": "value-23" }, { "key": "key-24", "value": "Value-24" }]
let bikeBrandApi: { key: string, value: string }[] = [{ "key": "key-0", "value": "value-0" }, { "key": "key-1", "value": "value-1" }, { "key": "key-2", "value": "value-2" }, { "key": "key-3", "value": "value-3" }, { "key": "key-4", "value": "value-4" }, { "key": "key-5", "value": "value-5" }, { "key": "key-6", "value": "value-6" }, { "key": "key-7", "value": "value-7" }, { "key": "key-8", "value": "value-8" }, { "key": "key-9", "value": "value-9" }, { "key": "key-10", "value": "value-10" }, { "key": "key-11", "value": "value-11" }, { "key": "key-12", "value": "value-12" }, { "key": "key-13", "value": "value-13" }, { "key": "key-14", "value": "value-14" }, { "key": "key-15", "value": "value-15" }, { "key": "key-16", "value": "value-16" }, { "key": "key-17", "value": "value-17" }, { "key": "key-18", "value": "value-18" }, { "key": "key-19", "value": "value-19" }, { "key": "key-20", "value": "value-20" }, { "key": "key-21", "value": "value-21" }, { "key": "key-22", "value": "value-22" }, { "key": "key-23", "value": "value-23" }, { "key": "key-24", "value": "Value-24" }]

let theftDateUnformated = ref("")

let formValue = reactive({
    bike_brand: '',
    bike_brand_id: '',
    bike_model: '',
    bike_model_id: '',
    approximate_value: "",
    approximate_value_currency: props.currency,
    color: '',
    theft_timeframe: '',
    theft_location_type: '',
    lock_type: '',
    theft_date: '',
    lock_anchor: '',
    location_address: '',
    location_details: {
        city: "",
        zip: ""
    },
    location_coords: {
        lat: 0,
        lng: 0
    },
    main_photo: "" as string | { upload: string, name: string },
    photos_1: '' as string | { upload: string, name: string },
    photos_2: '' as string | { upload: string, name: string },
    photos_3: '' as string | { upload: string, name: string },
    photos_4: '' as string | { upload: string, name: string },
    description: '',
    mail: '',
})

// Function for Handling Submission after Validations
function onSubmit(formData: typeof formValue) {
    console.log(formData)
}

watch(theftDateUnformated, function (e) {
    let date = new Date(e)
    formValue.theft_date = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
})


let errors = reactive({
    location: false,
    theft_date: false,
    main_photo: false,
    mail: false
})

let nextText = i18next("pages.report_form.buttons.next")
let backText = i18next("pages.report_form.buttons.back")
let submitText = i18next("pages.report_form.buttons.submit")

function t(str: string, param?: {}) {
    if (param) {
        return i18next(`forms.report.questions.${str}.title`, param)
    }
    return i18next(`forms.report.questions.${str}.title`)
}
let stack = ref<number[]>([])

let canChange = ref<boolean>(false)
onMounted(() => {
    canChange.value = true
    window.location.hash = "#page-1"
    window.onhashchange = function (win) {
        const page = +window.location.hash.slice(6)
        currentPage.value = page
        let prevPage = stack.value[stack.value.length - 1]
        stack.value = [...stack.value, page]
        if (prevPage === 2 && page === 3) {
            if (formValue.theft_date && formValue.location_address) {
                errors.theft_date = false
                errors.location = false
            } else {
                alert("Fill all Required Fields")
                if (!formValue.theft_date) {
                    errors.theft_date = true
                }
                if (!formValue.location_address) {
                    errors.location = true
                }
                window.location.hash = `#page-2`
            }
        }
        if (prevPage === 3 && page === 4) {
            if (typeof formValue.main_photo !== "string") {
                errors.main_photo = false
            } else {
                alert("Please Upload Photo")
                errors.main_photo = true
                window.location.hash = `#page-3`
            }
        }
        if (prevPage === 6 && page === 7) {
            if (formValue.mail && validateEmail(formValue.mail)) {
                errors.mail = false
                onSubmit(toRaw(formValue))
            } else {
                alert("Enter Valid Email")
                errors.mail = true
                window.location.hash = `#page-6`
            }
        }
    }
})


let currentPage = ref(1)
function generateDropDown(cat: string): (subcat: string) => string {
    return function (subcat: string) {
        return i18next(`forms.report.questions.${cat}.choices.${subcat}`)
    }
}
let theftTimeFrameGenerate = generateDropDown("theft_timeframe")
let theftLocationTypeGenerate = generateDropDown("location_type")
let lockTypeGenerate = generateDropDown("location_type")
let theftTimeFrameList = [theftTimeFrameGenerate('morning'), theftTimeFrameGenerate('afternoon'), theftTimeFrameGenerate('evening'), theftTimeFrameGenerate('night'),]
let theftLocationTypeList = [theftLocationTypeGenerate('street'), theftLocationTypeGenerate('park'), theftLocationTypeGenerate('cellar'), theftLocationTypeGenerate('garage'), theftLocationTypeGenerate('garden'), theftLocationTypeGenerate('home'), theftLocationTypeGenerate('office'), theftLocationTypeGenerate('car'), theftLocationTypeGenerate('train'),]
let lockTypeList = [lockTypeGenerate('chain'), lockTypeGenerate('lock'), lockTypeGenerate('no_lock'), lockTypeGenerate('unlock'), lockTypeGenerate('folding')]

</script>
<template>
    <div class="flex flex-col gap-12 w-full" v-show="currentPage === 1">
        <AutoComplete v-model:listed="formValue.bike_model_id" v-model:new-item="formValue.bike_model" :api="bikeModelsApi"
            title="bike_model" />
        <AutoComplete v-model:new-item="formValue.bike_brand" v-model:listed="formValue.bike_brand_id" :api="bikeBrandApi"
            title="bike_brand" />
        <InputField v-model="formValue.color" title="colors">
            <span class="text-gray-600 font-mono">{{ t(`forms.report.questions.colors.subtitle`) }}</span>
        </InputField>
        <div class="ml-2">
            <label for="is_electric" class="mb-2 text-lg">{{ t("is_electric") }}</label>
            <br />
            <div class="flex items-center mt-3">
                <input type="radio" value="1" aria-labelledby="is_electric" class="h-4 w-4 ml-2" name="is_electric"
                    id="is_electric_1">
                <label for="is_electric_1" class="ml-2 text-sm">Yes</label>
            </div>
            <div class="flex items-center mt-2">
                <input type="radio" value="2" aria-labelledby="is_electric" class="h-4 w-4 ml-2" name="is_electric"
                    id="is_electric_1">
                <label for="is_electric_1" class="ml-2 text-sm">No</label>
            </div>
        </div>
        <InputField v-model="formValue.approximate_value" title="approximate_value">
            <span class="text-gray-600 font-mono">{{ t(`forms.report.questions.colors.subtitle`) }}</span>
        </InputField>
        <div class="w-full h-[1px] bg-gray-200"></div>
        <div class="flex w-full justify-between">
            <span></span>
            <a href="#page-2"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">{{
                    nextText }}</a>
        </div>
    </div>
    <div class="flex flex-col gap-12 w-full" v-show="currentPage === 2">
        <div class="flex flex-col ml-2">
            <label for="theft_date" class="mb-2 text-lg">{{ t("theft_date") }}</label>
            <VueDatePicker v-model="theftDateUnformated" :max-date="new Date()" :no-today="true" />
            <p v-if="errors.theft_date" class="text-sm flex justify-between mt-3 bg-red-200 text-red-600 p-2 font-mono">
                <span>You must fill this field</span>
                <button @click="errors.theft_date = false">&#10006;</button>
            </p>
        </div>
        <SelectField v-model="formValue.theft_timeframe" title="theft_timeframe" :list='theftTimeFrameList' />
        <SelectField v-model="formValue.theft_location_type" title="location_type" :list='theftLocationTypeList' />
        <SelectField v-model="formValue.lock_type" title="lock_type" :list='lockTypeList' />
        <InputField v-model="formValue.lock_anchor" title="lock_anchor" />
        <div class="flex flex-col ml-2">
            <label for="location" class="text-lg">{{ t("location") }}</label>
            <p class="text-sm text-gray-500 mb-2 font-semibold">{{ i18next("forms.report.questions.location.subtitle") }}
            </p>
            <GoogleMap v-model:address="formValue.location_address" v-model:coords="formValue.location_coords"
                v-model:details="formValue.location_details" />
            <p v-if="errors.location" class="text-sm flex justify-between mt-3 bg-red-200 text-red-600 p-2 font-mono">
                <span>You must fill this field</span>
                <button @click="errors.location = false">&#10006;</button>
            </p>

        </div>
        <div class="flex w-full justify-between">
            <a href="#page-1"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">{{
                    backText }}</a>
            <a href="#page-3"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">{{
                    nextText }}</a>
        </div>
    </div>
    <div class="flex flex-col gap-12 w-full" v-show="currentPage === 3">
        <p class="mb-2 text-lg">{{ t("main_photo") }}</p>
        <FileUpload v-model="formValue.main_photo" />
        <p v-if="errors.main_photo" class="text-sm flex justify-between mt-3 bg-red-200 text-red-600 p-2 font-mono">
            <span>You must fill this field</span>
            <button @click="errors.main_photo = false">&#10006;</button>
        </p>
        <div class="flex w-full justify-between">
            <a href="#page-2"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">{{
                    backText }}</a>
            <a href="#page-4"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">{{
                    nextText }}</a>
        </div>
    </div>
    <div class="flex flex-col gap-12 w-full" v-show="currentPage === 4">
        <div>
            <p class="mb-2 text-lg">{{ t("photos", { n: 4 }) }}</p>
            <FileUpload v-model="formValue.photos_1" />
            <FileUpload v-model="formValue.photos_2" />
            <FileUpload v-model="formValue.photos_3" />
            <FileUpload v-model="formValue.photos_4" />
        </div>
        <div class="flex w-full justify-between">
            <a href="#page-3"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">{{
                    backText }}</a>
            <a href="#page-5"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">{{
                    nextText }}</a>
        </div>
    </div>
    <div class="flex flex-col gap-12 w-full" v-show="currentPage === 5">
        <div class="flex flex-col ml-2">
            <label for="description" class="mb-2 text-lg">{{ t("description") }}</label>
            <textarea name="description" id="description" v-model="formValue.description" cols="30" rows="10"></textarea>
        </div>
        <div class="flex w-full justify-between">
            <a href="#page-4"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">{{
                    backText }}</a>
            <a href="#page-6"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">{{
                    nextText }}</a>
        </div>
    </div>
    <div class="flex flex-col gap-12 w-full" v-show="currentPage === 6">
        <InputField type="email" v-model="formValue.mail" title="enter_email">
            <span class="text-gray-600 font-mono">{{ t(`forms.report.questions.enter_email.subtitle`) }}</span>
        </InputField>
        <p v-if="errors.mail" class="text-sm flex justify-between bg-red-200 text-red-600 p-2 font-mono">
            <span>Enter Valid Email</span>
            <button @click="errors.main_photo = false">&#10006;</button>
        </p>
        <div class="flex w-full justify-between">
            <a href="#page-5"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">{{
                    backText }}</a>
            <a href="#page-7"
                class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">{{
                    submitText }}</a>
        </div>
    </div>
    <div class="flex flex-col w-full h-full justify-center" v-show="currentPage === 7">
        <EmailIcon class="h-40 text-3xl text-purple-500" />
        <h1 class="text-3xl mb-4 font-semibold text-center">{{ i18next("pages.report_form.thank") }}</h1>
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