import client from "../graphql/client";
import CreateTemplateMutation from "../graphql/mutations/createTemplateMutation";
import DeleteTemplateMutation from "../graphql/mutations/deleteTemplateMutation";
import UpdateTemplateMutation from "../graphql/mutations/updateTemplateMutation";
import GetMyTemplatesQuery from "../graphql/queries/getMyTemplatesQuery";
import GetTemplateByIDQuery from "../graphql/queries/getTemplateByIdQuery";
import GetTemplatesByAuthorQuery from "../graphql/queries/getTemplatesByAuthorQuery";
import ITemplate, { ITemplateRaw } from "../interfaces/template";
import ITemplateField from "../interfaces/template-field";
import { cleanEquals } from "../utils/object";
import { randomString } from "../utils/random";
import TemplateUpdate from "./dtos/template-update";

// Aux functions.
function fixTemplate(raw: ITemplateRaw) {
  const fields: ITemplateField[] = raw.fields ? JSON.parse(raw.fields) : [];
  fields.map((f) => (f._internalId = randomString(6)));

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
  const payload = { name, visibility: "private" };
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
  return fixTemplate(template as ITemplateRaw);
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

export async function updateTemplate(
  template: ITemplate,
  update: TemplateUpdate
) {
  const payload = cleanEquals(template, update);
  const fields: ITemplateField[] = payload.fields || [];

  fields.map((field: Partial<ITemplateField>) => {
    delete field._internalId;
  });

  const raw = await client.fetch(UpdateTemplateMutation, {
    id: template._id,
    payload,
  });
  return fixTemplate(raw as ITemplateRaw);
}
