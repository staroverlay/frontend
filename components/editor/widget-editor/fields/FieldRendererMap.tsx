import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Switch,
  Text,
} from "@chakra-ui/react";

import ITemplateField from "@/lib/interfaces/template-field";
import FieldRenderer from "./FieldRenderer";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";

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
  const [items, setItems] = useState<{ key: any; value: any }[]>(
    Object.keys(value || {}).map((key) => ({
      key,
      value: null,
    }))
  );

  const isAnyFieldNull = () => {
    return items.find((item) => !item.key || !item.value) != null;
  };

  const updateKey = (index: number, key: any) => {
    items[index].key = key;
    setItems([...items]);
  };

  const updateValue = (index: number, value: any) => {
    items[index].value = value;
    setItems([...items]);
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

  return (
    <FormControl>
      <FormLabel>{field.label}</FormLabel>

      <Flex
        border={"1px solid"}
        borderColor={"chakra-border-color"}
        borderRadius={"7px"}
        padding={"14px 20px"}
        direction={"column"}
      >
        {items.map((item, index) => (
          <Flex key={index} gap={"5px"} alignItems={"center"}>
            <FieldRenderer
              value={item.key}
              setValue={(newKey) => updateKey(index, newKey)}
              field={{
                id: "dummy",
                _internalId: "dummy",
                type: opts?.key || "string",
              }}
            />

            <FieldRenderer
              value={item.value}
              setValue={(newValue) => updateValue(index, newValue)}
              field={{
                id: "dummy",
                _internalId: "dummy",
                type: opts?.value || "string",
              }}
            />

            <IconButton
              icon={<FaTrash />}
              aria-label={"dasdad"}
              variant={"solid"}
              colorScheme={"red"}
              zIndex={"1"}
              size={"xs"}
              onClick={() => remove(index)}
            />
          </Flex>
        ))}

        <Button
          onClick={add}
          size={"xs"}
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
