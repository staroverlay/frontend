import ITemplateField from '@/services/templates/template-field';
import ITemplateFieldGroup from '@/services/templates/template-field-group';

export function getFieldPath(cat: ITemplateFieldGroup, field: ITemplateField) {
  const categoryId = cat && cat.id != '' ? cat.id : null;
  return categoryId ? `${categoryId}.${field.id}` : field.id;
}
