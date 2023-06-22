export default interface IPlan {
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
