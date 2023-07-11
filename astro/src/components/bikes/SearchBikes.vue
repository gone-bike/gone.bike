<script setup lang="ts">
import { computed, ref, toRefs } from "vue";

import type { BikeModel } from "@app-types/bike_model";

const props = defineProps<{
  t: {
    brand: string;
    model: string;
    serial: string;
    description: string;
  };
  brandsAndModels: BikeModel.ReducedBrandsAndModels[];
  url: URL;
  type?: "listing" | "search";
}>();

const { t, brandsAndModels, url, type = "listing" } = toRefs(props);

const searchParams = new URLSearchParams(url.value.searchParams);
// console.log("searchParams: ", searchParams);

const selectedBrand = ref(
  searchParams.has("bike_brand")
    ? searchParams.get("bike_brand")
    : t.value.brand
);

const selectedModel = ref(
  searchParams.has("bike_model")
    ? searchParams.get("bike_model")
    : t.value.model
);

const modelsOfSelectedBrand = computed(() =>
  selectedBrand.value === t.value.brand
    ? []
    : brandsAndModels.value
        .filter((item) => item.brand === selectedBrand.value)
        .flatMap((entry) => entry.models)
);

function clearSelectedModel() {
  selectedModel.value = "";
}

const selectedSerial = ref(
  searchParams.has("serial") ? searchParams.get("serial") : ""
);

const inputSerial = ref("");

function setSelectedserial() {
  selectedSerial.value = inputSerial.value;
  inputSerial.value = "";
}

function clearSelectedSerial() {
  selectedSerial.value = "";
}

const description = ref(
  searchParams.has("description") ? searchParams.get("description") : ""
);

const formEl = ref<HTMLFormElement | null>(null);

function resetForm(event: Event) {
  event.preventDefault();
  // formEl.value?.reset();

  selectedBrand.value =
    selectedModel.value =
    description.value =
    selectedSerial.value =
    inputSerial.value =
      "";

  console.log("selectedBrand.value: ", selectedBrand.value);
  // window.location.reload();
}

function handleSubmit(event: Event) {
  event.preventDefault();

  const newUrl = url.value;

  const newSearchParams = new URLSearchParams(newUrl.search);

  selectedBrand.value
    ? newSearchParams.set("bike_brand", selectedBrand.value)
    : newSearchParams.delete("bike_brand");

  selectedModel.value
    ? newSearchParams.set("bike_model", selectedModel.value)
    : newSearchParams.delete("bike_model");

  selectedSerial.value
    ? newSearchParams.set("serial_number", selectedSerial.value)
    : newSearchParams.delete("serial_number");

  description.value
    ? newSearchParams.set("description", description.value)
    : newSearchParams.delete("description");

  newUrl.search = newSearchParams.toString();
  console.log("newUrl: ", newUrl);

  window.history.pushState({}, "", newUrl);
  window.location.reload();
}
</script>

