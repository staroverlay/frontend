import client from "../graphql/client";
import CreateTemplateMutation from "../graphql/mutations/createTemplateMutation";
import UpdateTemplateMutation from "../graphql/mutations/updateTemplateMutation";
import GetMyTemplatesQuery from "../graphql/queries/getMyTemplatesQuery";
import GetTemplatesByAuthorQuery from "../graphql/queries/getTemplatesByAuthorQuery";
import ITemplate, { ITemplateRaw } from "../interfaces/template";
import { cleanEquals } from "../utils/object";
import TemplateUpdate from "./dtos/template-update";

function fixTemplate(raw: ITemplateRaw) {
  const template: ITemplate = {
    ...raw,
    fields: raw.fields ? JSON.parse(raw.fields) : null,
  };
  return template;
}

function fixTemplates(raws: ITemplateRaw[]) {
  const templates: ITemplate[] = raws.map((raw) => fixTemplate(raw));
  return templates;
}

export async function getMyTemplates(): Promise<ITemplate[]> {
  const raws = await client.fetch(GetMyTemplatesQuery);
  return fixTemplates(raws as ITemplateRaw[]);
}

export async function getTemplatesByAuthor(
  authorId: string
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

export async function createTemplate(name: string) {
  const payload = { name, visibility: "private" };
  const raw = await client.fetch(CreateTemplateMutation, { payload });
  return fixTemplate(raw as ITemplateRaw);
}

export async function updateTemplate(
  template: ITemplate,
  update: TemplateUpdate
) {
  const payload = cleanEquals(template, update);
  const raw = await client.fetch(UpdateTemplateMutation, {
    id: template._id,
    payload,
  });
  return fixTemplate(raw as ITemplateRaw);
}
