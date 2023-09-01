import ITemplateField from "@/lib/interfaces/template-field";
import FieldRendererBoolean from "./FieldRendererBoolean";
import FieldRendererNumber from "./FieldRendererNumber";
import FieldRendererString from "./FieldRendererString";

export interface FieldRendererProps {
  field: ITemplateField;
  value: unknown;
  setValue: (value: unknown) => void;
}

export default function FieldRenderer({
  field,
  value,
  setValue,
}: FieldRendererProps) {
  if (field.type == "string") {
    return (
      <FieldRendererString
        field={field}
        value={value as string}
        setValue={setValue}
      />
    );
  } else if (field.type == "number") {
    return (
      <FieldRendererNumber
        field={field}
        value={value as number}
        setValue={setValue}
      />
    );
  } else if (field.type == "boolean") {
    return (
      <FieldRendererBoolean
        field={field}
        value={value as boolean}
        setValue={setValue}
      />
    );
  }

  return <></>;
}
