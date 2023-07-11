export declare namespace BikeModel {
  export interface BikeModelProps {
    id?: string;
    showBrand?: boolean;
  }

  export interface ReducedBrandsAndModels {
    brand: string;
    models: string[];
  }

  export interface BikeBrandModelItem {
    key: number;
    name: string;
    bike_brand: {
      name: string;
    };
  }
}
