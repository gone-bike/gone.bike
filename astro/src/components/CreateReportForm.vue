<script setup lang="ts">
import { t as i18next } from "i18next"
import { onMounted, reactive, ref, toRaw, watch, watchEffect } from "vue"

import axios from "axios";

// @ts-ignore
import DatePicker from 'vue-datepicker-ui';
import 'vue-datepicker-ui/lib/vuedatepickerui.css';

import EmailIcon from "@components/icons/Email.vue"

import AutoComplete from "./AutoComplete.vue"
import InputField from "./InputField.vue"
import SelectField from "./SelectField.vue"
import FileUpload from "./FileUpload.vue"
import ColorField from "./ColorField.vue";
import Stepper from "./Stepper.vue";
import GoogleMap from "./GoogleMap.vue"


let topOffset = ref(0)

const props = defineProps<{
    currency: string,
    bikeBrand: { key: number, value: string }[],
    lang: string,
    maxUploads: number,
    photoTranslation: string,
    errorText: string,
    addressFieldRequiredError: string,
    photoRequiredError: string,
    waitWhileUploadError: string,
    validEmailError: string,
    someThingWentWrongError: string,
    mapsApiKey: string,
    lang: string,
}>()

let errorText = props.errorText
let addressFieldRequiredError = props.addressFieldRequiredError
let photoRequiredError = props.photoRequiredError
let waitWhileUploadError = props.waitWhileUploadError
let validEmailError = props.validEmailError

function validateEmail(email: string) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

let bikeModelsApi = ref<{ key: string, value: string }[]>([]);

let bikeBrandApi: { key: number, value: string }[] = props.bikeBrand

let noOfOtherUploads = ref(1)

let isUploading = ref(false)

let formValue = reactive({
    bike_brand: '',
    bike_brand_id: '',
    bike_model: '',
    bike_model_id: '',
    bike_details: '',
    approximate_value: "",
    approximate_value_currency: props.currency,
    colors: '',
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
    email: '',
    language: props.lang,
    is_electric: "",
    serial_number: "",
    bike_type: "",
})

let modelCache: Record<string, typeof bikeModelsApi.value> = reactive({})

watch(() => formValue.bike_brand_id, async function (val) {
    if (val) {
        if (modelCache[val]) {
            bikeModelsApi.value = modelCache[val]
        } else {
            const modelData = await (await fetch(`/api/bike_model.json?brand=${val}`)).json()
            bikeModelsApi.value = modelData.data
            modelCache[val] = modelData.data
        }
    } else {
        bikeModelsApi.value = []
    }
})

let theftDateUnformated = ref<Date>(new Date(Date.now()))

watchEffect(() => {
    let date = theftDateUnformated.value
    if (date) {
        let month = date.getMonth()+1, day = date.getDate();
        formValue.theft_date = `${date.getFullYear()}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}`: day }`
    }
})

let errors = reactive({
    location: false,
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

async function onSubmit(formData: typeof formValue) {
    try {
        // @ts-ignore
        formData['cf_turnstile_response'] = window.captchaToken;
        let dat = await axios.post("/api/input/report-submit", formData, {
            validateStatus: function (status) {
                return status === 200
            }
        })
        console.log(dat.data)
        currentPage.value = 7
    } catch {
        currentPage.value = 8
    }
}

let canChange = ref<boolean>(false)
onMounted(() => {
    canChange.value = true
    window.location.hash = ""
    window.onhashchange = function () {
        let page = 0
        if(window.location.hash){
           page = +window.location.hash.slice(6)
        }else{
           page = 1
        }
        currentPage.value = page
        window.scrollTo({ top: 0, behavior: "smooth" })
        let prevPage = stack.value[stack.value.length - 1]
        stack.value = [...stack.value, page]
        if (prevPage === 2 && page === 3) {
            if (formValue.location_address) {
                errors.location = false
                closeAlert()
            } else {
                showAlert({
                    title: errorText,
                    subtitle: addressFieldRequiredError
                })
                errors.location = true
                window.location.hash = "#page-2"
            }
        } else if (prevPage === 3 && page === 4) {
            if (typeof formValue.main_photo === "string") {
                showAlert({
                    title: errorText,
                    subtitle: photoRequiredError
                })
                window.location.hash = "#page-3"
            } else if (isUploading.value) {
                showAlert({
                    title: errorText,
                    subtitle: waitWhileUploadError
                })
                window.location.hash = "#page-3"
            } else {
                closeAlert()
            }
        } else if (prevPage === 5 && page === 6) {
            if (formValue.email && validateEmail(formValue.email)) {
                closeAlert()
                onSubmit(toRaw(formValue))
            } else {
                showAlert({
                    title: errorText,
                    subtitle: validEmailError
                })
                window.location.hash = `#page-5`
            }
        } else {
        }
    }
})

