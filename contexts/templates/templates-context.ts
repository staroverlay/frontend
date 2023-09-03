import React from 'react';
import { TemplatesHook } from './templates-hook';

export const TemplatesContext = React.createContext<TemplatesHook>({
  sharedTemplates: [],
  userTemplates: [],
  addTemplate: (template) => {},
  updateTemplate: (template) => {},
  removeTemplate: (template) => {},
});
