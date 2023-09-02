import { ITwitchCustomReward } from "@/lib/interfaces/twitch/custom-reward";
import { Box, Flex, Image, Text } from "@chakra-ui/react";

import styles from "./TwitchRewardCard.module.css";

export interface TwitchRewardCardProps {
  reward: ITwitchCustomReward;
  variant?: "horizontal" | "vertical";
  size?: "lg" | "md" | "sm";
  onSelect?: (reward: ITwitchCustomReward) => void;
}

export default function TwitchRewardCard({
  size,
  reward,
  onSelect,
  variant,
}: TwitchRewardCardProps) {
  return (
    <Box className={styles[`card-${size || "lg"}`]}>
      <Flex
        className={styles.card}
        flexDirection={variant == "horizontal" ? "row" : "column"}
        onClick={() => {
          onSelect && onSelect(reward);
        }}
      >
        <Box className={styles.icon} bg={reward.background_color}>
          <Image
            alt="Twitch Custom Reward Icon"
            src={reward.image?.url_4x || reward.default_image?.url_4x}
          />
        </Box>

        <Text className={styles.title}>{reward.title}</Text>
      </Flex>
    </Box>
  );
}
