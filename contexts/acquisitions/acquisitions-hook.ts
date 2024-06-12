import Acquisition, { ProductType } from '@/services/acquisition/acquisition';

export interface AcquisitionsHook {
  acquisitions: Acquisition[];
  addAcquisition: (acquisition: Acquisition) => void;
  isAcquired: (productType: ProductType, productId: string) => boolean;
}
