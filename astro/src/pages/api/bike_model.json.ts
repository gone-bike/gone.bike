import type { APIRoute } from 'astro';
import BikeModel from "@models/bike_model";

export const get: APIRoute = async ({ url })=>{
    // console.log(request)
    let data = await BikeModel( url.searchParams.get('brand')) ;
    let bikeModelsApi: { key: number, value: string }[] = data
    return {
        body: JSON.stringify({
            data: bikeModelsApi
        })
    }
}