<script setup lang="ts">
import { onMounted, ref } from "vue"
// @ts-ignore
import { Loader } from "@googlemaps/js-api-loader"
import './gmap.d.ts'

import { t } from "i18next"

interface Props {
  coords: {
    lat: number,
    lng: number
  },
  details: {
    city: string,
    zip: string
  },
  address: string
}

const props = defineProps<Props>()
const emit = defineEmits(["update:coords", "update:details", "update:address"])

let GMAP_API_KEY = "AIzaSyAsg25KoeTUKIX_cuHAx4GWoLgESDRGgnU"

let placeRef = ref<HTMLInputElement>()

function addressComponents(data: {
  results: {
    formatted_address?: string;
    address_components?: google.maps.GeocoderAddressComponent[];
    types: string[]
  }[]
}): { address: string, zip: string, city: string } {

  let address = ""

  let zip = ""

  let city = ""

  let answerRespo: Record<string, string> = {}

  data.results.forEach((result) => {
    if (result.types[0] !== "plus_code" && result.types[0] !== "route" && !result.types.includes("point_of_interest")) {
      if (!answerRespo["formatted_address"]) {
        answerRespo["formatted_address"] = result.formatted_address ?? ""
        address = result.formatted_address ?? ""
      }
      result.address_components?.forEach(comp => {
        let key = comp.types.join("-")
        if (!answerRespo[key]) {
          answerRespo[comp.types.join("-")] = comp.long_name
        }
      })
    }
  })
  zip = answerRespo["postal_code"]
  if (answerRespo["political-sublocality-sublocality_level_1"]) {
    city = answerRespo["political-sublocality-sublocality_level_1"]
  } else {
    if (answerRespo["political-sublocality-sublocality_level_2"]) {
      city = answerRespo["political-sublocality-sublocality_level_2"]
    } else {
      city = answerRespo["administrative_area_level_1-political"]
    }
  }
  return {
    address,
    city,
    zip
  }
}
async function getLocationFromCoOrd(coord: { lat: number, lng: number }): Promise<{ address: string, zip: string, city: string }> {
  const data = await (await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coord.lat},${coord.lng}&key=${GMAP_API_KEY}`)).json()
  if (data.status === "OK") {
    return addressComponents(data)
  } else if (data.status === "ZERO_RESULTS") {
    return {
      address: "",
      city: "",
      zip: ""
    }
  } else {
    throw new Error("Something Wrong With Google Map API")
  }
}

const loader = new Loader({ apiKey: GMAP_API_KEY, libraries: ["places"] })

const mapRef = ref<HTMLDivElement>()

const map = ref<google.maps.Map>()

const marker = ref<google.maps.Marker>()

function syncMapProps(coords: {
  lat: number;
  lng: number;
}, resp: {
  address: string;
  zip: string;
  city: string;
}) {
  map.value?.setCenter(coords)
  map.value?.setZoom(15)
  emit("update:coords", coords)
  emit("update:address", resp.address)
  emit("update:details", { zip: resp.zip, city: resp.city })
}

function useCurrentLocation() {
  navigator.geolocation.getCurrentPosition(async function (pos) {
    let coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
    let resp = await getLocationFromCoOrd(coords)
    let inputEl = document.getElementById("place-search") as HTMLInputElement
    inputEl.value = resp.address
    inputEl.value = resp.address
    marker.value?.setPosition(coords)
    syncMapProps(coords, resp)
  })
}

onMounted(async () => {
  const isSupported = 'navigator' in window && "geolocation" in navigator
  if (isSupported) {
    await loader.load()
    let coords = { lat: props.coords.lat, lng: props.coords.lng }
    map.value = new google.maps.Map(mapRef.value!, {
      center: coords,
      zoom: 8,
    })
    marker.value = new google.maps.Marker({
      position: coords,
      map: map.value,
      title: "Hello World!",
      draggable: true
    });

    const autocomplete = new google.maps.places.Autocomplete(placeRef.value!, {
      fields: ["address_components", "geometry", "formatted_address"],
      types: ["address"]
    })
    let inputEl = document.getElementById("place-search") as HTMLInputElement
    marker.value.addListener("dragend", async function () {
      if (marker.value?.getPosition()) {
        let coords = { lat: marker.value?.getPosition()?.lat() ?? 0, lng: marker.value?.getPosition()?.lng() ?? 0 }
        let resp = await getLocationFromCoOrd(coords)
        inputEl.value = resp.address
        syncMapProps(coords, resp)
      } else {
      }
    })
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
      var place = autocomplete.getPlace() as Pick<google.maps.places.PlaceResult, "geometry" | "address_components" | "formatted_address">;
      let coords = { lng: place.geometry?.location?.lng() ?? 0, lat: place.geometry?.location?.lat() ?? 0 }
      let dict: Record<string, string> = {}
      let city = ""
      let zip = ""
      place.address_components?.forEach(com=>{
        dict[com.types.join("-")] = com.long_name
      })
      if(dict["administrative_area_level_3-political"]){
        city = dict["administrative_area_level_3-political"]
      }else{
        if(dict["administrative_area_level_2-political"]){
          city = dict["administrative_area_level_2-political"]
        }else{
          if(dict["administrative_area_level_1-political"]){
            city = dict["administrative_area_level_2-political"]
          }
        }
      }
      let address = place.formatted_address ?? ""
      marker.value?.setPosition(coords)
      syncMapProps(coords, { city, zip: '', address })
    })
  }
})
</script>
<template>
  <div class="w-full">
    <div class="flex w-full gap-2 items-center">
      <input autocomplete="off" :placeholder="(t('forms.report.questions.location.placeholder') as string)" id="place-search" type="text" class="my-4 w-full report-placeholder" ref="placeRef" />
      <button @click="useCurrentLocation"
        class="p-2 rounded-xl bg-purple-300  text-purple-900 hover:bg-purple-400 focus:bg-purple-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
          class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      </button> 
    </div>
    <div ref="mapRef" style="width:100%;height: 500px"></div>
  </div>
</template>