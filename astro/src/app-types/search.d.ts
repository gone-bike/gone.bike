export declare namespace SearchOnImage {
  export interface SearchWeaviteItem {
    _additional: {
      certainty: number;
      id: string;
    };
    bike_brand: string;
    bike_model: string;
    filename_download: string;
    report_id: number;
    theft_date: Date;
  }

  export type SearchBikesType = "listing" | "search";
}
