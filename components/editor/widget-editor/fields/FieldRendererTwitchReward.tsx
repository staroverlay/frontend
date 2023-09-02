import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import ITemplateField from "@/lib/interfaces/template-field";
import Image from "next/image";
import useMedia from "@/hooks/useMedia";
import { getMediaThumbnail } from "@/lib/utils/media";
import { useEffect, useState } from "react";
import MediaSelectModal from "@/components/modals/media-select-modal/MediaSelectModal";
import useQuery from "@/hooks/useQuery";
import GetTwitchCustomRewardsQuery from "@/lib/graphql/queries/getTwitchCustomRewardsQuery";
import { toastError } from "@/lib/utils/toasts";
import TwitchRewardSelectModal from "@/components/modals/twitch-reward-select-modal/TwitchRewardSelectModal";
import { ITwitchCustomReward } from "@/lib/interfaces/twitch/custom-reward";
import TwitchRewardCard from "@/components/cards/twitch-reward/TwitchRewardCard";

export interface FieldRendererTwitchRewardProps {
  field: ITemplateField;
  value: unknown;
  setValue: (value: unknown) => void;
}

export default function FieldRendererTwitchReward({
  field,
  value,
  setValue,
}: FieldRendererTwitchRewardProps) {
  const {
    data: rewards,
    error: rewardsError,
    loading: rewardsLoading,
  } = useQuery<ITwitchCustomReward[]>(GetTwitchCustomRewardsQuery);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const selectedReward = ((rewards || []) as ITwitchCustomReward[]).find(
    (r) => r.id === value
  );

  useEffect(() => {
    if (rewardsError) {
      toastError(rewardsError.message);
    }
  }, [rewardsError]);

  return (
    <FormControl>
      <TwitchRewardSelectModal
        isOpen={isOpen}
        onClose={onClose}
        onSelect={(reward) => {
          setValue(reward.id);
          onClose();
        }}
        rewards={rewards || []}
      />

      <FormLabel>{field.label}</FormLabel>

      <Flex
        bg={"Background"}
        borderRadius={"7px"}
        cursor={"pointer"}
        gap={"10px"}
        padding={"10px"}
        transition={"all 90ms ease-in-out"}
        onClick={onOpen}
        _hover={{
          transform: "scale(1.05)",
        }}
      >
        {selectedReward == null && <Button size={"sm"}>Select reward</Button>}
        {selectedReward != null && (
          <TwitchRewardCard
            reward={selectedReward as ITwitchCustomReward}
            size="sm"
            variant="horizontal"
            onSelect={() => onOpen()}
          />
        )}
      </Flex>

      <FormHelperText>{field.description}</FormHelperText>
    </FormControl>
  );
}
