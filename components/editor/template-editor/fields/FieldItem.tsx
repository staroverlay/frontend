import ITemplateField, {
  FieldStringSettings,
  ITemplateAdvancedField,
  TemplateFieldType,
  TemplateFieldTypes,
} from "@/lib/interfaces/template-field";
import {
  Flex,
  IconButton,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import StringFieldItem from "./advanced/StringFieldItem";
import FieldItemAdvanced from "./FieldItemAdvanced";

interface FieldItemProps {
  field: ITemplateField;
  onUpdate: (field: ITemplateField) => void;
  onRemove: (field: ITemplateField) => void;
  onUp: (field: ITemplateField) => void;
  onDown: (field: ITemplateField) => void;
}

export default function FieldItem({
  field,
  onUpdate,
  onRemove,
  onUp,
  onDown,
}: FieldItemProps) {
  const [id, setID] = useState(field.id);
  const [label, setLabel] = useState(field.label);
  const [type, setType] = useState<TemplateFieldType>(field.type);
  const [category, setCategory] = useState(field.category);
  const [description, setDescription] = useState(field.description);
  const [advanced, setAdvanced] = useState<ITemplateAdvancedField>({});

  useEffect(() => {
    const data = {
      ...advanced,
      _internalId: field._internalId,
      id,
      label,
      type,
      category,
      description,
    };
    onUpdate(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, advanced, description, id, label, type]);

  return (
    <Flex
      border={"1px solid"}
      borderColor={"chakra-border-color"}
      borderRadius={"7px"}
      padding={"14px 20px"}
      direction={"column"}
      gap={"20px"}
      alignItems={"flex-end"}
    >
      <IconButton
        icon={<FaTrash />}
        aria-label={"dasdad"}
        float={"right"}
        position={"absolute"}
        variant={"solid"}
        colorScheme={"red"}
        zIndex={"1"}
        size={"xs"}
        onClick={() => onRemove(field)}
      />

      <SimpleGrid
        minChildWidth="120px"
        spacing="10px"
        width={"100%"}
        mt={"10px"}
      >
        <FormControl>
          <FormLabel>ID</FormLabel>
          <Input
            placeholder={"example-field"}
            value={id}
            onChange={(e) => setID(e.target.value)}
            size={"sm"}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Category</FormLabel>
          <Input
            placeholder={"category-name"}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            size={"sm"}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Type</FormLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as TemplateFieldType)}
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

      <SimpleGrid minChildWidth="120px" spacing="10px" width={"100%"}>
        <FormControl>
          <FormLabel>Label</FormLabel>
          <Input
            placeholder={"Example Field"}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            size={"sm"}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input
            placeholder={"A sort description"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size={"sm"}
          />
        </FormControl>
      </SimpleGrid>

      <Divider />

      <FieldItemAdvanced
        type={type}
        setValue={setAdvanced}
        arrayOptions={field.array}
        booleanOptions={field.boolean}
        enumOptions={field.enum}
        mapOptions={field.map}
        numberOptions={field.number}
        stringOptions={field.string}
      />
    </Flex>
  );
}
