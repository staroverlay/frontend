import ITemplateField from "@/lib/interfaces/template-field";
import { Button } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import { TabPanel } from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import FieldItem from "./fields/FieldItem";

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
