import Loading from '@/components/layout/loading';
import useAuth from '@/hooks/useAuth';
import { getUserIntegrations } from '@/services/integrations';
import IIntegration, {
  IntegrationType,
} from '@/services/integrations/integration';
import { PropsWithChildren, useEffect, useState } from 'react';
import { IntegrationsContext } from './integrations-context';

export function IntegrationsProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<IIntegration[]>([]);
  const [fetched, setFetched] = useState(false);

  const removeIntegration = (integration: IIntegration | string) => {
    const id = typeof integration === 'string' ? integration : integration._id;
    setIntegrations(integrations.filter((m) => m._id !== id));
  };

  const addIntegration = (integration: IIntegration) => {
    setIntegrations([...integrations, integration]);
  };

  const updateIntegration = (integration: IIntegration) => {
    setIntegrations(
      integrations.map((m) => (m._id === integration._id ? integration : m)),
    );
  };

  const getIntegration = (type: IntegrationType) => {
    return integrations.find((m) => m.type === type) || null;
  };

  useEffect(() => {
    const fetchIntegrations = async () => {
      const integrations = await getUserIntegrations();
      setIntegrations(integrations || []);
      setFetched(true);
    };

    if (user) {
      fetchIntegrations();
    } else if (!fetched) {
      setFetched(true);
    }
  }, [user, fetched]);

  return (
    <IntegrationsContext.Provider
      value={{
        integrations,
        removeIntegration,
        addIntegration,
        updateIntegration,
        getIntegration,
      }}
    >
      <Loading loaded={fetched} message={'Loading integrations'}>
        {children}
      </Loading>
    </IntegrationsContext.Provider>
  );
}
