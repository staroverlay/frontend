import ITemplateField from '../interfaces/templates/template-field';
import ITemplateFieldGroup from '../interfaces/templates/template-field-group';

export function getFieldPath(cat: ITemplateFieldGroup, field: ITemplateField) {
  const categoryId = cat && cat.id != '' ? cat.id : null;
  return categoryId ? `${categoryId}.${field.id}` : field.id;
}
