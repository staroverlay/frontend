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

export interface FieldRendererArrayProps {
  field: ITemplateField;
  value: unknown[];
  setValue: (value: unknown) => void;
}

export default function FieldRendererArray(props: FieldRendererArrayProps) {
  const { field, setValue } = props;
  const value = props.value || [];
  const opts = field.array;

  const updateValue = (index: number, newValue: any) => {
    value[index] = newValue;
    setValue([...value]);
  };

  const add = () => {
    value.push(null);
    setValue([...value]);
  };

  const remove = (index: number) => {
    value.splice(index, 1);
    setValue([...value]);
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
        {value.map((item, index) => (
          <Flex key={index} gap={"5px"} alignItems={"center"}>
            <FieldRenderer
              value={item}
              setValue={(newValue) => updateValue(index, newValue)}
              field={{
                id: "dummy",
                _internalId: "dummy",
                type: opts?.type || "string",
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

        <Button onClick={add} size={"xs"}>
          Add
        </Button>
      </Flex>

      <FormHelperText>{field.description}</FormHelperText>
    </FormControl>
  );
}
