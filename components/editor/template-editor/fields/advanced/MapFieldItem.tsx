import {
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import {
  FieldMapSettings,
  TemplateFieldType,
  TemplateFieldTypes,
} from '@/lib/interfaces/templates/template-field';

interface MapFieldItemProps {
  settings: FieldMapSettings;
  onUpdate: (data: FieldMapSettings) => unknown;
}

export default function MapFieldItem({
  settings,
  onUpdate,
}: MapFieldItemProps) {
  const [settingsState, setSettingsState] =
    useState<FieldMapSettings>(settings);

  useEffect(() => {
    if (settingsState) {
      onUpdate(settingsState);
    }
  }, [onUpdate, settingsState]);

  return (
    <>
      <SimpleGrid minChildWidth="120px" spacing="10px" width={'100%'}>
        <FormControl>
          <FormLabel>Min Items</FormLabel>
          <Input
            placeholder={'0'}
            value={settingsState?.minItems}
            type={'number'}
            onChange={(e) =>
              setSettingsState({
                ...settingsState,
                minItems: parseInt(e.target.value),
              })
            }
            size={'sm'}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Max Items</FormLabel>
          <Input
            placeholder={'9999'}
            value={settingsState?.maxItems}
            type={'number'}
            onChange={(e) =>
              setSettingsState({
                ...settingsState,
                maxItems: parseInt(e.target.value),
              })
            }
            size={'sm'}
          />
        </FormControl>
      </SimpleGrid>

      <SimpleGrid minChildWidth="120px" spacing="10px" width={'100%'}>
        <FormControl>
          <FormLabel>Key type</FormLabel>
          <Select
            value={settings?.key}
            onChange={(e) =>
              setSettingsState({
                ...settingsState,
                key: e.target.value as TemplateFieldType,
              })
            }
            size={'sm'}
          >
            {TemplateFieldTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Value type</FormLabel>
          <Select
            value={settings?.value}
            onChange={(e) =>
              setSettingsState({
                ...settingsState,
                value: e.target.value as TemplateFieldType,
              })
            }
            size={'sm'}
          >
            {TemplateFieldTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </Select>
        </FormControl>
      </SimpleGrid>
    </>
  );
}
