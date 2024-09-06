import { ServiceType } from '@staroverlay/sdk';

export default interface CreateTemplateDTO {
  name: string;
  service: ServiceType;
}
