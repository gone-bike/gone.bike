<script setup lang="ts">
import { onMounted, ref } from "vue"
import { Loader } from "@googlemaps/js-api-loader"
import './gmap.d.ts'

let GMAP_API_KEY = "AIzaSyAsg25KoeTUKIX_cuHAx4GWoLgESDRGgnU"
const position = ref({ lat: 0, lng: 0 })

const loader = new Loader({ apiKey: GMAP_API_KEY })

const mapRef = ref<HTMLDivElement>()

const isSupported = 'navigator' in window && "geolocation" in navigator
onMounted(()=>{
    if(isSupported){
    loader.load().then(()=>{
        console.log("hii")
        new google.maps.Map(mapRef.value, {
         center: position.value,
         zoom: 7
        })
         navigator.geolocation.getCurrentPosition(function(pos){
             position.value.lat = pos.coords.latitude
             position.value.lng = pos.coords.longitude
         })
    }).catch(e=>{
        console.log(e, "HEreee")
    })
    }
})
</script>
<template>
    <div>
        Lat: {{ position.lat }}
        Lng: {{ position.lng }}
    </div>
    <div ref="mapRef" style="width:100%;height: 100px;"></div>
</template>