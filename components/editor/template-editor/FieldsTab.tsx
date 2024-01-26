import { Button, Flex, Heading, TabPanel } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import ITemplateField from '@/lib/interfaces/templates/template-field';
import ITemplateFieldGroup from '@/lib/interfaces/templates/template-field-group';

import FieldRenderer from '../widget-editor/fields/FieldRenderer';
import FieldItem from './fields/FieldItem';
import SideFieldCategory from './side/SideFieldCategory';

interface FieldsTabProps {
  categories: ITemplateFieldGroup[] | null | undefined;
  setCategories: (fields: ITemplateFieldGroup[]) => void;
}

export default function FieldsTab({
  categories,
  setCategories,
}: FieldsTabProps) {
  // State.
  const [savedCategories, setSavedCategories] = useState<ITemplateFieldGroup[]>(
    categories || [],
  );
  const [selectedCategory, setSelectedCategory] =
    useState<ITemplateFieldGroup | null>(null);
  const [selectedField, setSelectedField] = useState<ITemplateField | null>(
    null,
  );
  const [generatedCategories, setGeneratedCategories] = useState(1);

  // Update on state change.
  useEffect(() => {
    setCategories(savedCategories);
  }, [savedCategories, setCategories]);

  // Handlers.
  const handleRemove = (group: ITemplateFieldGroup) => {
    const categories = [...savedCategories].filter((c) => c != group);
    setSavedCategories(categories);
  };

  const handleUpdate = (category: ITemplateFieldGroup) => {
    const categories = [...savedCategories].map((c) =>
      c === category ? category : c,
    );
    setSavedCategories(categories);
  };

  const handleUpdateField = (field: ITemplateField) => {
    const category = savedCategories.find(
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
    setSavedCategories([...savedCategories, category]);
    setGeneratedCategories(generatedCategories + 1);
  };

  return (
    <TabPanel>
      <Flex justifyContent={'space-between'} gap={'20px'}>
        <Flex direction={'column'} gap={'25px'} minWidth={'250px'}>
          {savedCategories.map((group, i) => (
            <SideFieldCategory
              key={i}
              category={group}
              onRemove={() => handleRemove(group)}
              onSelect={(field) => {
                setSelectedField(field);
                setSelectedCategory(group);
              }}
              selected={selectedField}
              onUpdate={handleUpdate}
            />
          ))}

          <Button leftIcon={<FaPlus />} onClick={handleAddCategory} size={'sm'}>
            Add Category
          </Button>
        </Flex>

        <Flex direction={'column'} gap={'10px'} width={'50%'}>
          {selectedField && (
            <FieldItem
              field={selectedField}
              onUpdate={(field) => handleUpdateField(field)}
            />
          )}
        </Flex>

        <Flex
          background={'Background'}
          border={'1px solid'}
          borderColor={'chakra-border-color'}
          borderRadius={'10px'}
          direction={'column'}
          gap={'10px'}
          padding={'10px 20px'}
          width={'40%'}
        >
          <Heading>Preview</Heading>

          {savedCategories.map((category, index) => (
            <Flex key={index} flexDir={'column'} gap={'5px'}>
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
    </TabPanel>
  );
}
