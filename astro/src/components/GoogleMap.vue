<script setup lang="ts">
import { onMounted, ref } from "vue"
import { Loader } from "@googlemaps/js-api-loader"
import './gmap.d.ts'

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

onMounted(async () => {
  const isSupported = 'navigator' in window && "geolocation" in navigator
  if (isSupported) {
    await loader.load()
    navigator.geolocation.getCurrentPosition(async function (pos) {
      emit("update:coords", { lat: pos.coords.latitude, lng: pos.coords.longitude })
      map.value = new google.maps.Map(mapRef.value!, {
        center: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        zoom: 1,
      })
      let marker = new google.maps.Marker({
        position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        map: map.value,
        title: "Hello World!",
        draggable: true
      });
      let resp = await getLocationFromCoOrd({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      console.log(resp)
      emit("update:address", resp.address)
      emit("update:details", { zip: resp.zip, city: resp.city })
      const autocomplete = new google.maps.places.Autocomplete(placeRef.value!, {
        fields: ["address_components", "geometry"],
        types: ["address"]
      })
      let inputEl = document.getElementById("place-search") as HTMLInputElement
      marker.addListener("dragend", async function () {
        if (marker.getPosition()) {
          console.log("Hiiit")
          emit('update:coords', { lat: marker.getPosition()?.lat() ?? 0, lng: marker.getPosition()?.lng() ?? 0 })
          let resp = await getLocationFromCoOrd({ lat: marker.getPosition()?.lat() ?? 0, lng: marker.getPosition()?.lng() ?? 0 })
          emit("update:address", resp.address)
          inputEl.value = resp.address
          emit("update:details", { zip: resp.zip, city: resp.city })
        } else {
          console.log("Here")
        }
      })
      google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace() as Pick<google.maps.places.PlaceResult, "geometry" | "address_components">;
        emit("update:coords", { lng: place.geometry?.location?.lng() ?? 0, lat: place.geometry?.location?.lat() ?? 0 })
        marker.setPosition({ lng: place.geometry?.location?.lng() ?? 0, lat: place.geometry?.location?.lat() ?? 0 })
        const { address, city, zip } = addressComponents({ results: [{ address_components: place.address_components, types: [] }] })
        emit("update:address", address)
        emit("update:details", { city, zip })
      })
    })
  }
})
</script>
<template>
  <div class="w-full">
    <input id="place-search" type="text" class="my-4" ref="placeRef" />
    <div ref="mapRef" style="width:100%;height: 500px"></div>
  </div>
</template>