<template>
  <form class="mt-8" id="search-form" @submit.prevent="" ref="formEl">
    <div class="grid gap-4 md:grid-cols-12 md:gap-x-8">
      <div class="md:col-span-6 xl:col-span-3">
        <!-- :class="{
          'xl:col-span-3': type === 'listing',
          'xl:col-span-6': type === 'search'
        }" -->
        <span class="block mb-2 text-sm font-medium text-customgray-900">
          <label for="brand" class=""> {{ t.brand }}</label>
          &
          <label for="model" class=""> {{ t.model }} </label>
        </span>

        <div class="flex">
          <select
            class="flex-shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg sm:text-base"
            name=""
            id="brand"
            v-model="selectedBrand"
            @change="clearSelectedModel"
          >
            <option selected disabled>{{ t.brand }}</option>
            <option
              v-for="item in brandsAndModels"
              :value="item.brand"
              :key="item.brand"
            >
              {{ item.brand }}
            </option>
          </select>
          <select
            id="model"
            class="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-r-lg border-l-gray-100 border-l-2 block w-full py-3 px-4 sm:text-base"
            v-model="selectedModel"
          >
            <option selected disabled>{{ t.model }}</option>
            <template v-if="modelsOfSelectedBrand.length > 0">
              <option v-for="item in modelsOfSelectedBrand" :value="item">
                {{ item }}
              </option>
            </template>
          </select>
        </div>
      </div>

      <div class="md:col-span-6 xl:col-span-2" v-if="type === 'listing'">
        <label
          for="input-serial-number"
          class="block mb-2 text-sm font-medium text-gray-900"
        >
          {{ t.serial }}</label
        >
        <div
          class="border border-gray-300 text-gray-900 text-sm rounded-lg w-full pl-3 flex items-center gap-2 focus-within:ring-2 focus-within:ring-primary-600"
        >
          <span
            class="tag inline-flex items-center justify-center space-x-2 px-1.5 py-1 bg-gray-100 rounded"
            v-if="selectedSerial"
          >
            <span class="text-xs text-gray-600">
              {{ selectedSerial }}
            </span>
            <button
              @click="clearSelectedSerial"
              aria-label="clear serial number"
            >
              <svg
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
          </span>

          <input
            id="input-serial-number"
            type="text"
            v-model="inputSerial"
            :placeholder="t.serial"
            class="w-full p-3 rounded-lg border-none outline-none text-sm text-gray-900 focus:ring-0 sm:text-base"
            @keyup.enter="setSelectedserial"
            @keyup.delete="clearSelectedSerial"
          />
        </div>
      </div>
      <div class="md:col-span-8 xl:col-span-4" v-if="type === 'listing'">
        <label
          for="description"
          class="block mb-2 text-sm font-medium text-gray-900"
        >
          {{ t.description }}</label
        >
        <input
          type="text"
          id="description"
          v-model.trim="description"
          class="block w-full py-3 px-5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base focus-within:ring-primary-600"
          :placeholder="t.description"
        />
      </div>

      <div
        :class="{
          'md:col-span-4 md:self-end md:justify-items-stretch xl:col-span-3 flex justify-center gap-2':
            type === 'listing',
          'md:col-span-6 md:self-end md:justify-items-stretch xl:col-span-3 flex justify-end gap-2':
            type === 'search'
        }"
      >
        <button
          class="bg-gray-100 p-3 rounded-lg hover:bg-red-400 focus:bg-red-400"
          type="reset"
          @click="resetForm"
        >
          Clear
        </button>
        <button
          type="button"
          id="search-form-submit"
          class="w-full flex items-center justify-center gap-x-2 text-white bg-primary-600 border border-transparent rounded-lg p-3 text-center"
          @click="handleSubmit"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6 2.00003C4.93913 2.00003 3.92172 2.42146 3.17157 3.17161C2.42143 3.92175 2 4.93917 2 6.00003C2 7.0609 2.42143 8.07832 3.17157 8.82846C3.92172 9.57861 4.93913 10 6 10C7.06087 10 8.07828 9.57861 8.82843 8.82846C9.57857 8.07832 10 7.0609 10 6.00003C10 4.93917 9.57857 3.92175 8.82843 3.17161C8.07828 2.42146 7.06087 2.00003 6 2.00003ZM1.13461e-07 6.00003C-0.00012039 5.05574 0.222642 4.12475 0.650171 3.28278C1.0777 2.4408 1.69792 1.71163 2.4604 1.15456C3.22287 0.597487 4.10606 0.228246 5.03815 0.0768669C5.97023 -0.0745122 6.92488 -0.00375491 7.82446 0.283384C8.72404 0.570523 9.54315 1.06594 10.2152 1.72933C10.8872 2.39272 11.3931 3.20537 11.6919 4.10117C11.9906 4.99697 12.0737 5.95063 11.9343 6.88459C11.795 7.81855 11.4372 8.70643 10.89 9.47603L15.707 14.293C15.8892 14.4816 15.99 14.7342 15.9877 14.9964C15.9854 15.2586 15.8802 15.5094 15.6948 15.6949C15.5094 15.8803 15.2586 15.9854 14.9964 15.9877C14.7342 15.99 14.4816 15.8892 14.293 15.707L9.477 10.891C8.57936 11.5293 7.52335 11.9082 6.42468 11.9862C5.326 12.0641 4.22707 11.8381 3.2483 11.333C2.26953 10.8279 1.44869 10.0631 0.875723 9.12239C0.30276 8.18171 -0.000214051 7.10147 1.13461e-07 6.00003Z"
              fill="white"
            ></path>
          </svg>

          <span class="block w-max">Search Bikes</span>
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped></style>
