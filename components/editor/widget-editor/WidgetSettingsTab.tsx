import { Flex, Heading, TabPanel } from '@chakra-ui/react';

import IDictionary from '@/lib/IDictionary';
import { getFieldPath } from '@/lib/utils/fields';
import TemplateVersion from '@/services/template-versions/template-version';
import IWidget from '@/services/widgets/widget';

import FieldRenderer from './fields/FieldRenderer';

interface WidgetSettingsTab {
  widget: IWidget;
  version: TemplateVersion;
  settings: IDictionary;
  setSettings: (settings: IDictionary) => void;
}

export default function WidgetSettingsTab({
  setSettings,
  settings,
  widget,
  version,
}: WidgetSettingsTab) {
  const link = `${process.env.NEXT_PUBLIC_WIDGET_SERVER}${widget.token}`;
  const fields = version.fields || [];

  console.log(fields);

  return (
    <TabPanel>
      <Flex justifyContent={'space-evenly'}>
        <Flex
          flexDirection={'column'}
          gap={'20px'}
          width={'50%'}
          maxWidth={'650px'}
        >
          {fields.map((field, index) => (
            <Flex
              key={index}
              flexDir={'column'}
              gap={'5px'}
              bg={'whiteAlpha.200'}
              borderRadius={'12px'}
              padding={'20px'}
            >
              <Heading>{field.label}</Heading>
              {field.children.map((child, childIndex) => (
                <FieldRenderer
                  key={childIndex}
                  field={child}
                  value={settings[getFieldPath(field, child)]}
                  setValue={(value) => {
                    const newSettings = { ...settings };
                    newSettings[getFieldPath(field, child)] = value;
                    setSettings(newSettings);
                  }}
                />
              ))}
            </Flex>
          ))}
        </Flex>

        <Flex width={'40%'}>
          <iframe
            src={link}
            width={'100%'}
            height={'500'}
            style={{
              borderRadius: '7px',
            }}
          ></iframe>
        </Flex>
      </Flex>
    </TabPanel>
  );
}
