import IDictionary from "@/lib/interfaces/shared/IDictionary";

type WidgetUpdatePayload = {
  displayName?: string;
  settings?: IDictionary;
  enabled?: boolean;
};

export default WidgetUpdatePayload;
