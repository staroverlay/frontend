import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  TabPanel,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Token } from '@staroverlay/sdk';
import { useEffect, useRef, useState } from 'react';

import useAuth from '@/hooks/useAuth';
import { toastError, toastSuccess } from '@/lib/utils/toasts';
import { createToken, deleteToken, getMyTokens } from '@/services/tokens';
import { updatePassword } from '@/services/users';
import CopyToClipboard from 'react-copy-to-clipboard';

const ManageTokens = () => {
  const { user } = useAuth();
  const [tokens, setTokens] = useState<Token[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const canCreateToken = tokens.length < 5 && user?.isCreator;
  const initialFocusRef = useRef(null);

  const [creatingToken, setCreatingToken] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [tokenCode, setTokenCode] = useState('');

  const handleDeleteToken = async (tokenId: string) => {
    const result = await deleteToken(tokenId)
      .catch((err) => {
        toastError(err.message);
        return false;
      })
      .finally(() =>
        setTokens([...tokens.filter((token) => token._id !== tokenId)]),
      );

    if (result) {
      toastSuccess('Token deleted successfully');
    }
  };

  const handleCreateToken = async () => {
    if (creatingToken) return;

    if (!tokenName) {
      toastError('Token name is required');
      return;
    }

    setCreatingToken(true);
    const result: string | null = await createToken({ name: tokenName }).catch(
      (err) => {
        toastError(err.message);
        return null;
      },
    );

    if (result) {
      toastSuccess('Token created successfully');
      setTokenCode(result);
      getMyTokens().then(setTokens);
    }
    setCreatingToken(false);
  };

  useEffect(() => {
    getMyTokens().then(setTokens);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setTokenCode('');
      setTokenName('');
    }
  }, [isOpen]);

  return (
    <>
      {/* Token creation modal */}
      <Modal
        initialFocusRef={initialFocusRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Token</ModalHeader>
          <ModalCloseButton />

          {tokenCode && (
            <ModalBody>
              <Text>
                Your token has been created successfully. Please copy the token
                code and keep it safe.
              </Text>

              <Flex
                alignItems={'center'}
                justifyContent={'center'}
                gap={'5px'}
                my={'10px'}
              >
                <Input value={tokenCode} readOnly size={'md'} />

                <CopyToClipboard text={tokenCode}>
                  <Button>Copy</Button>
                </CopyToClipboard>
              </Flex>

              <Text color={'red.500'}>You won't be able to see it again.</Text>
            </ModalBody>
          )}

          {!tokenCode && (
            <>
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Name (A token identification)</FormLabel>
                  <Input
                    ref={initialFocusRef}
                    placeholder="Token Name"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="green" mr={3} onClick={handleCreateToken}>
                  Save
                </Button>

                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Token management UI */}
      <Box borderRadius={'12px'} p={'7px'}>
        <Flex flexDir={'column'} gap={'20px'} p={'14px 14px'}>
          <Heading fontSize={'xl'}>
            Manage Developer Tokens ({tokens.length}/5)
          </Heading>

          <Text opacity={0.7}>
            Developer tokens are used to authenticate your application with the
            StarOverlay API. You can create multiple tokens for different
            applications or environments.
          </Text>

          {!user?.isCreator && (
            <Text fontSize={'sm'} color={'red.500'}>
              You need to be a creator to create developer tokens
            </Text>
          )}

          {tokens.map((token) => (
            <Flex key={token._id} justifyContent={'space-between'}>
              <Flex gap={'5px'} alignItems={'center'} justifyContent={'center'}>
                <Text>{token.name}</Text>
                <Text fontSize={'sm'} color={'gray.500'} ml={'10px'}>
                  {new Date(token.createdAt).toLocaleDateString()}
                </Text>
              </Flex>

              <Flex gap={'5px'}>
                <Button
                  size={'sm'}
                  colorScheme={'red'}
                  onClick={() => handleDeleteToken(token._id)}
                >
                  Delete
                </Button>
              </Flex>
            </Flex>
          ))}

          <Button
            size={'sm'}
            colorScheme={'green'}
            disabled={!canCreateToken || creatingToken}
            onClick={onOpen}
            isLoading={creatingToken}
          >
            Create new developer token
          </Button>
        </Flex>
      </Box>
    </>
  );
};

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payload = { oldPassword, newPassword };
    const result = await updatePassword(payload)
      .catch((err) => {
        toastError(err.message);
        return false;
      })
      .finally(() => setLoading(false));

    if (result) {
      toastSuccess('Password updated successfully');

      setOldPassword('');
      setNewPassword('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box borderRadius={'12px'} p={'7px'}>
        <Flex
          border={'1px solid #f55f'}
          borderRadius={'12px'}
          flexDir={'column'}
          gap={'20px'}
          p={'14px 14px'}
        >
          <Heading fontSize={'xl'}>Change Password</Heading>

          <FormControl>
            <FormLabel fontSize={'md'}>Old password</FormLabel>
            <Input
              type={'password'}
              placeholder={'Old password'}
              size={'md'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize={'md'}>New password</FormLabel>
            <Input
              type={'password'}
              placeholder={'New password'}
              size={'md'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </FormControl>

          <FormControl>
            <Button
              type={'submit'}
              colorScheme={'red'}
              isDisabled={!oldPassword || !newPassword || loading}
              isLoading={loading}
            >
              Change password
            </Button>
          </FormControl>
        </Flex>
      </Box>
    </form>
  );
};

export default function DangerZoneTab() {
  return (
    <TabPanel>
      <Flex flexDir={'column'} gap={'20px'}>
        <ManageTokens />
        <ChangePassword />
      </Flex>
    </TabPanel>
  );
}
