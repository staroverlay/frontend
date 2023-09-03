import {
  TabPanel,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Button,
  FormHelperText,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import ITemplate from '@/lib/interfaces/template';
import TemplateScope, { TemplateScopes } from '@/lib/interfaces/template-scope';
import IWidget from '@/lib/interfaces/widget';

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

function getScopes(templateScopes: TemplateScope[]) {
  return TemplateScopes.filter((s) =>
    templateScopes.includes(s.id as TemplateScope),
  );
}

interface ScopeListProps {
  templateScopes: TemplateScope[];
  scopes: TemplateScope[];
  setScopes: (scopes: TemplateScope[]) => void;
}

const ScopeList = ({ templateScopes, scopes, setScopes }: ScopeListProps) => {
  const scopeList = getScopes(templateScopes);

  return (
    <>
      {scopeList.map((scope) => (
        <ScopeCheckbox
          key={scope.id}
          id={scope.id}
          name={scope.name}
          checked={scopes.includes(scope.id as TemplateScope)}
          onChange={(value) => {
            if (value) {
              setScopes([...scopes, scope.id as TemplateScope]);
            } else {
              setScopes(scopes.filter((s) => s !== scope.id));
            }
          }}
        />
      ))}
    </>
  );
};

interface WidgetOverviewTabProps {
  widget: IWidget;
  template: ITemplate;
  name: string;
  setName: (name: string) => void;
  scopes: TemplateScope[];
  setScopes: (scopes: TemplateScope[]) => void;
}

export default function WidgetOverviewTab(props: WidgetOverviewTabProps) {
  const link = `${process.env.NEXT_PUBLIC_WIDGET_SERVER}${props.widget.token}`;
  const scopeList = getScopes(props.template.scopes || []);

  const [showLink, setShowLink] = useState(false);
  const toggleShowLink = () => setShowLink(!showLink);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      let clearId = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => clearTimeout(clearId);
    }
  }, [copied]);

  return (
    <TabPanel>
      <Flex justifyContent={'space-evenly'}>
        <Flex flexDirection={'column'} gap={'20px'} maxWidth={'70%'}>
          <iframe
            src={link}
            width={'100%'}
            height={'200px'}
            style={{
              borderRadius: '7px',
            }}
          ></iframe>

          <FormControl>
            <FormLabel>URL (Do not show on stream)</FormLabel>
            <Flex gap={'5px'}>
              <Input
                type={showLink ? 'text' : 'password'}
                value={link}
                disabled={true}
              />
              <Button colorScheme={'red'} onClick={toggleShowLink}>
                {showLink ? 'Hide' : 'Show'}
              </Button>
              <Button colorScheme={'orange'}>Reset</Button>
              <CopyToClipboard text={link} onCopy={() => setCopied(true)}>
                <Button colorScheme={copied ? 'green' : 'gray'}>
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </CopyToClipboard>
            </Flex>
            <FormHelperText>
              If you leak it by mistake, hit the &quot;reset&quot; button. You
              should replace the new link in your OBS source.
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>Debug</FormLabel>

            {scopeList.map((scope, index) => (
              <Button key={index} colorScheme={'cyan'} size={'xs'} mr={'5px'}>
                {scope.name}
              </Button>
            ))}
          </FormControl>

          <FormControl>
            <FormLabel>Display name</FormLabel>
            <Input
              isRequired={true}
              width={'container.sm'}
              placeholder={'My cool widget'}
              value={props.name}
              onChange={(e) => props.setName(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Scopes (Permissions)</FormLabel>
            <ScopeList
              scopes={props.scopes}
              setScopes={props.setScopes}
              templateScopes={props.template.scopes || []}
            />
          </FormControl>
        </Flex>
      </Flex>
    </TabPanel>
  );
}
