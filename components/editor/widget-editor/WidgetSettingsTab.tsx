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

export default function WidgetSettingsTab({
  setSettings,
  settings,
  template,
  widget,
}: WidgetSettingsTab) {
  const link = `${process.env.NEXT_PUBLIC_WIDGET_SERVER}${widget.token}`;
  const fields = template.fields || [];

  return (
    <TabPanel>
      <Flex justifyContent={"space-evenly"}>
        <Flex
          flexDirection={"column"}
          gap={"20px"}
          width={"50%"}
          maxWidth={"650px"}
        >
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
