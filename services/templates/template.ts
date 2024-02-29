import ServiceType from '../shared/service-type';
import TemplateVisibility from './template-visibility';

export default interface ITemplate {
  _id: string;
  creatorId: string;
  description?: string;
  lastVersion?: string;
  lastVersionId: string;
  name: string;
  price?: number;
  service?: ServiceType;
  storeDescription?: string;
  thumbnail?: string;
  visibility: TemplateVisibility;
}
