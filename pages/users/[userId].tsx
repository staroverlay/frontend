import { Box, Flex } from '@chakra-ui/react';
import { User } from '@staroverlay/sdk';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function UserPage() {
  const { query } = useRouter();
  const userId = query.userId as string;
  const [user, setUser] = useState<User | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {}, [userId]);

  return (
    <Flex
      alignItems={'center'}
      justifyContent={'center'}
      flexDir={'column'}
      width={'100%'}
    >
      <Box width={'100%'} height={'300px'}></Box>
    </Flex>
  );
}
