import { Box, Checkbox, Flex, Heading, TabPanel } from '@chakra-ui/react';

import ServiceType from '@/services/shared/service-type';
import SettingsScope, {
  SettingsScopeData,
  SettingsScopes,
} from '@/services/shared/settings-scope';

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
      isChecked={checked}
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

  const isEnabled = (scope: SettingsScopeData) => {
    const enabled = scopes.includes(scope.id);
    return enabled;
  };

  return (
    <>
      {scopeList.map((scope) => (
        <ScopeCheckbox
          key={scope.id}
          id={scope.id}
          name={scope.name}
          checked={isEnabled(scope)}
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

// ScopesTab
interface ScopesTabProps {
  scopes: SettingsScope[];
  setScopes: (fields: SettingsScope[]) => void;
  service: ServiceType;
}

export default function ScopesTab({
  scopes,
  setScopes,
  service,
}: ScopesTabProps) {
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

          <Box>
            <ScopeList
              scopes={scopes}
              setScopes={setScopes}
              service={service}
            />
          </Box>
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
            XD
          </Flex>
        </Flex>
      </Flex>
    </TabPanel>
  );
}
