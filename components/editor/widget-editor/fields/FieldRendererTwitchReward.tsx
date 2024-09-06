import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  useDisclosure,
} from '@chakra-ui/react';
import { TemplateField, TwitchCustomReward } from '@staroverlay/sdk';
import { useEffect } from 'react';

import TwitchRewardCard from '@/components/cards/twitch-reward/TwitchRewardCard';
import TwitchRewardSelectModal from '@/components/modals/twitch-reward-select-modal/TwitchRewardSelectModal';
import useQuery from '@/hooks/useQuery';
import { toastError } from '@/lib/utils/toasts';
import GetTwitchCustomRewardsQuery from '@/services/twitch/graphql/getTwitchCustomRewardsQuery';

export interface FieldRendererTwitchRewardProps {
  field: TemplateField;
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
  } = useQuery<TwitchCustomReward[]>(GetTwitchCustomRewardsQuery);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const selectedReward = ((rewards || []) as TwitchCustomReward[]).find(
    (r) => r.id === value,
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
        bg={'Background'}
        borderRadius={'7px'}
        cursor={'pointer'}
        gap={'10px'}
        padding={'10px'}
        transition={'all 90ms ease-in-out'}
        onClick={onOpen}
        _hover={{
          transform: 'scale(1.05)',
        }}
      >
        {selectedReward == null && <Button size={'sm'}>Select reward</Button>}
        {selectedReward != null && (
          <TwitchRewardCard
            reward={selectedReward as TwitchCustomReward}
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
