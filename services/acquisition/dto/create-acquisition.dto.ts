import { ProductType } from '../acquisition';

export default interface CreateAcquisitionDTO {
  productId: string;
  productType: ProductType;
}
