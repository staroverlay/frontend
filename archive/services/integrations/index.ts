import client from '@/lib/clients/graphql';
import { Integration } from '@staroverlay/sdk';

import CreateTwitchIntegrationMutation from './graphql/createTwitchIntegrationMutation';
import GetUserIntegrationsQuery from './graphql/getUserIntegrationsQuery';
import RemoveIntegrationMutation from './graphql/removeIntegrationMutation';

export async function getUserIntegrations(): Promise<Integration[]> {
  const integration = await client.fetch(GetUserIntegrationsQuery);
  return integration as Integration[];
}

export async function createTwitchIntegration(
  code: string,
): Promise<Integration> {
  const integration = await client.fetch(CreateTwitchIntegrationMutation, {
    code,
  });
  return integration as Integration;
}

export async function disconnectIntegration(id: string): Promise<Boolean> {
  const deleted = await client.fetch(RemoveIntegrationMutation, { id });
  return deleted as Boolean;
}
