import client from '../graphql/client';
import CreateTemplateMutation from '../graphql/mutations/createTemplateMutation';
import DeleteTemplateMutation from '../graphql/mutations/deleteTemplateMutation';
import UpdateTemplateMutation from '../graphql/mutations/updateTemplateMutation';
import GetMyTemplatesQuery from '../graphql/queries/getMyTemplatesQuery';
import GetTemplateByIDQuery from '../graphql/queries/getTemplateByIdQuery';
import GetTemplatesByAuthorQuery from '../graphql/queries/getTemplatesByAuthorQuery';
import ITemplate, { ITemplateRaw } from '../interfaces/templates/template';
import ITemplateField from '../interfaces/templates/template-field';
import ITemplateFieldGroup from '../interfaces/templates/template-field-group';
import { cleanEquals } from '../utils/object';
import { randomString } from '../utils/random';
import TemplateUpdate from './dtos/template-update';

// Aux functions.
function fixTemplate(raw: ITemplateRaw) {
  const fields: ITemplateFieldGroup[] = raw.fields
    ? JSON.parse(raw.fields)
    : [];

  fields.forEach((c) => {
    c.children.map((f) => (f._internalId = randomString(6)));
  });

  const template: ITemplate = {
    ...raw,
    fields,
  };

  return template;
}

function fixTemplates(raws: ITemplateRaw[]) {
  const templates: ITemplate[] = raws.map((raw) => fixTemplate(raw));
  return templates;
}

// Service.
export async function createTemplate(name: string) {
  const payload = { name, visibility: 'private' };
  const raw = await client.fetch(CreateTemplateMutation, { payload });
  return fixTemplate(raw as ITemplateRaw);
}

export async function deleteTemplate(template: ITemplate): Promise<boolean> {
  return (await client.fetch(DeleteTemplateMutation, {
    id: template._id,
  })) as unknown as boolean;
}

export async function getTemplateByID(id: string): Promise<ITemplate | null> {
  const template = await client.fetch(GetTemplateByIDQuery, { id });
  if (!template) {
    return null;
  }
  return fixTemplate(template as ITemplateRaw);
}

export async function getMyTemplates(): Promise<ITemplate[]> {
  const raws = await client.fetch(GetMyTemplatesQuery);
  return fixTemplates(raws as ITemplateRaw[]);
}

export async function getTemplatesByAuthor(
  authorId: string,
): Promise<ITemplate[]> {
  const raws = await client.fetch(GetTemplatesByAuthorQuery, { authorId });
  return fixTemplates(raws as ITemplateRaw[]);
}

export async function getSharedTemplates() {
  const publicId = process.env.NEXT_PUBLIC_MAIN_USER_ID;
  if (publicId) {
    return await getTemplatesByAuthor(publicId);
  } else {
    return [];
  }
}

export async function updateTemplate(
  template: ITemplate,
  update: TemplateUpdate,
) {
  const refPayload = cleanEquals(template, update);
  const payload = structuredClone(refPayload);

  const fields: ITemplateFieldGroup[] = payload.fields || [];

  fields.forEach((field: ITemplateFieldGroup) => {
    field.children?.forEach((child: Partial<ITemplateField>) => {
      delete child._internalId;
    });
  });

  const raw = await client.fetch(UpdateTemplateMutation, {
    id: template._id,
    payload,
  });
  return fixTemplate(raw as ITemplateRaw);
}
