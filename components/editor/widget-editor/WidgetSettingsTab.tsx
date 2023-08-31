import { useEffect, useState } from "react";
import { TabPanel, Flex } from "@chakra-ui/react";

import ITemplate from "@/lib/interfaces/template";
import IWidget from "@/lib/interfaces/widget";
import IDictionary from "@/lib/interfaces/shared/IDictionary";
import FieldRenderer from "./fields/FieldRenderer";

interface WidgetSettingsTab {
  widget: IWidget;
  template: ITemplate;
  settings: IDictionary;
  setSettings: (settings: IDictionary) => void;
}

export default function WidgetSettingsTab(props: WidgetSettingsTab) {
  const link = `${process.env.NEXT_PUBLIC_WIDGET_SERVER}${props.widget.token}`;

  const [settings, setSettings] = useState(props.settings || []);
  const fields = props.template.fields || [];

  return (
    <TabPanel>
      <Flex justifyContent={"space-evenly"}>
        <Flex flexDirection={"column"} gap={"20px"} width={"30%"}>
          {fields.map((field, index) => (
            <FieldRenderer
              key={index}
              field={field}
              value={settings[field.id]}
              setValue={(value) => {
                const newSettings = { ...settings };
                newSettings[field.id] = value;
                setSettings(newSettings);
              }}
            />
          ))}
        </Flex>

        <Flex width={"40%"}>
          <iframe
            src={link}
            sandbox={"true"}
            width={"100%"}
            height={"500"}
            style={{
              borderRadius: "7px",
            }}
          ></iframe>
        </Flex>
      </Flex>
    </TabPanel>
  );
}
