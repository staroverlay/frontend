import ITemplateField from "@/lib/interfaces/template-field";
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
  }
}
