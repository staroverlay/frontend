import ServiceType from '@/services/shared/service-type';

export default interface CreateTemplateDTO {
  name: string;
  service: ServiceType;
}
