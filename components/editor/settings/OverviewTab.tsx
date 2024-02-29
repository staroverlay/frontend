import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  TabPanel,
} from '@chakra-ui/react';
import { useState } from 'react';

import useAuth from '@/hooks/useAuth';
import { hideEmail } from '@/lib/utils/strings';
import { toastError, toastSuccess } from '@/lib/utils/toasts';
import { updateUser } from '@/services/users';

export default function OverviewTab() {
  const { user, setUser } = useAuth();
  const [email, setEmail] = useState(user?.email || '');

  const [displayEmail, setDisplayEmail] = useState(false);
  const isModified = email !== user?.email;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isModified) return;

    const payload: { email?: string } = {};

    if (email !== user?.email) {
      payload.email = email;
    }

    const newUser = await updateUser(payload).catch((e) => {
      toastError(e.message);
      return null;
    });

    if (newUser) {
      setUser(newUser);
      toastSuccess('User updated successfully');
    }
  };

  return (
    <TabPanel>
      <form onSubmit={handleSubmit}>
        <Flex flexDir={'column'} gap={'20px'}>
          <FormControl>
            <Flex alignItems={'center'} gap={'7px'} mb={'5px'}>
              <FormLabel fontSize="md" m={'0'}>
                Email
              </FormLabel>

              <Button
                variant={'outline'}
                size={'sm'}
                fontSize={'12px'}
                onClick={() => {
                  if (displayEmail) {
                    setEmail(user?.email || '');
                  }
                  setDisplayEmail(!displayEmail);
                }}
              >
                {displayEmail ? 'Discard' : 'Edit'}
              </Button>
            </Flex>

            <Input
              placeholder={'john@doe.com'}
              size={'md'}
              type={'email'}
              value={displayEmail ? email : hideEmail(email)}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!displayEmail}
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
