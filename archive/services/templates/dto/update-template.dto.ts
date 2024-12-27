import { ServiceType, TemplateVisibility } from '@staroverlay/sdk';

export default interface UpdateTemplateDTO {
  description?: string;
  name?: string;
  price?: number;
  service?: ServiceType;
  storeDescription?: string;
  thumbnail?: string;
  visibility?: TemplateVisibility;
}
