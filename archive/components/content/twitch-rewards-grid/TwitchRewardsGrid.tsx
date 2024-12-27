import { Button, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { TwitchCustomReward } from '@staroverlay/sdk';

import TwitchRewardCard from '@/components/cards/twitch-reward/TwitchRewardCard';
import useMedia from '@/hooks/useMedia';

interface MediasGridProps {
  rewards: TwitchCustomReward[];
  cardSize?: 'sm' | 'md' | 'lg';
  onSelect?: (reward: TwitchCustomReward) => void;
}

function CreateCustomRewardButton() {
  const { openUploadModal } = useMedia();
  return <Button onClick={openUploadModal}>Create Custom Reward</Button>;
}

export default function TwitchRewardsGrid({
  rewards,
  cardSize,
  onSelect,
}: MediasGridProps) {
  const isEmpty = rewards.length === 0;

  return (
    <>
      <SimpleGrid gridTemplateColumns={'repeat(auto-fit, 70px)'} spacing="40px">
        {rewards.map((reward) => (
          <TwitchRewardCard
            key={reward.id}
            reward={reward}
            size={cardSize}
            onSelect={onSelect}
          />
        ))}
      </SimpleGrid>

      {isEmpty && (
        <Flex alignContent={'center'} justifyContent={'center'}>
          <Flex direction={'column'} alignContent={'center'} gap={'10px'}>
            <Heading>No custom rewards</Heading>
            <CreateCustomRewardButton />
          </Flex>
        </Flex>
      )}
    </>
  );
}
