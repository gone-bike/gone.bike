export declare namespace Report {
  export interface ReportShort {
    id: number;
    theft_date: string;
    location_address: string;
    bike_brand_model: {
      name: string;
      bike_brand: {
        name: string;
        key: string;
      };
    };
    main_photo: DirectusFilesId;
    photos: {
      id: number;
      directus_files_id: DirectusFilesId;
      report_id: {
        id: number;
      };
    }[];
    description: string;
    serial_number: string;
  }

  export interface ReportDetails {
    id: number;
    user_created?: string;
    date_created?: string;
    user_updated?: string;
    date_updated?: string;
    status: string;
    bike_details?: string;
    description: string;
    location: { type: "Point"; coordinates: [number, number] };
    location_address?: string;
    theft_date: string;
    theft_timeframe: string;
    theft_location_type: string;
    colors: string[];
    serial_number: string;
    approximate_value: number;
    approximate_value_currency: string;

    lock_type: string;
    lock_anchor: string;

    activation_code: string | null;

    is_electric?: boolean;

    photos: {
      directus_files_id: {
        id: any;
        filename_download: string;
        type: string;
        width: number;
        height: number;
      };
    }[];
    bike_brand_model: {
      name: string;
      bike_brand: {
        id: any;
        key: string;
        name: string;
      };
    };
    bike_type?: string;
    language: {
      locale_code: string;
    };
    main_photo: {
      id: any;
      filename_download: string;
      type: string;
      width: number;
      height: number;
    };
  }
}
