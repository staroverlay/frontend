import client from '@/lib/clients/graphql';
import { randomString } from '@/lib/utils/random';
import {
  Template,
  TemplateField,
  TemplateFieldGroup,
  TemplateVersion,
} from '@staroverlay/sdk';

import PostTemplateVersionDTO from './dto/post-template-version.dto';
import GetLastTemplateVersionQuery from './graphql/getLastTemplateVersionQuery';
import GetTemplateVersionQuery from './graphql/getTemplateVersionQuery';
import PostTemplateVersionMutation from './graphql/postTemplateVersionMutation';

export async function getTemplateVersion(
  template: Template,
  versionId: string,
): Promise<TemplateVersion | null> {
  const templateId = template._id;
  const version = await client.fetch(GetTemplateVersionQuery, {
    templateId,
    versionId,
  });
  return version as TemplateVersion | null;
}

export async function getLastTemplateVersion(template: Template) {
  const id = template._id;
  const version = (await client.fetch(GetLastTemplateVersionQuery, {
    id,
  })) as TemplateVersion;

  if (!version) {
    return null;
  }

  version.fields.forEach((field: TemplateFieldGroup) => {
    field.children?.forEach((child: Partial<TemplateField>) => {
      child._internalId = randomString(6);
    });
  });

  return version;
}

export async function postTemplateUpdate(
  template: Template,
  update: PostTemplateVersionDTO,
) {
  const id = template._id;
  const payload = structuredClone(update);
  const fields: TemplateFieldGroup[] = payload.fields || [];

  fields.forEach((field: TemplateFieldGroup) => {
    field.children?.forEach((child: Partial<TemplateField>) => {
      child._internalId = undefined;
      delete child._internalId;
    });
  });

  const newTemplate = await client.fetch(PostTemplateVersionMutation, {
    id,
    payload,
  });

  newTemplate.fields.forEach((field: TemplateFieldGroup) => {
    field.children?.forEach((child: Partial<TemplateField>) => {
      child._internalId = randomString(6);
    });
  });

  return newTemplate as TemplateVersion;
}
