import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Switch,
  TabPanel
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import useWidgets from '@/hooks/useWidgets';
import { toastPending } from '@/lib/utils/toasts';
import { emitDebugEvent } from '@/services/events';
import SettingsScope, {
  SettingsScopes
} from '@/services/shared/settings-scope';
import TemplateVersion from '@/services/template-versions/template-version';
import ITemplate from '@/services/templates/template';
import { resetWidgetToken } from '@/services/widgets';
import IWidget from '@/services/widgets/widget';

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

function getScopes(templateScopes: SettingsScope[]) {
  return SettingsScopes.filter((s) =>
    templateScopes.includes(s.id as SettingsScope),
  );
}

interface ScopeListProps {
  templateScopes: SettingsScope[];
  scopes: SettingsScope[];
  setScopes: (scopes: SettingsScope[]) => void;
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

interface WidgetOverviewTabProps {
  widget: IWidget;
  template: ITemplate;
  version: TemplateVersion;
  name: string;
  autoUpdate: boolean;
  setName: (name: string) => void;
  scopes: SettingsScope[];
  setScopes: (scopes: SettingsScope[]) => void;
  setAutoUpdate: (autoUpdate: boolean) => void;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export default function WidgetOverviewTab(props: WidgetOverviewTabProps) {
  const { updateWidget } = useWidgets();
  const link = `${process.env.NEXT_PUBLIC_WIDGET_SERVER}${props.widget.token}`;
  const scopeList = getScopes(props.version.scopes || []);

  const [showLink, setShowLink] = useState(false);
  const toggleShowLink = () => setShowLink(!showLink);

  const [copied, setCopied] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleResetToken = () => {
    setResetting(true);
    toastPending(
      async () => {
        const newWidget = await resetWidgetToken(props.widget);
        updateWidget(newWidget);
      },
      {
        pending: 'Resetting token...',
        success: 'Token reset!',
        error: 'Failed to reset token.',
      },
    ).finally(() => {
      setResetting(false);
    });
  };

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
              <Button
                colorScheme={'orange'}
                onClick={handleResetToken}
                disabled={resetting}
                isLoading={resetting}
              >
                Reset
              </Button>
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

            <Flex
              border={'1px solid'}
              borderColor={'chakra-border-color'}
              borderRadius={'7px'}
              padding={'7px'}
            >
              {scopeList
                .filter((scope) => scope.debuggable)
                .map((scope, index) => (
                  <Button
                    key={index}
                    colorScheme={'cyan'}
                    size={'xs'}
                    mr={'5px'}
                    onClick={() => {
                      emitDebugEvent(props.widget, scope.id);
                    }}
                  >
                    {scope.name}
                  </Button>
                ))}
            </Flex>
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
            <FormLabel>Enabled</FormLabel>

            <Flex alignItems={'center'} gap={'5px'} my={'10px'}>
              <Switch
                isRequired={true}
                isChecked={props.enabled}
                onChange={(e: { target: { checked: boolean; }; }) => props.setEnabled(e.target.checked)}
              />
              <FormHelperText m={'0'}>
                Disabling it will cause the widget to stop working instantly.
              </FormHelperText>
            </Flex>
          </FormControl>

          <FormControl>
            <FormLabel>Auto Update</FormLabel>

            <Flex alignItems={'center'} gap={'5px'} my={'10px'}>
              <Switch
                isRequired={true}
                isChecked={props.autoUpdate}
                onChange={(e: { target: { checked: boolean; }; }) => props.setAutoUpdate(e.target.checked)}
              />
              <FormHelperText m={'0'}>
                Automatically upgrade the widget when the Template is updated.
              </FormHelperText>
            </Flex>

            <Alert status="warning" mt={'3px'}>
              <AlertIcon />
              <AlertTitle>Be careful</AlertTitle>
              <AlertDescription>
                Only enable this if you trust on the template owner.
              </AlertDescription>
            </Alert>
          </FormControl>

          <FormControl>
            <FormLabel>Scopes (Permissions)</FormLabel>
            <ScopeList
              scopes={props.scopes}
              setScopes={props.setScopes}
              templateScopes={props.version.scopes || []}
            />
          </FormControl>
        </Flex>
      </Flex>
    </TabPanel>
  );
}
