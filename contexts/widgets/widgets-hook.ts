import IWidget from "@/lib/interfaces/widget";

export interface WidgetHook {
  widgets: IWidget[];
  addWidget: (widget: IWidget) => void;
  removeWidget: (widget: IWidget) => void;
  updateWidget: (widget: IWidget) => void;
}
