import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  TabPanel,
} from '@chakra-ui/react';
import { useState } from 'react';

import useProfile from '@/hooks/useProfile';
import { toastError, toastSuccess } from '@/lib/utils/toasts';
import { updateProfile } from '@/services/profile';
import UpdateProfileDTO from '@/services/profile/dto/update-profile.dto';

export default function ProfileTab() {
  const { profile, setProfile } = useProfile();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const isModified = displayName !== profile?.displayName;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isModified) return;

    const payload: UpdateProfileDTO = {};

    if (displayName !== profile?.displayName) {
      payload.displayName = displayName;
    }

    const newProfile = await updateProfile(payload).catch((e) => {
      toastError(e.message);
      return null;
    });

    if (newProfile) {
      setProfile(newProfile);
      toastSuccess('Profile updated successfully');
    }
  };

  return (
    <TabPanel>
      <form onSubmit={handleSubmit}>
        <Flex flexDir={'column'} gap={'20px'}>
          <FormControl>
            <FormLabel fontSize={'md'}>Display Name</FormLabel>
            <Input
              placeholder={'YourCoolName'}
              size={'md'}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </FormControl>

          <FormControl>
            <Button type="submit" disabled={!isModified}>
              Save
            </Button>
          </FormControl>
        </Flex>
      </form>
    </TabPanel>
  );
}
