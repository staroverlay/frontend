import client from '../graphql/client';
import GetTwitchCustomRewardsQuery from '../graphql/queries/getTwitchCustomRewardsQuery';
import { ITwitchCustomReward } from '../interfaces/twitch/custom-reward';

export async function getCustomRewards(): Promise<ITwitchCustomReward[]> {
  const rewards = await client.fetch(GetTwitchCustomRewardsQuery, {});
  return rewards as ITwitchCustomReward[];
}
