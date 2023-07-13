import {
  FieldBooleanSettings,
  FieldStringSettings,
} from "@/lib/interfaces/template-field";
import {
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface BooleanFieldItemProps {
  settings?: FieldBooleanSettings;
  onUpdate: (data: FieldBooleanSettings) => unknown;
}

export default function BooleanFieldItem({
  settings,
  onUpdate,
}: BooleanFieldItemProps) {
  const [settingsState, setSettingsState] = useState<
    FieldBooleanSettings | undefined
  >(settings);

  useEffect(() => {
    if (settingsState) {
      onUpdate(settingsState);
    }
  }, [onUpdate, settingsState]);

  return (
    <SimpleGrid minChildWidth="120px" spacing="10px" width={"100%"}>
      <FormControl>
        <FormLabel>Display</FormLabel>
        <Select
          value={settings?.display}
          onChange={(e) =>
            setSettingsState({
              ...settingsState,
              display: e.target.value as "checkbox" | "slider",
            })
          }
          size={"sm"}
        >
          <option value={"checkbox"}>Checkbox</option>
          <option value={"slider"}>Slider</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Default value</FormLabel>
        <Checkbox
          checked={settingsState?.default}
          onChange={(e) =>
            setSettingsState({
              ...settingsState,
              default: e.target.checked,
            })
          }
          size={"lg"}
        />
      </FormControl>
    </SimpleGrid>
  );
}
