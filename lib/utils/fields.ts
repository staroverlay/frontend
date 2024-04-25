import ITemplateFieldGroup from '../../services/templates/template-field-group';
import ITemplateField from '../interfaces/templates/template-field';

export function getFieldPath(cat: ITemplateFieldGroup, field: ITemplateField) {
  const categoryId = cat && cat.id != '' ? cat.id : null;
  return categoryId ? `${categoryId}.${field.id}` : field.id;
}
