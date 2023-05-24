import type { APIRoute } from "astro"

export const post: APIRoute = async function ({ request }) {
    let formData = await request.formData()
    formData.get("file")
    return {
        
    }
}