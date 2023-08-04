import client from "../graphql/client";
import CreateTwitchIntegrationMutation from "../graphql/mutations/createTwitchIntegrationMutation";
import RemoveIntegrationMutation from "../graphql/mutations/removeIntegrationMutation";
import SyncProfileWithIntegrationMutation from "../graphql/mutations/syncProfileWithIntegrationMutation";
import GetUserIntegrationsQuery from "../graphql/queries/getUserIntegrationsQuery";

import IIntegration from "../interfaces/integration";
import IUser from "../interfaces/user";

export async function getUserIntegrations(): Promise<IIntegration[]> {
  const integration = await client.fetch(GetUserIntegrationsQuery);
  return integration as IIntegration[];
}

export async function createTwitchIntegration(
  code: string
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

export async function syncProfileWithIntegration(
  integration: IIntegration
): Promise<IUser> {
  const user = await client.fetch(SyncProfileWithIntegrationMutation, {
    id: integration._id,
  });

  return user as IUser;
}
