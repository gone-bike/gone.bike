import { Directus } from '@directus/sdk';
import config from "@utils/config"




type Report = {
    id: any;
    status: string;
    description: string;
    location: object;
    theft_date: Date;
    theft_timeframe: string;
    theft_location_type: string;
    colors: string[];
    serial_number: string;
    approximate_value: number;
    approximate_value_currency: string;

    lock_type: string;
    lock_anchor: string;

    photos: {
        directus_files_id: {
            id: any;
            filename_disk: string;
            type: string;
            width: Number;
            height: Number;
        }
    };
    bike_brand_model: {
        name: string;
        bike_brand: {
            id: any,
            key: string;
            name: string;
        }
    };
    language: {
        locale_code: string;
    };
    main_photo: {
        id: any;
        filename_disk: string;
        type: string;
        width: Number;
        // height: Number;
    };
    getPhotos: Function;
};

type GoneBike = {
	report: Report;
};


/**
 * Helper object to interact with Directus
 */
const directus = new Directus<GoneBike>(config.DIRECTUS_URI, {
    auth: {
        staticToken: config.DIRECTUS_TOKEN
    },
    transport: {
        timeout: 2000
    }
});


export default directus;
