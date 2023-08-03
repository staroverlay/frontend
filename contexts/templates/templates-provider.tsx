import { PropsWithChildren, useEffect, useState } from "react";
import Loading from "../../components/layout/loading";
import useAuth from "../../hooks/useAuth";
import ITemplate from "../../lib/interfaces/template";
import {
  getMyTemplates,
  getSharedTemplates,
} from "../../lib/services/template-service";
import { TemplatesContext } from "./templates-context";

export function TemplatesProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [sharedTemplates, setSharedTemplates] = useState<ITemplate[]>([]);
  const [userTemplates, setUserTemplates] = useState<ITemplate[]>([]);
  const [fetched, setFetched] = useState(false);

  const removeTemplate = (template: ITemplate | string) => {
    const id = typeof template === "string" ? template : template._id;
    setUserTemplates(userTemplates.filter((t) => t._id !== id));
  };

  const addTemplate = (template: ITemplate) => {
    setUserTemplates([...userTemplates, template]);
  };

  const updateTemplate = (template: ITemplate) => {
    setUserTemplates(
      userTemplates.map((t) => (t._id === template._id ? template : t))
    );
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      if (user?.isCreator) {
        const templates = await getMyTemplates();
        setUserTemplates(templates);
      }

      const templates = await getSharedTemplates();
      setSharedTemplates(templates);
      setFetched(true);
    };

    if (user && !fetched) {
      fetchTemplates();
    } else if (!fetched) {
      setFetched(true);
    }
  }, [user, fetched]);

  return (
    <TemplatesContext.Provider
      value={{
        sharedTemplates,
        userTemplates,
        removeTemplate,
        addTemplate,
        updateTemplate,
      }}
    >
      <Loading loaded={fetched} message={"Loading templates"}>
        {children}
      </Loading>
    </TemplatesContext.Provider>
  );
}
