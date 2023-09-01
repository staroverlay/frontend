import {
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Switch,
  Text,
} from "@chakra-ui/react";

import ITemplateField from "@/lib/interfaces/template-field";

export interface FieldRendererBooleanProps {
  field: ITemplateField;
  value: boolean;
  setValue: (value: boolean) => void;
}

export default function FieldRendererBoolean({
  field,
  value,
  setValue,
}: FieldRendererBooleanProps) {
  const opts = field.boolean;

  return (
    <FormControl>
      <FormLabel>{field.label}</FormLabel>

      {(!opts?.display || opts?.display == "checkbox") && (
        <Checkbox
          checked={value || opts?.default || false}
          onChange={(e) => setValue(e.target.checked)}
        >
          {field.description}
        </Checkbox>
      )}

      {opts?.display == "slider" && (
        <Flex alignItems={"center"} gap={"5px"}>
          <Switch
            checked={value || opts?.default || false}
            onChange={(e) => setValue(e.target.checked)}
          ></Switch>
          <Text fontSize={"13px"} color={"gray"}>
            {field.description}
          </Text>
        </Flex>
      )}
    </FormControl>
  );
}
