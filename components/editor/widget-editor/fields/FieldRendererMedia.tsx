import { FormControl, FormHelperText, FormLabel } from '@chakra-ui/react';
import { FileType, TemplateField } from '@staroverlay/sdk';

import MediaInput from '@/components/input/MediaInput';

export interface FieldRendererMediaProps {
  field: TemplateField;
  value: unknown;
  setValue: (value: unknown) => void;
  filter?: FileType | FileType[];
}

export default function FieldRendererMedia({
  field,
  value,
  setValue,
  filter,
}: FieldRendererMediaProps) {
  return (
    <FormControl>
      <FormLabel>{field.label}</FormLabel>
      <MediaInput value={value as string} setValue={setValue} filter={filter} />
      <FormHelperText>{field.description}</FormHelperText>
    </FormControl>
  );
}
