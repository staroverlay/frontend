import { Button, Flex, Heading, TabPanel } from '@chakra-ui/react';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import ITemplateField from '@/services/templates/template-field';
import ITemplateFieldGroup from '@/services/templates/template-field-group';

import FieldRenderer from '../widget-editor/fields/FieldRenderer';
import FieldItem from './fields/FieldItem';
import SideFieldCategory from './side/SideFieldCategory';

interface FieldsTabProps {
  fields: ITemplateFieldGroup[];
  setFields: (fields: ITemplateFieldGroup[]) => void;
}

export default function FieldsTab({ fields, setFields }: FieldsTabProps) {
  // State.
  const [selectedCategory, setSelectedCategory] =
    useState<ITemplateFieldGroup | null>(null);
  const [selectedField, setSelectedField] = useState<ITemplateField | null>(
    null,
  );
  const [generatedCategories, setGeneratedCategories] = useState(1);

  // Handlers.
  const handleRemove = (group: ITemplateFieldGroup) => {
    const categories = [...fields].filter((c) => c != group);
    setFields(categories);
  };

  const handleUpdate = (category: ITemplateFieldGroup) => {
    const categories = [...fields].map((c) => (c === category ? category : c));
    setFields(categories);
  };

  const handleUpdateField = (field: ITemplateField) => {
    const category = fields.find(
      (c) =>
        c.children.find((f) => f._internalId === field._internalId) != null,
    );

    if (category) {
      const newChildren = category.children.map((f) =>
        f._internalId === field._internalId ? field : f,
      );

      category.children = newChildren;
      handleUpdate(category);
      setSelectedField(field);
    }
  };

  const handleAddCategory = () => {
    const category = {
      id: 'category-' + generatedCategories,
      label: 'New Category ' + generatedCategories,
      children: [],
    };
    setFields([...fields, category]);
    setGeneratedCategories(generatedCategories + 1);
  };

  return (
    <TabPanel>
      <Flex justifyContent={'space-between'} gap={'20px'}>
        <Flex
          maxWidth={'300px'}
          width={'100%'}
          flexDir={'column'}
          alignItems={'center'}
          gap={'10px'}
        >
          <Heading color={'gray.500'} size={'sm'}>
            Template Settings
          </Heading>

          <Flex direction={'column'} gap={'25px'} width={'100%'}>
            {fields.map((group, i) => (
              <SideFieldCategory
                key={i}
                category={group}
                onRemove={() => handleRemove(group)}
                onSelect={(field) => {
                  setSelectedField(field);
                  setSelectedCategory(group);
                }}
                onRenameField={(field, name) => {
                  field.id = name;
                  handleUpdateField(field);
                }}
                selected={selectedField}
                onUpdate={handleUpdate}
              />
            ))}

            <Button
              leftIcon={<FaPlus />}
              onClick={handleAddCategory}
              size={'sm'}
            >
              Add Category
            </Button>
          </Flex>
        </Flex>

        <Flex
          width={'50%'}
          flexDir={'column'}
          alignItems={'center'}
          gap={'10px'}
        >
          <Heading color={'gray.500'} size={'sm'}>
            {selectedCategory &&
              selectedCategory.id != '' &&
              `${selectedCategory?.id}.`}
            {selectedField && selectedField.id}
          </Heading>

          <Flex direction={'column'} gap={'10px'} width={'100%'}>
            {selectedField && selectedCategory && (
              <FieldItem
                field={selectedField}
                categoryId={selectedCategory.id}
                onUpdate={(field) => handleUpdateField(field)}
              />
            )}
          </Flex>
        </Flex>

        <Flex
          width={'40%'}
          flexDir={'column'}
          alignItems={'center'}
          gap={'10px'}
        >
          <Heading color={'gray.500'} size={'sm'}>
            Preview
          </Heading>

          <Flex
            background={'Background'}
            border={'1px solid'}
            borderColor={'chakra-border-color'}
            borderRadius={'10px'}
            direction={'column'}
            gap={'30px'}
            padding={'10px 20px'}
            width={'100%'}
          >
            {fields.map((category, i) => (
              <Flex key={i} flexDir={'column'} gap={'10px'}>
                <Heading size={'lg'}>{category.label}</Heading>

                {category.children.map((field) => (
                  <FieldRenderer
                    key={field._internalId}
                    field={field}
                    value={null}
                    setValue={(value) => {}}
                  />
                ))}
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </TabPanel>
  );
}
