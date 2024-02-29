export default interface IPlan {
  _id: string;
  isDefault: boolean;
  name: string;
  perkDesignLibrary: boolean;
  perkModChat: boolean;
  maxEditors: number;
  maxStorageItems: number;
  maxStorageSize: number;
  maxWidgets: number;
  price: number;
  discountYearly: number;
}
