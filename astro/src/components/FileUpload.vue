<script setup lang="ts">
import { ref } from "vue";
import { t as i18next } from "i18next";
import axios from "axios";

const props = defineProps<{
  modelValue:
    | string
    | {
        upload: string;
        name: string;
      };
  showAlert: (param: { title: string; subtitle: string }) => void;
  isUploading: boolean;
  errorText: string;
  someThingWentWrongError: string;
}>();

const isError = ref(false);
const cancelError = ref(false);

const emit = defineEmits([
  "update:modelValue",
  "update:isUploading",
  "delete",
  "upload",
]);

const fileUploadEl = ref<HTMLInputElement>();

const uploadData = ref<{
  upload: string;
  lastModified: number;
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  href: string;
}>();

const progressWidth = ref();
const progressBarName = ref("");

const progressBarIsOpen = ref(false);
function deleteFile() {
  uploadSignal.value.abort();
  uploadSignal.value = new AbortController();
  emit("update:isUploading", false);
  progressBarIsOpen.value = false;
  uploadData.value = undefined;
  cancelError.value = true;
  emit("update:modelValue", "");
}
let uploadSignal = ref(new AbortController());
async function handleMainFileUpload() {
  isError.value = false;
  cancelError.value = false;
  let file = fileUploadEl.value?.files?.item(0) as File;
  if (file.type.slice(0, 5) !== "image") {
    props.showAlert({
      title: props.errorText,
      subtitle: props.someThingWentWrongError,
    });
    return;
  }
  const formData = new FormData();
  formData.append("file", file);
  progressBarName.value = file.name;
  try {
    emit("update:isUploading", true);
    let resp = await axios.post("/api/input/upload", formData, {
      onUploadProgress({ total, loaded }) {
        if (total) {
          if (!progressBarIsOpen.value) {
            progressBarIsOpen.value = true;
          }
          let progress = Math.floor((loaded * 100) / total) + "%";
          progressWidth.value = progress;
        }
      },
      signal: uploadSignal.value.signal,
    });
    emit("update:isUploading", false);
    emit("upload");
    if (resp.data.upload) {
      uploadData.value = resp.data;
      emit("update:modelValue", {
        upload: resp.data.upload,
        name: resp.data.name,
      });
    }
  } catch {
    if (!cancelError.value) {
      isError.value = true;
    }
    emit("update:isUploading", false);
    props.showAlert({
      title: props.errorText,
      subtitle: props.someThingWentWrongError,
    });
  }
}
</script>
<template>
  <div class="mb-4">
    <KeepAlive>
      <label
        v-if="!progressBarIsOpen"
        class="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase text-primary-600 border border-blue cursor-pointer hover:bg-primary-700 hover:text-white"
      >
        <svg
          class="w-8 h-8"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"
          />
        </svg>
        <span class="mt-2 text-base font-bold leading-normal">{{
          i18next("forms.report.questions.file_upload.cta_text")
        }}</span>
        <input
          spellcheck="false"
          type="file"
          class="hidden"
          ref="fileUploadEl"
          @input="handleMainFileUpload"
        />
      </label>
    </KeepAlive>
    <p
      v-show="isError"
      class="text-sm flex justify-between my-3 bg-red-200 text-red-600 p-2 rounded-lg"
    >
      <span>{{ i18next(`forms.report.questions.file_upload.error_msg`) }}</span>
      <button class="text-red-800" @click="isError = false">&#10006;</button>
    </p>
    <p
      v-show="cancelError"
      class="text-sm flex justify-between my-3 bg-red-200 text-red-600 p-2 rounded-lg"
    >
      <span>{{
        i18next(`forms.report.questions.file_upload.cancel_error_msg`)
      }}</span>
      <button @click="cancelError = false">&#10006;</button>
    </p>
    <div class="w-full flex items-center flex-col">
      <div v-if="uploadData">
        <img
          :src="uploadData.href"
          class="mt-2"
          :width="uploadData.width"
          :height="uploadData.height"
          :alt="uploadData.name"
        />
      </div>
      <div
        v-if="progressBarIsOpen"
        class="w-full mt-3 relative px-1 h-10 flex justify-between items-center gap-4 border rounded bg-blue-300 transition-all duration-300"
      >
        <div
          class="h-7 text-white flex items-center bg-primary-600 rounded-md"
          :style="{
            width: progressWidth,
          }"
        >
          <p class="text-sm m-2 ml-5 absolute">
            {{ progressBarName }}
          </p>
        </div>

        <button
          @click="deleteFile"
          class="bg-red-300 text-red-700 p-1 rounded-lg hover:bg-red-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
