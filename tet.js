const fs = require("fs")

let data = {
    "results": [
        {
            "address_components": [
                {
                    "long_name": "277",
                    "short_name": "277",
                    "types": ["street_number"]
                },
                {
                    "long_name": "Bedford Avenue",
                    "short_name": "Bedford Ave",
                    "types": ["route"]
                },
                {
                    "long_name": "Williamsburg",
                    "short_name": "Williamsburg",
                    "types": ["neighborhood", "political"]
                },
                {
                    "long_name": "Brooklyn",
                    "short_name": "Brooklyn",
                    "types": ["political", "sublocality", "sublocality_level_1"]
                },
                {
                    "long_name": "Kings County",
                    "short_name": "Kings County",
                    "types": ["administrative_area_level_2", "political"]
                },
                {
                    "long_name": "New York",
                    "short_name": "NY",
                    "types": ["administrative_area_level_1", "political"]
                },
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"]
                },
                {
                    "long_name": "11211",
                    "short_name": "11211",
                    "types": ["postal_code"]
                }
            ],
            "formatted_address": "277 Bedford Ave, Brooklyn, NY 11211, USA",
            "types": ["street_address"]
        },
        {
            "address_components": [
                {
                    "long_name": "279",
                    "short_name": "279",
                    "types": ["street_number"]
                },
                {
                    "long_name": "Bedford Avenue",
                    "short_name": "Bedford Ave",
                    "types": ["route"]
                },
                {
                    "long_name": "Williamsburg",
                    "short_name": "Williamsburg",
                    "types": ["neighborhood", "political"]
                },
                {
                    "long_name": "Brooklyn",
                    "short_name": "Brooklyn",
                    "types": ["political", "sublocality", "sublocality_level_1"]
                },
                {
                    "long_name": "Kings County",
                    "short_name": "Kings County",
                    "types": ["administrative_area_level_2", "political"]
                },
                {
                    "long_name": "New York",
                    "short_name": "NY",
                    "types": ["administrative_area_level_1", "political"]
                },
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"]
                },
                {
                    "long_name": "11211",
                    "short_name": "11211",
                    "types": ["postal_code"]
                },
                {
                    "long_name": "4203",
                    "short_name": "4203",
                    "types": ["postal_code_suffix"]
                }
            ],
            "formatted_address": "279 Bedford Ave, Brooklyn, NY 11211, USA",
            "types": ["premise"]
        },
        {
            "address_components": [
                {
                    "long_name": "277",
                    "short_name": "277",
                    "types": ["street_number"]
                },
                {
                    "long_name": "Bedford Avenue",
                    "short_name": "Bedford Ave",
                    "types": ["route"]
                },
                {
                    "long_name": "Williamsburg",
                    "short_name": "Williamsburg",
                    "types": ["neighborhood", "political"]
                },
                {
                    "long_name": "Brooklyn",
                    "short_name": "Brooklyn",
                    "types": ["political", "sublocality", "sublocality_level_1"]
                },
                {
                    "long_name": "Kings County",
                    "short_name": "Kings County",
                    "types": ["administrative_area_level_2", "political"]
                },
                {
                    "long_name": "New York",
                    "short_name": "NY",
                    "types": ["administrative_area_level_1", "political"]
                },
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"]
                },
                {
                    "long_name": "11211",
                    "short_name": "11211",
                    "types": ["postal_code"]
                }
            ],
            "formatted_address": "277 Bedford Ave, Brooklyn, NY 11211, USA",
            "types": ["establishment", "point_of_interest"]
        },
        {
            "address_components": [
                {
                    "long_name": "291-275",
                    "short_name": "291-275",
                    "types": ["street_number"]
                },
                {
                    "long_name": "Bedford Avenue",
                    "short_name": "Bedford Ave",
                    "types": ["route"]
                },
                {
                    "long_name": "Williamsburg",
                    "short_name": "Williamsburg",
                    "types": ["neighborhood", "political"]
                },
                {
                    "long_name": "Brooklyn",
                    "short_name": "Brooklyn",
                    "types": ["political", "sublocality", "sublocality_level_1"]
                },
                {
                    "long_name": "Kings County",
                    "short_name": "Kings County",
                    "types": ["administrative_area_level_2", "political"]
                },
                {
                    "long_name": "New York",
                    "short_name": "NY",
                    "types": ["administrative_area_level_1", "political"]
                },
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"]
                },
                {
                    "long_name": "11211",
                    "short_name": "11211",
                    "types": ["postal_code"]
                }
            ],
            "formatted_address": "291-275 Bedford Ave, Brooklyn, NY 11211, USA",
            "types": ["route"]
        },
        {
            "address_components": [
                {
                    "long_name": "P27Q+MC",
                    "short_name": "P27Q+MC",
                    "types": ["plus_code"]
                },
                {
                    "long_name": "New York",
                    "short_name": "New York",
                    "types": ["locality", "political"]
                },
                {
                    "long_name": "New York",
                    "short_name": "NY",
                    "types": ["administrative_area_level_1", "political"]
                },
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"]
                }
            ],
            "formatted_address": "P27Q+MC New York, NY, USA",
            "types": ["plus_code"]
        },
        {
            "address_components": [
                {
                    "long_name": "South Williamsburg",
                    "short_name": "South Williamsburg",
                    "types": ["neighborhood", "political"]
                },
                {
                    "long_name": "Brooklyn",
                    "short_name": "Brooklyn",
                    "types": ["political", "sublocality", "sublocality_level_1"]
                },
                {
                    "long_name": "Kings County",
                    "short_name": "Kings County",
                    "types": ["administrative_area_level_2", "political"]
                },
                {
                    "long_name": "New York",
                    "short_name": "NY",
                    "types": ["administrative_area_level_1", "political"]
                },
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"]
                }
            ],
            "formatted_address": "South Williamsburg, Brooklyn, NY, USA",
            "types": ["neighborhood", "political"]
        },
        {
            "address_components": [
                {
                    "long_name": "11211",
                    "short_name": "11211",
                    "types": ["postal_code"]
                },
                {
                    "long_name": "Brooklyn",
                    "short_name": "Brooklyn",
                    "types": ["political", "sublocality", "sublocality_level_1"]
                },
                {
                    "long_name": "New York",
                    "short_name": "New York",
                    "types": ["locality", "political"]
                },
                {
                    "long_name": "New York",
                    "short_name": "NY",
                    "types": ["administrative_area_level_1", "political"]
                },
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"]
                }
            ],
            "formatted_address": "Brooklyn, NY 11211, USA",
            "types": ["postal_code"]
        },
        {
            "address_components": [
                {
                    "long_name": "Williamsburg",
                    "short_name": "Williamsburg",
                    "types": ["neighborhood", "political"]
                },
                {
                    "long_name": "Brooklyn",
                    "short_name": "Brooklyn",
                    "types": ["political", "sublocality", "sublocality_level_1"]
                },
                {
                    "long_name": "Kings County",
                    "short_name": "Kings County",
                    "types": ["administrative_area_level_2", "political"]
                },
                {
                    "long_name": "New York",
                    "short_name": "NY",
                    "types": ["administrative_area_level_1", "political"]
                },
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"]
                }
            ],
            "formatted_address": "Williamsburg, Brooklyn, NY, USA",
            "types": ["neighborhood", "political"]
        },
        {
            "address_components": [
                {
                    "long_name": "Kings County",
                    "short_name": "Kings County",
                    "types": ["administrative_area_level_2", "political"]
                },
                {
                    "long_name": "Brooklyn",
                    "short_name": "Brooklyn",
                    "types": ["political", "sublocality", "sublocality_level_1"]
                },
                {
                    "long_name": "New York",
                    "short_name": "NY",
                    "types": ["administrative_area_level_1", "political"]
                },
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"]
                }
            ],
            "formatted_address": "Kings County, Brooklyn, NY, USA",
            "types": ["administrative_area_level_2", "political"]
        },
        {
            "address_components": [
                {
                    "long_name": "Brooklyn",
                    "short_name": "Brooklyn",
                    "types": ["political", "sublocality", "sublocality_level_1"]
                },
                {
                    "long_name": "Kings County",
                    "short_name": "Kings County",
                    "types": ["administrative_area_level_2", "political"]
                },
                {
                    "long_name": "New York",
                    "short_name": "NY",
                    "types": ["administrative_area_level_1", "political"]
                },
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"]
                }
            ],
            "formatted_address": "Brooklyn, NY, USA",
            "types": ["political", "sublocality", "sublocality_level_1"]
        },
        {
            "address_components": [
                {
                    "long_name": "New York",
                    "short_name": "New York",
                    "types": ["locality", "political"]
                },
                {
                    "long_name": "New York",
                    "short_name": "NY",
                    "types": ["administrative_area_level_1", "political"]
                },
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"]
                }
            ],
            "formatted_address": "New York, NY, USA",
            "types": ["locality", "political"]
        },
        {
            "address_components": [
                {
                    "long_name": "New York",
                    "short_name": "NY",
                    "types": ["administrative_area_level_1", "political"]
                },
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"]
                }
            ],
            "formatted_address": "New York, USA",
            "types": ["administrative_area_level_1", "political"]
        },
        {
            "address_components": [
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"]
                }
            ],
            "formatted_address": "United States",
            "types": ["country", "political"]
        }
    ],
    "status": "OK"
}


let address = ""

let zipCode = ""

let city = ""

let answerRespo = {}

data.results.forEach(result => {
    if (result.types[0] !== "plus_code" && result.types[0] !== "route" && !result.types.includes("point_of_interest")) { }
    if(!answerRespo["formatted_address"]){
        answerRespo["formatted_address"] = result.formatted_address
        address = result.formatted_address
    }
    result.address_components.forEach(comp => {
        let key = comp.types.join("-")
        if (!answerRespo[key]) {
            answerRespo[comp.types.join("-")] = comp.long_name
        }
    })
})
zipCode = answerRespo["postal_code"]
if (answerRespo["political-sublocality-sublocality_level_1"]) {
    city = answerRespo["political-sublocality-sublocality_level_1"]
} else {
    if (answerRespo["political-sublocality-sublocality_level_2"]) {
        city = answerRespo["political-sublocality-sublocality_level_2"]
    } else {
        city = answerRespo["administrative_area_level_1-political"]
    }
}

console.log({ city, address, zipCode })