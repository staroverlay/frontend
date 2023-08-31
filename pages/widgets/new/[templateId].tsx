import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import WidgetEditor from "@/components/editor/widget-editor/WidgetEditor";
import QueryRenderer from "@/components/utils/QueryRenderer";
import ITemplate from "@/lib/interfaces/template";
import { getTemplateByID } from "@/lib/services/template-service";
import Loading from "@/components/layout/loading";
import Error404 from "@/pages/404";

export default function NewWidgetFromTemplate() {
  const { query } = useRouter();
  const { templateId } = query;

  // Find widget by ID in query.
  const [fetched, setFetched] = useState(false);
  const [template, setTemplate] = useState<ITemplate | null>(null);

  useEffect(() => {
    if (!fetched && templateId) {
      getTemplateByID(templateId as string)
        .then((template: ITemplate | null) => {
          setTemplate(template);
        })
        .finally(() => setFetched(true));
    }
  }, [fetched, templateId]);

  if (fetched && !template) {
    return <Error404 />;
  }

  return (
    <Loading loaded={fetched} message="Loading template...">
      <WidgetEditor template={template as ITemplate} onCreate={() => {}} />
    </Loading>
  );
}
