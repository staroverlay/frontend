import {
  FormControl,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from '@chakra-ui/react';

import ITemplateField from '@/services/template-versions/template-field';

export interface FieldRendererEnumProps {
  field: ITemplateField;
  value: string;
  setValue: (value: string) => void;
}

const FieldRendererEnumRadio = ({
  field,
  value,
  setValue,
}: FieldRendererEnumProps) => {
  const opts = field.enum;

  return (
    <RadioGroup onChange={setValue} value={value}>
      <Stack direction="column">
        {opts?.options.map((option, index) => (
          <Radio key={index} value={option.value}>
            {option.label || option.value}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  );
};

const FieldRendererEnumSelect = ({
  field,
  value,
  setValue,
}: FieldRendererEnumProps) => {
  const opts = field.enum;

  return (
    <Select
      defaultValue={opts?.default}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    >
      {opts?.options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </Select>
  );
};

export default function FieldRendererEnum(props: FieldRendererEnumProps) {
  const field = props.field;
  const opts = field.enum;

  return (
    <FormControl>
      <FormLabel>{field.label}</FormLabel>

      {opts?.display == 'radio' ? (
        <FieldRendererEnumRadio {...props} />
      ) : (
        <FieldRendererEnumSelect {...props} />
      )}

      <FormHelperText>{field.description}</FormHelperText>
    </FormControl>
  );
}
