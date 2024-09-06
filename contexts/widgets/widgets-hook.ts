import { Widget } from '@staroverlay/sdk';

export interface WidgetHook {
  widgets: Widget[];
  addWidget: (widget: Widget) => void;
  removeWidget: (widget: Widget) => void;
  updateWidget: (widget: Widget) => void;
}
