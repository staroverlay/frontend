import { FormControl, FormHelperText, FormLabel } from '@chakra-ui/react';

import MediaInput from '@/components/input/MediaInput';
import { FileType } from '@/services/medias/media';
import ITemplateField from '@/services/templates/template-field';

export interface FieldRendererMediaProps {
  field: ITemplateField;
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
