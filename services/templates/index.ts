import client from '@/lib/clients/graphql';
import { cleanEquals } from '@/lib/utils/object';
import { randomString } from '@/lib/utils/random';

import CreateTemplateDTO from './dto/create-template.dto';
import PostTemplateVersionDTO from './dto/post-template-version.dto';
import UpdateTemplateDTO from './dto/update-template.dto';
import CreateTemplateMutation from './graphql/createTemplateMutation';
import DeleteTemplateMutation from './graphql/deleteTemplateMutation';
import GetLastTemplateVersionQuery from './graphql/getLastTemplateVersionQuery';
import GetMyTemplatesQuery from './graphql/getMyTemplatesQuery';
import GetTemplateByIDQuery from './graphql/getTemplateByIdQuery';
import GetTemplatesByCreatorQuery from './graphql/getTemplatesByCreatorQuery';
import GetTemplateVersionQuery from './graphql/getTemplateVersionQuery';
import PostTemplateVersionMutation from './graphql/postTemplateVersionMutation';
import UpdateTemplateMutation from './graphql/updateTemplateMutation';
import ITemplate from './template';
import ITemplateField from './template-field';
import ITemplateFieldGroup from './template-field-group';
import TemplateVersion from './template-version';

// Template.
export async function createTemplate(
  payload: CreateTemplateDTO,
): Promise<ITemplate> {
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
  update: UpdateTemplateDTO,
) {
  const refPayload = cleanEquals(template, update);
  const payload = structuredClone(refPayload);

  const newTemplate = await client.fetch(UpdateTemplateMutation, {
    id: template._id,
    payload,
  });

  return newTemplate as ITemplate;
}

// Versions.
export async function getTemplateVersion(
  versionId: string,
): Promise<TemplateVersion | null> {
  const version = await client.fetch(GetTemplateVersionQuery, {
    id: versionId,
  });
  return version as TemplateVersion | null;
}

export async function getLastTemplateVersion(template: ITemplate) {
  const id = template._id;
  const version = (await client.fetch(GetLastTemplateVersionQuery, {
    id,
  })) as TemplateVersion;

  if (!version) {
    return null;
  }

  version.fields.forEach((field: ITemplateFieldGroup) => {
    field.children?.forEach((child: Partial<ITemplateField>) => {
      child._internalId = randomString(6);
    });
  });

  return version;
}

export async function postTemplateUpdate(
  template: ITemplate,
  update: PostTemplateVersionDTO,
) {
  const id = template._id;
  const payload = structuredClone(update);
  const fields: ITemplateFieldGroup[] = payload.fields || [];

  fields.forEach((field: ITemplateFieldGroup) => {
    field.children?.forEach((child: Partial<ITemplateField>) => {
      child._internalId = undefined;
      delete child._internalId;
    });
  });

  const newTemplate = await client.fetch(PostTemplateVersionMutation, {
    id,
    payload,
  });

  newTemplate.fields.forEach((field: ITemplateFieldGroup) => {
    field.children?.forEach((child: Partial<ITemplateField>) => {
      child._internalId = randomString(6);
    });
  });

  return newTemplate as TemplateVersion;
}
