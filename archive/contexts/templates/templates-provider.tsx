import { Template } from '@staroverlay/sdk';
import { PropsWithChildren, useEffect, useState } from 'react';

import Loading from '@/components/layout/loading';
import useAuth from '@/hooks/useAuth';
import { getMyTemplates, getSharedTemplates } from '@/services/templates';

import { TemplatesContext } from './templates-context';

export function TemplatesProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [sharedTemplates, setSharedTemplates] = useState<Template[]>([]);
  const [userTemplates, setUserTemplates] = useState<Template[]>([]);
  const [fetched, setFetched] = useState(false);

  const removeTemplate = (template: Template | string) => {
    const id = typeof template === 'string' ? template : template._id;
    setUserTemplates(userTemplates.filter((t) => t._id !== id));
  };

  const addTemplate = (template: Template) => {
    setUserTemplates([...userTemplates, template]);
  };

  const updateTemplate = (template: Template) => {
    setUserTemplates(
      userTemplates.map((t) => (t._id === template._id ? template : t)),
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

    if (user) {
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
      <Loading loaded={fetched} message={'Loading templates'}>
        {children}
      </Loading>
    </TemplatesContext.Provider>
  );
}
