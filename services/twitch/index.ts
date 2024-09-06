import client from '@/lib/clients/graphql';
import { TwitchCustomReward } from '@staroverlay/sdk';

import GetTwitchCustomRewardsQuery from './graphql/getTwitchCustomRewardsQuery';

export async function getCustomRewards(): Promise<TwitchCustomReward[]> {
  const rewards = await client.fetch(GetTwitchCustomRewardsQuery, {});
  return rewards as TwitchCustomReward[];
}
