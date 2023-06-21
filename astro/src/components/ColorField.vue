<script setup lang="ts">
import { t } from "i18next";
import { ref, watch } from "vue";

let tags = ref<string[]>([]);

const props = defineProps<{
  modelValue: string;
  title: string;
  type?: string;
}>();
const emit = defineEmits(["update:modelValue"]);

let tagModel = ref(props.modelValue);

watch(tagModel, function (val) {
  if (val === "") return;
  if (val.slice(0, val.length - 1).trim() === "") return;
  if (val[val.length - 1] === ",") {
    let newtags = [...tags.value, val.slice(0, val.length - 1)];
    tags.value = newtags;
    emit("update:modelValue", newtags.join(","));
    tagModel.value = "";
  }
});

function handleAdd() {
  if (
    tagModel.value
      .split("")
      .map((e) => e === ",")
      .filter((e) => e).length === tagModel.value.length
  )
    return;
  if (tagModel.value.trim() && tagModel.value !== ",") {
    let newLst = [...tags.value, tagModel.value.trim()];
    tags.value = newLst;
    tagModel.value = "";
    emit("update:modelValue", newLst.join(","));
  }
}

function remove(tag: string) {
  tags.value = tags.value.filter((e) => e !== tag);
}
</script>

<template>
  <div class="flex flex-col">
    <label :for="props.title" class="text-lg mb-2">{{
      t(`forms.report.questions.${props.title}.title`)
    }}</label>
    <input
      type="text"
      class="w-full block py-3 px-5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base focus-within:ring-primary-600 focus:ring-primary-600"
      @keydown.enter="handleAdd"
      @blur="handleAdd"
      autocomplete="off"
      :name="props.title"
      :placeholder="(t(`forms.report.questions.${props.title}.placeholder`) as string)"
      :id="props.title"
      v-model="tagModel"
    />
    <span class="mt-2 text-sm font-normal text-gray-400 italic">{{
      t(`forms.report.questions.${props.title}.subtitle`)
    }}</span>
    <ul class="flex gap-2 mt-2">
      <li
        v-for="tag in tags"
        :key="tag"
        class="w-fit flex items-center gap-2 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 bg-primary-600 px-3 py-1 font-semibold text-white"
      >
        <span class="mb-1">{{ tag }}</span>
        <button @click="remove(tag)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="h-4 w-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>
