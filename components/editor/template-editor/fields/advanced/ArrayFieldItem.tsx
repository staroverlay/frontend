import {
  FieldArraySettings,
  FieldStringSettings,
  TemplateFieldType,
  TemplateFieldTypes,
} from "@/lib/interfaces/template-field";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface ArrayFieldItemProps {
  settings: FieldArraySettings;
  onUpdate: (data: FieldArraySettings) => unknown;
}

export default function ArrayFieldItem({
  settings,
  onUpdate,
}: ArrayFieldItemProps) {
  const [settingsState, setSettingsState] =
    useState<FieldArraySettings>(settings);

  useEffect(() => {
    if (settingsState) {
      onUpdate(settingsState);
    }
  }, [onUpdate, settingsState]);

  return (
    <SimpleGrid minChildWidth="120px" spacing="10px" width={"100%"}>
      <FormControl>
        <FormLabel>Min Items</FormLabel>
        <Input
          placeholder={"0"}
          value={settingsState?.minItems}
          type={"number"}
          onChange={(e) =>
            setSettingsState({
              ...settingsState,
              minItems: parseInt(e.target.value),
            })
          }
          size={"sm"}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Max Items</FormLabel>
        <Input
          placeholder={"9999"}
          value={settingsState?.maxItems}
          type={"number"}
          onChange={(e) =>
            setSettingsState({
              ...settingsState,
              maxItems: parseInt(e.target.value),
            })
          }
          size={"sm"}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Display</FormLabel>
        <Select
          value={settings?.display}
          onChange={(e) =>
            setSettingsState({
              ...settingsState,
              display: e.target.value as "list" | "table",
            })
          }
          size={"sm"}
        >
          <option value={"list"}>List</option>
          <option value={"table"}>Table</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Type</FormLabel>
        <Select
          value={settings?.type}
          onChange={(e) =>
            setSettingsState({
              ...settingsState,
              type: e.target.value as TemplateFieldType,
            })
          }
          size={"sm"}
        >
          {TemplateFieldTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </Select>
      </FormControl>
    </SimpleGrid>
  );
}
