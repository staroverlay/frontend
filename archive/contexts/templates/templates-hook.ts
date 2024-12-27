import { Template } from '@staroverlay/sdk';

export interface TemplatesHook {
  sharedTemplates: Template[];
  userTemplates: Template[];

  addTemplate: (template: Template) => void;
  updateTemplate: (template: Template) => void;
  removeTemplate: (template: Template | string) => void;
}
