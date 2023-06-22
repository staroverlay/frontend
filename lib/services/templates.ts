import client from "../graphql/client";
import GetMyTemplatesQuery from "../graphql/queries/getMyTemplatesQuery";
import ITemplate, { ITemplateRaw } from "../interfaces/template";

export async function getMyTemplates(): Promise<ITemplate[]> {
  const raws = (await client.fetch(GetMyTemplatesQuery)) as ITemplateRaw[];
  const templates: ITemplate[] = raws.map((template: ITemplateRaw) => ({
    ...template,
    fields: template.fields ? JSON.parse(template.fields) : null,
  }));
  return templates;
}
