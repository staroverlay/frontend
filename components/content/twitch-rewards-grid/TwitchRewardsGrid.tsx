import MediaCard from "@/components/cards/media/MediaCard";
import TwitchRewardCard from "@/components/cards/twitch-reward/TwitchRewardCard";
import useMedia from "@/hooks/useMedia";
import IMedia, { FileType } from "@/lib/interfaces/media";
import { ITwitchCustomReward } from "@/lib/interfaces/twitch/custom-reward";
import { Button, Flex, Heading, SimpleGrid } from "@chakra-ui/react";

interface MediasGridProps {
  rewards: ITwitchCustomReward[];
  cardSize?: "sm" | "md" | "lg";
  onSelect?: (reward: ITwitchCustomReward) => void;
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
      <SimpleGrid gridTemplateColumns={"repeat(auto-fit, 70px)"} spacing="40px">
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
        <Flex alignContent={"center"} justifyContent={"center"}>
          <Flex direction={"column"} alignContent={"center"} gap={"10px"}>
            <Heading>No custom rewards</Heading>
            <CreateCustomRewardButton />
          </Flex>
        </Flex>
      )}
    </>
  );
}
