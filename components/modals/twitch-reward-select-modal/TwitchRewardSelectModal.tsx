import { TwitchCustomReward } from '@staroverlay/sdk';

import TwitchRewardsGrid from '@/components/content/twitch-rewards-grid/TwitchRewardsGrid';
import BaseModal from '../base-modal/BaseModal';

interface TwitchRewardSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (reward: TwitchCustomReward) => void;
  rewards: TwitchCustomReward[];
}

export default function TwitchRewardSelectModal({
  isOpen,
  onClose,
  onSelect,
  rewards,
}: TwitchRewardSelectModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size={'lg'}
      title={`Select a Twitch Reward`}
    >
      <TwitchRewardsGrid cardSize="md" rewards={rewards} onSelect={onSelect} />
    </BaseModal>
  );
}
