import {
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
} from '@chakra-ui/react';

import ITemplateField, {
  ITemplateAdvancedField,
  TemplateFieldType,
  TemplateFieldTypes,
} from '@/lib/interfaces/templates/template-field';

import FieldItemAdvanced from './FieldItemAdvanced';

interface FieldItemProps {
  field: ITemplateField;
  onUpdate: (field: ITemplateField) => void;
}

export default function FieldItem({ field, onUpdate }: FieldItemProps) {
  const { id, label, type, description } = field;

  const setAdvanced = (advanced: ITemplateAdvancedField) => {
    onUpdate({ ...field, ...advanced });
  };

  const setID = (id: string) => {
    onUpdate({ ...field, id });
  };

  const setLabel = (label: string) => {
    onUpdate({ ...field, label });
  };

  const setType = (type: TemplateFieldType) => {
    onUpdate({ ...field, type });
  };

  const setDescription = (description: string) => {
    onUpdate({ ...field, description });
  };

  return (
    <Flex
      border={'1px solid'}
      borderColor={'chakra-border-color'}
      borderRadius={'7px'}
      padding={'14px 20px'}
      direction={'column'}
      gap={'20px'}
      alignItems={'flex-end'}
    >
      <SimpleGrid
        minChildWidth="120px"
        spacing="10px"
        width={'100%'}
        mt={'10px'}
      >
        <FormControl>
          <FormLabel>ID</FormLabel>
          <Input
            placeholder={'example-field'}
            value={id}
            onChange={(e) => setID(e.target.value)}
            size={'sm'}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Type</FormLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as TemplateFieldType)}
            size={'sm'}
          >
            {TemplateFieldTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </Select>
        </FormControl>
      </SimpleGrid>

      <SimpleGrid minChildWidth="120px" spacing="10px" width={'100%'}>
        <FormControl>
          <FormLabel>Label</FormLabel>
          <Input
            placeholder={'Example Field'}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            size={'sm'}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input
            placeholder={'A sort description'}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size={'sm'}
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
