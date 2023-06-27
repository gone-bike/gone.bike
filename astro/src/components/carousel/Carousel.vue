<script setup lang="ts">
import type { Directus } from "@components/types/directus";
import { Swiper, SwiperSlide, useSwiper } from "swiper/vue";
import { Keyboard, Navigation, Pagination } from "swiper";

const props = defineProps<{
  items: Directus.DirectusFilesId[];
  initialPathImg: string;
}>();

// Import Swiper Vue.js components

// import Swiper core and required modules

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const swiper = useSwiper();

const modules = [Navigation, Pagination, Keyboard];

function renderBullet() {
  return `<span class="dot swiper-pagination-bullet !w-3 !h-3 rounded-full rounded-full"></span>`;
}
</script>

<template>
  <Swiper
    :lazy="true"
    :slides-per-view="1"
    :space-between="20"
    :modules="modules"
    :pagination="{
      el: '.pagination',
      clickable: true,
      renderBullet: renderBullet
    }"
    :navigation="{
      prevEl: '.button-prev',
      nextEl: '.button-next'
    }"
    :keyboard="true"
    :loop="false"
  >
    <SwiperSlide v-for="item in props.items" :key="item.id">
      <img
        :src="`${props.initialPathImg}/${item.id}/${item.filename_download}`"
        class="block w-full h-full max-h-48 object-cover rounded-lg"
        alt=""
        :width="item.width"
        :height="item.height"
        loading="lazy"
      />
    </SwiperSlide>

    <div class="mt-2.5 flex items-center justify-between">
      <button
        to-prev-slide
        class="btn-navigation button-prev inline-flex items-center justify-center p-1 z-20 bg-gray-800 rounded-full"
        @click="swiper.slidePrev()"
        aria-label="to previous slide"
      >
        <svg
          aria-hidden="true"
          class="w-3.5 h-3.5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
      </button>

      <div class="pagination flex justify-center gap-x-2"></div>

      <button
        to-next-slide
        class="btn-navigation button-next inline-flex items-center justify-center p-1 z-20 bg-gray-800 rounded-full"
        @click="swiper.slideNext()"
        aria-label="to next slide"
      >
        <svg
          aria-hidden="true"
          class="w-3.5 h-3.5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </button>
    </div>
  </Swiper>
</template>

<style scoped>
button.btn-navigation[disabled=""] {
  @apply !bg-gray-400;
}
</style>
types/directus
