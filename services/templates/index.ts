import client from '@/lib/clients/graphql';
import { cleanEquals } from '@/lib/utils/object';
import ITemplateField from '@/services/templates/template-field';

import TemplateUpdateDTO from './dto/template-update.dto';
import CreateTemplateMutation from './graphql/createTemplateMutation';
import DeleteTemplateMutation from './graphql/deleteTemplateMutation';
import GetMyTemplatesQuery from './graphql/getMyTemplatesQuery';
import GetTemplateByIDQuery from './graphql/getTemplateByIdQuery';
import GetTemplatesByCreatorQuery from './graphql/getTemplatesByCreatorQuery';
import UpdateTemplateMutation from './graphql/updateTemplateMutation';
import ITemplate from './template';
import ITemplateFieldGroup from './template-field-group';

export async function createTemplate(name: string) {
  const payload = { name };
  const template = await client.fetch(CreateTemplateMutation, { payload });
  return template as ITemplate;
}

export async function deleteTemplate(template: ITemplate): Promise<boolean> {
  return (await client.fetch(DeleteTemplateMutation, {
    id: template._id,
  })) as unknown as boolean;
}

export async function getTemplateByID(id: string): Promise<ITemplate | null> {
  const template = await client.fetch(GetTemplateByIDQuery, { id });
  return template as ITemplate | null;
}

export async function getMyTemplates(): Promise<ITemplate[]> {
  const templates = await client.fetch(GetMyTemplatesQuery);
  return templates as ITemplate[];
}

export async function getTemplatesByCreator(
  creatorId: string,
): Promise<ITemplate[]> {
  const templates = await client.fetch(GetTemplatesByCreatorQuery, {
    creatorId,
  });
  return templates as ITemplate[];
}

export async function getSharedTemplates() {
  const publicId = process.env.NEXT_PUBLIC_MAIN_USER_ID;
  if (publicId) {
    return await getTemplatesByCreator(publicId);
  } else {
    return [];
  }
}

export async function updateTemplate(
  template: ITemplate,
  update: TemplateUpdateDTO,
) {
  const refPayload = cleanEquals(template, update);
  const payload = structuredClone(refPayload);
  const fields: ITemplateFieldGroup[] = payload.fields || [];

  fields.forEach((field: ITemplateFieldGroup) => {
    field.children?.forEach((child: Partial<ITemplateField>) => {
      delete child._internalId;
    });
  });

  const newTemplate = await client.fetch(UpdateTemplateMutation, {
    id: template._id,
    payload,
  });

  return newTemplate as ITemplate;
}
