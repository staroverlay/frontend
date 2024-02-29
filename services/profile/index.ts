import client from '@/lib/clients/graphql';

import GetMyProfileQuery from './graphql/getMyProfile';
import GetProfileQuery from './graphql/getProfileQuery';
import SyncProfileWithIntegrationMutation from './graphql/syncProfileWithIntegrationMutation';
import Profile from './profile';

export async function getProfile(id: string): Promise<Profile | null> {
  const profile = await client.fetch(GetProfileQuery, { id });
  return profile as Profile | null;
}

export async function getMyProfile(): Promise<Profile> {
  const profile = await client.fetch(GetMyProfileQuery, {});
  return profile as Profile;
}

export async function syncProfileWithIntegration(
  integrationId: string,
): Promise<Profile> {
  const payload = { id: integrationId };
  const profile = await client.fetch(
    SyncProfileWithIntegrationMutation,
    payload,
  );
  return profile as Profile;
}
