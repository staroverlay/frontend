import client from '@/lib/clients/graphql';
import { randomString } from '@/lib/utils/random';

import ITemplate from '../templates/template';
import PostTemplateVersionDTO from './dto/post-template-version.dto';
import GetLastTemplateVersionQuery from './graphql/getLastTemplateVersionQuery';
import GetTemplateVersionQuery from './graphql/getTemplateVersionQuery';
import PostTemplateVersionMutation from './graphql/postTemplateVersionMutation';
import ITemplateField from './template-field';
import ITemplateFieldGroup from './template-field-group';
import TemplateVersion from './template-version';

export async function getTemplateVersion(
  template: ITemplate,
  versionId: string,
): Promise<TemplateVersion | null> {
  const templateId = template._id;
  const version = await client.fetch(GetTemplateVersionQuery, {
    templateId,
    versionId,
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
