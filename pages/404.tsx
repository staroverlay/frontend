import { Flex, Heading, Text } from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function Error404() {
  return (
    <Flex
      alignItems={'center'}
      justifyContent={'center'}
      flexDirection={'column'}
      gap={'10px'}
      width={'100%'}
      height={'100vh'}
      position={'absolute'}
      zIndex={'-1'}
      top={'0'}
      left={'0'}
    >
      <FaExclamationTriangle fontSize={'60px'} />
      <Heading>404 Not Found</Heading>
      <Text>Oops! This page is in another castle (or maybe deleted)</Text>
    </Flex>
  );
}
