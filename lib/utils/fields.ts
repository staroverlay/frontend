import ITemplateField from '@/services/template-versions/template-field';
import ITemplateFieldGroup from '@/services/template-versions/template-field-group';

export function getFieldPath(cat: ITemplateFieldGroup, field: ITemplateField) {
  const categoryId = cat && cat.id != '' ? cat.id : null;
  return categoryId ? `${categoryId}.${field.id}` : field.id;
}
