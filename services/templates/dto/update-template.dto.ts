import ServiceType from '@/services/shared/service-type';

import TemplateVisibility from '../template-visibility';

export default interface UpdateTemplateDTO {
  description?: string;
  name?: string;
  price?: number;
  service?: ServiceType;
  storeDescription?: string;
  thumbnail?: string;
  visibility?: TemplateVisibility;
}
