export type ProductType = 'template';

export default interface Acquisition {
  _id: string;
  isGift: boolean;
  gifterProfileId?: string;
  profileId: string;
  productId: string;
  productType: ProductType;
}
