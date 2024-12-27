import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { TemplateField } from '@staroverlay/sdk';

export interface FieldRendererStringProps {
  field: TemplateField;
  value: string;
  setValue: (value: string) => void;
}

export default function FieldRendererString({
  field,
  value,
  setValue,
}: FieldRendererStringProps) {
  return (
    <FormControl>
      <FormLabel>{field.label}</FormLabel>
      <Input
        value={value || ''}
        minLength={field.string?.minLength}
        maxLength={field.string?.maxLength}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <FormHelperText>{field.description}</FormHelperText>
    </FormControl>
  );
}
