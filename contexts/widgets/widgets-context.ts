import React from 'react';

import { WidgetHook } from './widgets-hook';

export const WidgetsContext = React.createContext<WidgetHook>({
  addWidget: () => {},
  removeWidget: () => {},
  updateWidget: () => {},
  widgets: [],
});
