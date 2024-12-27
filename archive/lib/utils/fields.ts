import { TemplateField, TemplateFieldGroup } from '@staroverlay/sdk';

export function getFieldPath(cat: TemplateFieldGroup, field: TemplateField) {
  const categoryId = cat && cat.id != '' ? cat.id : null;
  return categoryId ? `${categoryId}.${field.id}` : field.id;
}
