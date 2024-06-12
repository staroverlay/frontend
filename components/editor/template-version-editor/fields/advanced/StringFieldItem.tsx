import { FormControl, FormLabel, Input, SimpleGrid } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { FieldStringSettings } from '@/services/template-versions/template-field';

interface StringFieldItemProps {
  settings?: FieldStringSettings;
  onUpdate: (data: FieldStringSettings) => unknown;
}

export default function StringFieldItem({
  settings,
  onUpdate,
}: StringFieldItemProps) {
  const [settingsState, setSettingsState] = useState<
    FieldStringSettings | undefined
  >(settings);

  useEffect(() => {
    if (settingsState) {
      onUpdate(settingsState);
    }
  }, [onUpdate, settingsState]);

  return (
    <SimpleGrid minChildWidth="120px" spacing="10px" width={'100%'}>
      <FormControl>
        <FormLabel>Min Length</FormLabel>
        <Input
          placeholder={'0'}
          value={settingsState?.minLength || ''}
          type={'number'}
          onChange={(e) =>
            setSettingsState({
              ...settingsState,
              minLength: parseInt(e.target.value),
            })
          }
          size={'sm'}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Max Length</FormLabel>
        <Input
          placeholder={'9999'}
          value={settingsState?.maxLength || ''}
          type={'number'}
          onChange={(e) =>
            setSettingsState({
              ...settingsState,
              maxLength: parseInt(e.target.value),
            })
          }
          size={'sm'}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Default value</FormLabel>
        <Input
          placeholder={'0'}
          value={settingsState?.default || ''}
          onChange={(e) =>
            setSettingsState({
              ...settingsState,
              default: e.target.value,
            })
          }
          size={'sm'}
        />
      </FormControl>
    </SimpleGrid>
  );
}
