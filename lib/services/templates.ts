import client from "../graphql/client";
import GetMyTemplatesQuery from "../graphql/queries/getMyTemplatesQuery";
import GetTemplatesByAuthorQuery from "../graphql/queries/getTemplatesByAuthorQuery";
import ITemplate, { ITemplateRaw } from "../interfaces/template";

function fixTemplates(raws: ITemplateRaw[]) {
  const templates: ITemplate[] = raws.map((template: ITemplateRaw) => ({
    ...template,
    fields: template.fields ? JSON.parse(template.fields) : null,
  }));
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
