import ServiceType from '@/services/shared/service-type';

import TemplateVisibility from '../template-visibility';

export default interface TemplateUpdateDTO {
  description?: string;
  name?: string;
  price?: number;
  service?: ServiceType;
  storeDescription?: string;
  thumbnail?: string;
  visibility?: TemplateVisibility;
}
