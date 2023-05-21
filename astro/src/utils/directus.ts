import { Directus } from '@directus/sdk';
import config from "@utils/config"




type Report = {
    id: ID;
    status: string;
    photos: {
        directus_files_id: {
            id: ID;
            filename_disk: string;
            type: string;
            width: Number;
            height: Number;
        }
    };
    bike_brand_model: {
        name: string;
        bike_brand: {
            id: ID,
            key: string;
            name: string;
        }
    };
    language: {
        locale_code: string;
    };
    main_photo: {
        id: ID;
        filename_disk: string;
        type: string;
        width: Number;
        // height: Number;
    };
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
    }
});


export default directus;
