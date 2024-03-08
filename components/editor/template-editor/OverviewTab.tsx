import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  TabPanel,
  Textarea,
} from '@chakra-ui/react';

import TemplateCard from '@/components/cards/template/TemplateCard';
import useAuth from '@/hooks/useAuth';
import ServiceType, { ServiceTypes } from '@/services/shared/service-type';
import SettingsScope, {
  SettingsScopes,
} from '@/services/shared/settings-scope';
import TemplateVisibility from '@/services/templates/template-visibility';

interface OverviewTabProps {
  id: string;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  scopes: SettingsScope[];
  setScopes: (scopes: SettingsScope[]) => void;
  service: ServiceType;
  setService: (service: ServiceType) => void;
  visibility: TemplateVisibility;
  price: number;
}

interface ScopeCheckboxProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const ScopeCheckbox = ({ name, checked, onChange }: ScopeCheckboxProps) => {
  return (
    <Checkbox
      width={'100%'}
      defaultChecked={checked}
      onChange={(e) => {
        onChange(e.target.checked);
      }}
    >
      {name}
    </Checkbox>
  );
};

interface ScopeListProps {
  service: ServiceType;
  scopes: SettingsScope[];
  setScopes: (scopes: SettingsScope[]) => void;
}

const ScopeList = ({ service, scopes, setScopes }: ScopeListProps) => {
  const scopeList = SettingsScopes.filter(
    (s) => s.id.startsWith('platform:') || s.id.startsWith(service),
  );

  return (
    <>
      {scopeList.map((scope) => (
        <ScopeCheckbox
          key={scope.id}
          id={scope.id}
          name={scope.name}
          checked={scopes.includes(scope.id as SettingsScope)}
          onChange={(value) => {
            if (value) {
              setScopes([...scopes, scope.id as SettingsScope]);
            } else {
              setScopes(scopes.filter((s) => s !== scope.id));
            }
          }}
        />
      ))}
    </>
  );
};

export default function OverviewTab(props: OverviewTabProps) {
  const { user } = useAuth();

  return (
    <TabPanel>
      <Flex justifyContent={'space-evenly'}>
        <Flex flexDirection={'column'} gap={'20px'} maxWidth={'70%'}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              isRequired={true}
              width={'container.sm'}
              placeholder={'My cool template'}
              value={props.name}
              onChange={(e) => props.setName(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              isRequired={true}
              width={'container.sm'}
              placeholder={'My cool template'}
              value={props.description}
              onChange={(e) => props.setDescription(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Service (Streaming Platform)</FormLabel>
            <Select
              width={'container.sm'}
              value={props.service}
              onChange={(e) => {
                props.setService(e.target.value as ServiceType);
              }}
            >
              {ServiceTypes.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Scopes (Permissions)</FormLabel>
            <ScopeList
              scopes={props.scopes}
              setScopes={props.setScopes}
              service={props.service}
            />
          </FormControl>
        </Flex>

        <Box maxWidth={'350px'} width={'100%'} mt={'30px'}>
          <TemplateCard
            context="editor"
            onCreateWidget={() => {}}
            onDelete={() => {}}
            template={{
              _id: props.id,
              creatorId: user?.profileId || '',
              lastVersionId: '',
              name: props.name,
              visibility: props.visibility,
              description: props.description,
              price: props.price,
              service: props.service,
              storeDescription: '',
            }}
          />
        </Box>
      </Flex>
    </TabPanel>
  );
}
