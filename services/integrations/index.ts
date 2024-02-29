import client from '@/lib/clients/graphql';

import CreateTwitchIntegrationMutation from './graphql/createTwitchIntegrationMutation';
import GetUserIntegrationsQuery from './graphql/getUserIntegrationsQuery';
import RemoveIntegrationMutation from './graphql/removeIntegrationMutation';
import IIntegration from './integration';

export async function getUserIntegrations(): Promise<IIntegration[]> {
  const integration = await client.fetch(GetUserIntegrationsQuery);
  return integration as IIntegration[];
}

export async function createTwitchIntegration(
  code: string,
): Promise<IIntegration> {
  const integration = await client.fetch(CreateTwitchIntegrationMutation, {
    code,
  });
  return integration as IIntegration;
}

export async function disconnectIntegration(id: string): Promise<Boolean> {
  const deleted = await client.fetch(RemoveIntegrationMutation, { id });
  return deleted as Boolean;
}
