import client from '@/lib/clients/graphql';

import GetTwitchCustomRewardsQuery from './graphql/getTwitchCustomRewardsQuery';
import { ITwitchCustomReward } from './twitch-custom-reward';

export async function getCustomRewards(): Promise<ITwitchCustomReward[]> {
  const rewards = await client.fetch(GetTwitchCustomRewardsQuery, {});
  return rewards as ITwitchCustomReward[];
}
