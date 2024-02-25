import { Button, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import ITemplateField from '@/lib/interfaces/templates/template-field';
import ITemplateFieldGroup from '@/lib/interfaces/templates/template-field-group';
import { randomString } from '@/lib/utils/random';

import SideField from './SideField';

export interface SideFieldCategoryProps {
  category: ITemplateFieldGroup;
  onUpdate: (category: ITemplateFieldGroup) => unknown;
  onRemove: () => unknown;
  onSelect: (field: ITemplateField | null) => unknown;
  onRenameField: (field: ITemplateField, newName: string) => unknown;
  selected: ITemplateField | null | undefined;
}

export default function SideFieldCategory({
  category,
  onUpdate,
  onRemove,
  onRenameField,
  onSelect,
  selected,
}: SideFieldCategoryProps) {
  const [generatedFields, setGeneratedFields] = useState(1);

  const handleRemove = (field: ITemplateField) => {
    category.children = category.children.filter(
      (f) => f._internalId != field._internalId,
    );
    onUpdate(category);

    if (selected === field) {
      onSelect(null);
    }
  };

  const handleAdd = () => {
    const id = `field-${generatedFields}`;
    const item: ITemplateField = {
      _internalId: randomString(6),
      id,
      label: 'New Field',
      type: 'string',
      required: false,
      description: '',
    };
    category.children.push(item);
    onUpdate(category);
    onSelect(item);
    setGeneratedFields(generatedFields + 1);
  };

  const handleFieldUp = (field: ITemplateField) => {
    const children = category.children;
    const index = children.findIndex(
      (f) => f._internalId === field._internalId,
    );
    if (index === 0) return;
    children[index] = children[index - 1];
    children[index - 1] = field;
    onUpdate(category);
  };

  const handleFieldDown = (field: ITemplateField) => {
    const children = category.children;
    const index = children.findIndex(
      (f) => f._internalId === field._internalId,
    );
    if (index === children.length - 1) return;
    children[index] = children[index + 1];
    children[index + 1] = field;
    onUpdate(category);
  };

  return (
    <Flex
      flexDir={'column'}
      gap={'7px'}
      bg={'whiteAlpha.200'}
      borderRadius={'9px'}
      padding={'4px 8px'}
    >
      {category.id && (
        <SideField
          type="category"
          onRemove={onRemove}
          onRename={(newName) => {
            category.id = newName.toLowerCase().replace(/ /g, '_');
            category.label = newName;
            onUpdate(category);
          }}
        >
          {category.label}
        </SideField>
      )}

      {category.children.map((field) => (
        <SideField
          key={field._internalId}
          onSelect={() => onSelect(field)}
          onRemove={() => handleRemove(field)}
          onRename={(name: string) => {
            onRenameField(field, name);
          }}
          selected={selected === field}
          type="item"
        >
          {field.id}
        </SideField>
      ))}

      <Button leftIcon={<FaPlus />} onClick={handleAdd} size={'sm'}>
        Add Field
      </Button>
    </Flex>
  );
}