let alertTitle = ref(errorText)
let alertSubtitle = ref(errorText)
let alertIsOpen = ref(false)
function openAlert() {
    alertIsOpen.value = true
}

function showAlert(param: { title: string; subtitle: string }) {
    openAlert()
    alertTitle.value = param.title;
    alertSubtitle.value = param.subtitle;
    setInterval(() => {
        alertIsOpen.value = false
    }, 10000)
}

function closeAlert() {
    alertIsOpen.value = false
}

let currentPage = ref(1)

</script>
<template>
    <div>
        <div v-show="alertIsOpen"
            class="top-2 left-2 fixed right-2 flex justify-between items-center z-50 p-4 bg-red-500 text-white border-b-8 border-b-black">
            <div>
                <h1 class="text-lg cursor-pointer font-semibold">{{ alertTitle }}</h1>
                <p class="text-sm cursor-pointer">{{ alertSubtitle }}</p>
            </div>
            <button @click="closeAlert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 hover:scale-110 cursor-pointer h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <Stepper v-if="currentPage < 6" :step="currentPage" />
        <div class="flex flex-col gap-12 w-full" v-show="currentPage === 1">
            <AutoComplete v-model:topOffset="topOffset" v-model:new-item="formValue.bike_brand"
                v-model:listed="formValue.bike_brand_id" :api="bikeBrandApi" title="bike_brand" />

            <!-- @TODO too much complexity to handle, left out for now
            <AutoComplete v-model:topOffset="topOffset" :api="bikeModelsApi"
                v-model:listed="formValue.bike_model_id" v-model:new-item="formValue.bike_model"
                title="bike_model" />
            <InputField v-show="formValue.bike_brand && !bikeModelsApi.length" v-model="formValue.bike_model"
                title="bike_model" />
            -->

            <InputField v-model="formValue.bike_model"
                title="bike_model" />

            <SelectField v-model="formValue.bike_type" title="bike_type"
                :list='["bmx", "city_bike", "road_bike", "mountain_bike", "folding", "fixie", "fat", "cargo"]' />

            <ColorField v-model="formValue.colors" title="colors" />

            <InputField v-model="formValue.serial_number"
                title="serial_number" />

            <div>
                <label for="is_electric" class="mb-2 ita text-lg">{{ t("is_electric") }}</label>
                <br />
                <div class="flex items-center mt-3">
                    <input type="radio" value="true" v-model="formValue.is_electric" aria-labelledby="is_electric" class="h-4 w-4 " name="is_electric"
                        id="is_electric_1">
                    <label for="is_electric_1" class="text-sm ml-2">{{
                        i18next("forms.report.questions.is_electric.choices.yes")
                    }}</label>
                </div>
                <div class="flex items-center mt-2">
                    <input type="radio" value="false" v-model="formValue.is_electric" aria-labelledby="is_electric" class="h-4 w-4" name="is_electric"
                        id="is_electric_2">
                    <label for="is_electric_2" class="text-sm ml-2">{{
                        i18next("forms.report.questions.is_electric.choices.no")
                    }}</label>
                </div>
            </div>
            <InputField type="number" :isCurrency="props.currency" v-model="formValue.approximate_value"
                title="approximate_value" />

                <div class="flex flex-col">
                <label for="bike_details" class="mb-2 text-lg">{{ t("bike_details") }}</label>
                <textarea name="bike_details" id="bike_details" class="report-placeholder" v-model="formValue.bike_details"
                    cols="30" rows="7"
                    :placeholder="(i18next(`forms.report.questions.bike_details.placeholder`) as string)"> </textarea>
                <span class="mt-2 text-sm font-normal text-gray-400 italic ">{{
                    i18next(`forms.report.questions.bike_details.subtitle`) }}</span>
            </div>

            <div class="flex w-full justify-between">
                <span></span>
                <a href="#page-2"
                    class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">{{
                        nextText }}</a>
            </div>
        </div>
        <div class="flex flex-col gap-12 w-full" v-show="currentPage === 2">
            <div class="flex flex-col w-full">
                <label for="theft_date" class="mb-2 text-lg">{{ t("theft_date") }}</label>
                <DatePicker :disabled-start-date="{
                    to: new Date('01.01.2010'),
                    from: Date.now()
                }" :lang="props.lang" v-model="theftDateUnformated" class="w-full" />
                <span class="mt-2 text-sm font-normal text-gray-400 italic ">{{
                    i18next(`forms.report.questions.theft_date.subtitle`) }}</span>

            </div>
            <SelectField :is-sort="false" :other="false" v-model="formValue.theft_timeframe" title="theft_timeframe"
                :list='["morning", "afternoon", "evening", "night"]' />
            <SelectField v-model="formValue.theft_location_type" title="location_type"
                :list='["street", "park", "cellar", "garage", "garden", "home", "office", "car", "train"]' />

            <SelectField v-model="formValue.lock_type" title="lock_type" :list='["chain", "ulock", "folding"]' />
            <SelectField v-model="formValue.lock_anchor" title="lock_anchor"
                :list='["tree", "gate", "fence", "post", "self_bike", "other_bike"]' />
            <div class="flex flex-col">
                <label for="location" class="text-lg">{{ t("location") }}</label>
                <p class="text-sm text-gray-400 mb-1 font-normal italic">{{
                    i18next("forms.report.questions.location.subtitle")
                }}
                </p>
                <GoogleMap :apikey="mapsApiKey" v-model:address="formValue.location_address" v-model:coords="formValue.location_coords"
                    v-model:details="formValue.location_details" />
                <p v-show="errors.location" class="text-sm flex justify-between mt-3 bg-red-200 text-red-600 p-2 font-mono">
                    <span>{{ i18next(`forms.report.questions.location_address.error_msg`) }}</span>
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
        <div class="flex flex-col gap-1 w-full" v-show="currentPage === 3">
            <p class="text-lg">{{ t("main_photo") }}</p>
            <p class="text-sm text-gray-400 mb-3 font-normal italic">
                {{ i18next("forms.report.questions.main_photo.subtitle") }}</p>
            <FileUpload :someThingWentWrongError="props.someThingWentWrongError" :errorText="props.errorText"
                :show-alert="showAlert" v-model="formValue.main_photo" v-model:isUploading="isUploading" />
            <div v-show="formValue.main_photo">
                <p class="mb-2 text-lg">{{ $props.photoTranslation }}</p>
                <FileUpload :someThingWentWrongError="props.someThingWentWrongError" :errorText="props.errorText"
                    v-model:isUploading="isUploading" v-show="noOfOtherUploads > 0" @upload="noOfOtherUploads++"
                    :show-alert="showAlert" v-model="formValue.photos_1" />
                <FileUpload :someThingWentWrongError="props.someThingWentWrongError" :errorText="props.errorText"
                    v-model:isUploading="isUploading" v-show="noOfOtherUploads > 1 && formValue.photos_1"
                    @upload="noOfOtherUploads++" :show-alert="showAlert" v-model="formValue.photos_2" />
                <FileUpload :someThingWentWrongError="props.someThingWentWrongError" :errorText="props.errorText"
                    v-model:isUploading="isUploading" v-show="noOfOtherUploads > 2 && formValue.photos_2"
                    @upload="noOfOtherUploads++" :show-alert="showAlert" v-model="formValue.photos_3" />
                <FileUpload :someThingWentWrongError="props.someThingWentWrongError" :errorText="props.errorText"
                    v-model:isUploading="isUploading" v-show="noOfOtherUploads > 3 && formValue.photos_3"
                    @upload="noOfOtherUploads++" :show-alert="showAlert" v-model="formValue.photos_4" />
            </div>
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
            <div class="flex flex-col">
                <label for="description" class="mb-2 text-lg">{{ t("description") }}</label>
                <textarea name="description" class="report-placeholder"
                    :placeholder="(i18next(`forms.report.questions.description.placeholder`) as string)" id="description"
                    v-model="formValue.description" cols="30" rows="10"></textarea>
                <span class="mt-2 font-normal italic text-gray-400">{{
                    i18next(`forms.report.questions.description.subtitle`) }}</span>
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
            <InputField type="email" v-model="formValue.email" title="enter_email" />
            <div class="flex w-full justify-between">
                <a href="#page-4"
                    class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">{{
                        backText }}</a>
                <a href="#page-6"
                    class="bg-purple-600 px-4 rounded-md active:bg-purple-700 hover:bg-purple-700 font-semibold py-2 text-white">{{
                        submitText }}</a>
            </div>
        </div>
        <div class="flex flex-col items-center w-full h-full justify-center" v-show="currentPage === 6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                class="w-14 animate-spin ease-in-out h-14 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <h1 class="text-3xl mb-4 font-semibold text-gray-500 mt-3 text-center">{{ i18next("pages.report_form.loading")
            }}</h1>
        </div>
        <div class="flex flex-col w-full h-full justify-center" v-show="currentPage === 7">
            <EmailIcon class="h-40 text-3xl text-purple-500" />
            <h1 class="text-3xl mb-4 font-semibold text-center">{{ i18next("pages.report_form.thank.title") }}</h1>
            <h1 class="text-xl mb-4 font-semibold text-center">{{ i18next("pages.report_form.thank.sub_title") }}</h1>
        </div>
        <div class="flex flex-col items-center w-full h-full justify-center" v-show="currentPage === 8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                class="w-14 h-14 text-red-500">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <h1 class="text-3xl mt-3 text-red-700 mb-4 font-semibold text-center">{{
                i18next("pages.report_form.error_page.title") }}</h1>
        </div>
    </div>
</template>
<style lang="postcss">
:root {
    --v-calendar-datepicker-icon-color: #9333EA !important;
}

.report-placeholder {
    @apply placeholder-gray-400
}
</style>
