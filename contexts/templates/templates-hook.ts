import ITemplate from '../../lib/interfaces/template';

export interface TemplatesHook {
  sharedTemplates: ITemplate[];
  userTemplates: ITemplate[];

  addTemplate: (template: ITemplate) => void;
  updateTemplate: (template: ITemplate) => void;
  removeTemplate: (template: ITemplate | string) => void;
}
