<template>
  <form class="w-full md:w-max" id="form" method="POST" ref="formEl">
    <label
      for="file"
      class="cursor-pointer flex items-center justify-center border-2 border-mygray-200 shadow-xl rounded-lg p-3 bg-white"
    >
      <div class="px-2 flex flex-col items-center">
        <svg
          class="cursor-pointer"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- aria-hidden="true" -->
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          ></path>
        </svg>

        <input
          ref="fileEl"
          id="file"
          name="file"
          type="file"
          class="inset-0 opacity-0 cursor-pointer w-1 h-1"
          @change="handleSubmit"
        />
        <!-- onchange="document.getElementById('form').submit();" -->
      </div>
      <span class="mr-1 mb-1.5">
        {{
          t("homepage.hero.image_search", "Image search") ?? "Image search"
        }}</span
      >
    </label>
    <input type="submit" hidden />
    <div
      class="fixed top-0 bottom-0 left-0 right-0 w-screen h-screen z-20 bg-black/30 items-center justify-center p-4 md:p-6 flex"
      v-if="showProgress"
      @click.self="handleReset"
    >
      <div class="bg-white rounded-lg p-4 shadow-lg max-w-lg w-full relative">
        <button
          class="absolute top-4 right-2 p-2 cursor-pointer"
          @click="handleReset"
        >
          <svg
            class="w-4 h-4"
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.575818 0.575751C0.688335 0.463269 0.84092 0.400079 1.00002 0.400079C1.15912 0.400079 1.3117 0.463269 1.42422 0.575751L4.00002 3.15155L6.57582 0.575751C6.63117 0.518445 6.69737 0.472736 6.77058 0.44129C6.84378 0.409845 6.92251 0.393293 7.00218 0.392601C7.08184 0.391908 7.16085 0.407089 7.23459 0.437258C7.30833 0.467426 7.37532 0.511978 7.43165 0.568314C7.48799 0.62465 7.53254 0.691641 7.56271 0.765379C7.59288 0.839116 7.60806 0.918124 7.60737 0.997792C7.60668 1.07746 7.59012 1.15619 7.55868 1.22939C7.52723 1.3026 7.48152 1.3688 7.42422 1.42415L4.84842 3.99995L7.42422 6.57575C7.53351 6.68891 7.59399 6.84047 7.59262 6.99779C7.59126 7.15511 7.52815 7.3056 7.41691 7.41684C7.30566 7.52809 7.15518 7.59119 6.99786 7.59256C6.84054 7.59392 6.68898 7.53345 6.57582 7.42415L4.00002 4.84835L1.42422 7.42415C1.31106 7.53345 1.1595 7.59392 1.00218 7.59256C0.844859 7.59119 0.694372 7.52809 0.583127 7.41684C0.471882 7.3056 0.408781 7.15511 0.407414 6.99779C0.406047 6.84047 0.466524 6.68891 0.575818 6.57575L3.15162 3.99995L0.575818 1.42415C0.463336 1.31163 0.400146 1.15905 0.400146 0.999951C0.400146 0.840853 0.463336 0.688268 0.575818 0.575751Z"
              fill="#6B7280"
            ></path>
          </svg>
        </button>
        <template v-if="status === 'error'">
          <p class="text-center font-bold text-xl md:text-2xl">
            Oops, some error happened. Please try again later.
          </p>
        </template>

        <template v-else>
          <p class="text-center font-bold text-xl md:text-2xl">Please wait..</p>

          <template v-if="status === 'uploading'">
            <span class="mt-2 block text-center text-gray-800">
              Progress of image uploading:
              <span class="font-bold">{{ progress }}</span
              >%
            </span>
            <div class="mt-2 w-full bg-gray-200 rounded-full h-1.5">
              <div
                class="bg-primary-700 w-full h-full rounded-full transform transition-transform origin-left scale-x-0"
                :style="{ transform: `scaleX(${progress}%)` }"
              ></div>
            </div>

            <img
              v-if="imageSrc"
              class="mt-5 mx-auto w-44 h-full md:w-60"
              :src="imageSrc"
            />
          </template>
          <template v-else-if="status === 'searching'">
            <span class="mt-2 block text-center text-gray-800">
              Please wait while search is running
            </span>
            <div class="loader">Loading...</div>
          </template>
        </template>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { t } from "i18next";
import axios from "axios";
import { ref } from "vue";

const fileEl = ref<HTMLInputElement>();
const formEl = ref<HTMLFormElement>();

const imageSrc = ref("");

const progress = ref(0);
const showProgress = ref(false);

const status = ref<"uploading" | "searching" | "error">("uploading");

async function handleSubmit() {
  try {
    if (!fileEl.value) {
      return;
    }

    const file = fileEl.value.files?.[0];

    if (!file) {
      throw new Error("no file selected");
    }

    imageSrc.value = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append("file", file);

    handleShowProgress(true);

    const responseUpload = await axios.post("/api/input/upload", formData, {
      headers: {
        "Content-type": "multipart/form-data"
      },
      onUploadProgress: (p) => {
        // console.log("p: ", p);
        // console.log("p: ", p.loaded);
        const percentCompleted = Math.round((p.loaded * 100) / p.total);
        // console.log(percentCompleted);
        updateProgress(percentCompleted);
      }
    });
    // console.log("responseUpload: ", responseUpload);

    if (responseUpload.status !== 200) {
      status.value = "error";
      throw new Error("error while upload image");
    }

    status.value = "searching";

    const response = await fetch("/api/search", {
      //  headers: {
      //   "Content-Type": "multipart/form-data"
      // },
      method: "POST",
      body: formData
    });
    console.log("response: ", response);

    if (!response.ok) {
      status.value = "error";
      throw new Error("error while search image");
    }

    // let result = await response.json();
    // console.log("result: ", result);

    // console.log(response);
    if (response.redirected && response.url) {
      window.location.assign(response.url);
    }
  } catch (error) {
    console.log("error: ", error);
    status.value = "error";
    throw error;
  }
}

function handleReset() {
  handleShowProgress(false);
  updateProgress(0);
  formEl.value?.reset();
}

function handleShowProgress(val: boolean) {
  showProgress.value = val;
}

function updateProgress(num: number) {
  progress.value = num;
}
</script>

<style>
.loader {
  @apply text-primary-600;
  font-size: 20px;
  margin: 100px auto;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  -webkit-animation: load4 1.3s infinite linear;
  animation: load4 1.3s infinite linear;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}
@-webkit-keyframes load4 {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em,
      0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em,
      0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0,
      0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em,
      0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em,
      0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em,
      0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em,
      0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em,
      0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}
@keyframes load4 {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em,
      0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em,
      0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0,
      0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em,
      0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em,
      0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em,
      0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em,
      0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em,
      0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}
</style>
