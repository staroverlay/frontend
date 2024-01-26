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

import ITemplateField from '@/lib/interfaces/templates/template-field';

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

  return (
    <FormControl>
      <FormLabel>{field.label}</FormLabel>

      {opts?.display == 'range' && (
        <NumberSlider field={field} setValue={setValue} value={value} />
      )}

      {opts?.display && opts?.display == 'input' && (
        <Input
          type="number"
          min={opts?.max}
          max={opts?.max}
          value={value || opts?.default || 0}
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
