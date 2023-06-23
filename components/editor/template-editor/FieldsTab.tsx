import ITemplateField, {
  TemplateFieldType,
  TemplateFieldTypes,
} from "@/lib/interfaces/template-field";
import { Input, Select } from "@chakra-ui/react";
import { FormLabel } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Divider } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { SimpleGrid } from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import { TabPanel } from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";

interface FieldItemProps {
  field: ITemplateField;
  onUpdate: (field: ITemplateField) => void;
  onRemove: (field: ITemplateField) => void;
  onUp: (field: ITemplateField) => void;
  onDown: (field: ITemplateField) => void;
}

function FieldItem({
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

  useEffect(() => {
    onUpdate({ ...field, id, label, type, category, description });
  }, [category, description, field, id, label, onUpdate, type]);

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
    </Flex>
  );
}

interface FieldsTabProps {
  fields: ITemplateField[] | null | undefined;
  setFields: (fields: ITemplateField[]) => void;
}

export default function FieldsTab({ fields, setFields }: FieldsTabProps) {
  const [generatedFields, setGeneratedFields] = useState(1);
  const [savedFields, setSavedFields] = useState<ITemplateField[]>(
    fields || []
  );

  useEffect(() => {
    setFields(savedFields);
  }, [savedFields, setFields]);

  const addField = () => {
    const newField: ITemplateField = {
      id: "new-field-" + generatedFields,
      label: "New Field",
      type: "string",
      required: false,
    };
    setSavedFields([...savedFields, newField]);
    setGeneratedFields(generatedFields + 1);
  };

  const upFieldIndex = (field: ITemplateField) => {
    const index = savedFields.findIndex((f) => f.id === field.id);
    if (index === 0) return;
    const updatedFields = [...savedFields];
    updatedFields[index] = savedFields[index - 1];
    updatedFields[index - 1] = field;
    setSavedFields(updatedFields);
  };

  const downFieldIndex = (field: ITemplateField) => {
    const index = savedFields.findIndex((f) => f.id === field.id);
    if (index === savedFields.length - 1) return;
    const updatedFields = [...savedFields];
    updatedFields[index] = savedFields[index + 1];
    updatedFields[index + 1] = field;
    setSavedFields(updatedFields);
  };

  const updateField = (field: ITemplateField) => {
    const index = savedFields.findIndex((f) => f.id === field.id);
    const updatedFields = [...savedFields];
    updatedFields[index] = field;
    setSavedFields(updatedFields);
  };

  const removeField = (field: ITemplateField) => {
    setSavedFields(savedFields.filter((f) => f != field));
  };

  return (
    <TabPanel>
      <Flex direction={"column-reverse"} gap={"10px"} width={"50%"}>
        <Button onClick={addField}>Add</Button>

        {savedFields.map((field) => (
          <FieldItem
            key={field.id}
            field={field}
            onDown={(field) => downFieldIndex(field)}
            onUp={(field) => upFieldIndex(field)}
            onRemove={(field) => removeField(field)}
            onUpdate={(field) => updateField(field)}
          />
        ))}
      </Flex>
    </TabPanel>
  );
}
