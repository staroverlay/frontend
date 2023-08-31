import { useState } from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";

import ITemplate from "@/lib/interfaces/template";
import IWidget, { IWidgetCreatePayload } from "@/lib/interfaces/widget";

export interface WidgetEditorProps {
  template: ITemplate;
  widget?: IWidget;
  onCreate: () => void;
}

export default function WidgetEditor({
  template,
  widget,
  onCreate,
}: WidgetEditorProps) {
  const [payload, setPayload] = useState<IWidgetCreatePayload>(
    widget
      ? {
          displayName: widget.displayName,
          template: widget.template,
          settings: widget.settings,
        }
      : {
          displayName: template.name,
          template: template._id,
          settings: {},
        }
  );

  return (
    <form>
      <FormControl>
        <FormLabel>Display Name</FormLabel>
        <Input
          placeholder="My awesome widget"
          value={payload.displayName}
          onChange={(e) =>
            setPayload({ ...payload, displayName: e.target.value })
          }
        />
      </FormControl>
    </form>
  );
}
