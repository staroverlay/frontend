import {
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react';

import ITemplateField from '@/services/template-versions/template-field';

export interface FieldRendererNumberProps {
  field: ITemplateField;
  value: number;
  setValue: (value: number) => void;
}

function NumberSlider({ field, value, setValue }: FieldRendererNumberProps) {
  const opts = field.number;

  return (
    <Flex gap={'10px'}>
      <Slider
        value={value}
        onChange={setValue}
        step={opts?.rangeSteps}
        min={opts?.min}
        max={opts?.max}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>

        <SliderThumb />
      </Slider>

      <Text>{value || 0}</Text>
    </Flex>
  );
}

export default function FieldRendererNumber({
  field,
  value,
  setValue,
}: FieldRendererNumberProps) {
  const opts = field.number;
  const display = opts?.display || 'number';
  const defaultValue =
    opts?.default === undefined || opts?.default === null ? 0 : opts?.default;
  const inputValue =
    value === undefined || value === null ? defaultValue || 0 : value;

  return (
    <FormControl>
      <FormLabel>{field.label}</FormLabel>

      {display == 'range' && (
        <NumberSlider field={field} setValue={setValue} value={inputValue} />
      )}

      {display == 'input' && (
        <Input
          type="number"
          min={opts?.max}
          max={opts?.max}
          value={inputValue}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            if (!isNaN(newValue)) {
              setValue(newValue);
            }
          }}
        />
      )}

      <FormHelperText>{field.description}</FormHelperText>
    </FormControl>
  );
}
