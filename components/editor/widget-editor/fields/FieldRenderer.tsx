import ITemplateField, {
  TemplateFieldType,
} from "@/lib/interfaces/template-field";
import { ValueOf } from "next/dist/shared/lib/constants";
import FieldRendererArray from "./FieldRendererArray";

import FieldRendererBoolean from "./FieldRendererBoolean";
import FieldRendererNumber from "./FieldRendererNumber";
import FieldRendererString from "./FieldRendererString";

export interface FieldRendererProps {
  field: ITemplateField;
  value: any;
  setValue: (value: any) => void;
}

export const RENDER_MAP: {
  [k in TemplateFieldType]: (props: FieldRendererProps) => JSX.Element;
} = {
  string: FieldRendererString,
  number: FieldRendererNumber,
  boolean: FieldRendererBoolean,
  array: FieldRendererArray,
};

export default function FieldRenderer({
  field,
  value,
  setValue,
}: FieldRendererProps) {
  const Renderer = RENDER_MAP[field.type];
  if (Renderer != null) {
    return <Renderer field={field} value={value} setValue={setValue} />;
  }

  return <></>;
}
