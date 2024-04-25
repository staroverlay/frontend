import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

import IDictionary from '@/lib/IDictionary';

import ITemplateField from '@/lib/interfaces/templates/template-field';
import FieldRenderer from './FieldRenderer';

export interface FieldRendererMapProps {
  field: ITemplateField;
  value: { [key: string]: any };
  setValue: (value: unknown) => void;
}

export default function FieldRendererMap({
  field,
  value,
  setValue,
}: FieldRendererMapProps) {
  const opts = field.map;

  const [items, setItems] = useState<{ key: any; value: any }[]>([]);

  const isAnyFieldNull = () => {
    return items.find((item) => !item.key || !item.value) != null;
  };

  const update = () => {
    if (!isAnyFieldNull()) {
      const map: IDictionary = {};
      for (const item of items) {
        map[item.key] = item.value;
      }
      setValue(map);
    }
  };

  const updateKey = (index: number, key: any) => {
    items[index].key = key;
    setItems([...items]);
    update();
  };

  const updateValue = (index: number, value: any) => {
    items[index].value = value;
    setItems([...items]);
    update();
  };

  const add = () => {
    items.push({
      key: null,
      value: null,
    });
    setItems([...items]);
  };

  const remove = (index: number) => {
    items.splice(index, 1);
    setItems([...items]);
  };

  useEffect(() => {
    setItems(
      Object.keys(value || {}).map((key) => ({
        key,
        value: value[key],
      })),
    );
  }, [value]);

  return (
    <FormControl>
      <FormLabel>{field.label}</FormLabel>

      <Flex
        border={'1px solid'}
        borderColor={'chakra-border-color'}
        borderRadius={'7px'}
        padding={'14px 20px'}
        direction={'column'}
      >
        {items.map((item, index) => (
          <Flex key={index} gap={'10px'} alignItems={'center'}>
            <FieldRenderer
              value={item.key}
              setValue={(newKey) => updateKey(index, newKey)}
              field={{
                id: 'dummy',
                _internalId: 'dummy',
                type: opts?.key || 'string',
              }}
            />

            <FieldRenderer
              value={item.value}
              setValue={(newValue) => updateValue(index, newValue)}
              field={{
                id: 'dummy',
                _internalId: 'dummy',
                type: opts?.value || 'string',
              }}
            />

            <IconButton
              icon={<FaTrash />}
              aria-label={'dasdad'}
              variant={'solid'}
              colorScheme={'red'}
              zIndex={'1'}
              size={'xs'}
              onClick={() => remove(index)}
            />
          </Flex>
        ))}

        <Button
          onClick={add}
          size={'xs'}
          disabled={
            isAnyFieldNull() ||
            (opts?.maxItems != undefined && items.length >= opts?.maxItems)
          }
        >
          Add
        </Button>
      </Flex>

      <FormHelperText>{field.description}</FormHelperText>
    </FormControl>
  );
}
