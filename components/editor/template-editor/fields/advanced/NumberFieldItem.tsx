import { FieldNumberSettings } from "@/lib/interfaces/template-field";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface NumberFieldItemProps {
  settings?: FieldNumberSettings;
  onUpdate: (data: FieldNumberSettings) => unknown;
}

export default function NumberFieldItem({
  settings,
  onUpdate,
}: NumberFieldItemProps) {
  const [settingsState, setSettingsState] = useState<
    FieldNumberSettings | undefined
  >(settings);

  useEffect(() => {
    if (settingsState) {
      onUpdate(settingsState);
    }
  }, [onUpdate, settingsState]);

  return (
    <>
      <SimpleGrid minChildWidth="120px" spacing="10px" width={"100%"}>
        <FormControl>
          <FormLabel>Min value</FormLabel>
          <Input
            placeholder={"0"}
            value={settingsState?.min}
            type={"number"}
            onChange={(e) =>
              setSettingsState({
                ...settingsState,
                min: parseInt(e.target.value),
              })
            }
            size={"sm"}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Max value</FormLabel>
          <Input
            placeholder={"9999"}
            value={settingsState?.max}
            type={"number"}
            onChange={(e) =>
              setSettingsState({
                ...settingsState,
                max: parseInt(e.target.value),
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
                display: e.target.value as "input" | "range",
              })
            }
            size={"sm"}
          >
            <option value={"input"}>Input</option>
            <option value={"range"}>Range</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Type</FormLabel>
          <Select
            value={settings?.type}
            onChange={(e) =>
              setSettingsState({
                ...settingsState,
                type: e.target.value as "float" | "integer",
              })
            }
            size={"sm"}
          >
            <option value={"float"}>Float</option>
            <option value={"integer"}>Integer</option>
          </Select>
        </FormControl>
      </SimpleGrid>
      <SimpleGrid minChildWidth="120px" spacing="10px" width={"100%"}>
        <FormControl>
          <FormLabel>Range steps</FormLabel>
          <Input
            placeholder={"0"}
            value={settingsState?.rangeSteps || 1}
            onChange={(e) =>
              setSettingsState({
                ...settingsState,
                rangeSteps: parseInt(e.target.value),
              })
            }
            size={"sm"}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Default value</FormLabel>
          <Input
            placeholder={"12345"}
            value={settingsState?.default}
            type={"number"}
            onChange={(e) =>
              setSettingsState({
                ...settingsState,
                default: parseInt(e.target.value),
              })
            }
            size={"sm"}
          />
        </FormControl>
      </SimpleGrid>
    </>
  );
}
