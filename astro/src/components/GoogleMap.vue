<script setup lang="ts">
import { onMounted, ref } from "vue"
import { Loader } from "@googlemaps/js-api-loader"
import './gmap.d.ts'

let GMAP_API_KEY = "AIzaSyAsg25KoeTUKIX_cuHAx4GWoLgESDRGgnU"
const position = ref({ lat: 0, lng: 0 })

const loader = new Loader({ apiKey: GMAP_API_KEY })

const mapRef = ref<HTMLDivElement>()

const map = ref<google.maps.Map>()

const isSupported = 'navigator' in window && "geolocation" in navigator
onMounted(async () => {
    if (isSupported) {
        await loader.load()
        navigator.geolocation.getCurrentPosition(function (pos) {
            position.value.lat = pos.coords.latitude
            position.value.lng = pos.coords.longitude
            map.value = new google.maps.Map(mapRef.value!, {
                center: position.value,
                zoom: 1,
            })
          let marker =  new google.maps.Marker({
                position: position.value,
                map: map.value,
                title: "Hello World!",
                draggable: true
            });
            marker.addListener("dragend", function(){
                if(marker.getPosition()){
                    position.value.lat = marker.getPosition()?.lat()
                    position.value.lng = marker.getPosition()?.lng()
                }
            })
        })
    }
})
</script>
<template>
    <div>
        Lat: {{ position.lat }}
        Lng: {{ position.lng }}
    </div>
    <div ref="mapRef" style="width:500px;height: 500px"></div>
</template>