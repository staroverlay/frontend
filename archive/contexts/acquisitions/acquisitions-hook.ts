import { Acquisition, ProductType } from '@staroverlay/sdk';

export interface AcquisitionsHook {
  acquisitions: Acquisition[];
  addAcquisition: (acquisition: Acquisition) => void;
  isAcquired: (productType: ProductType, productId: string) => boolean;
}
