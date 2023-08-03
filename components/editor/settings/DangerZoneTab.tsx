import { updatePassword } from "@/lib/services/user-service";
import { toastError, toastSuccess } from "@/lib/utils/toasts";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  TabPanel,
  useColorMode,
} from "@chakra-ui/react";
import { useState } from "react";

const ChangePassword = () => {
  const { colorMode } = useColorMode();
  const bg = colorMode === "light" ? "white" : "black";

  const [loading, setLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

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
      toastSuccess("Password updated successfully");

      setOldPassword("");
      setNewPassword("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box bg={bg} borderRadius={"12px"} p={"7px"}>
        <Flex
          border={"1px solid #f55f"}
          borderRadius={"12px"}
          flexDir={"column"}
          gap={"20px"}
          p={"14px 14px"}
        >
          <Heading fontSize={"xl"}>Change Password</Heading>

          <FormControl>
            <FormLabel fontSize={"md"}>Old password</FormLabel>
            <Input
              type={"password"}
              placeholder={"Old password"}
              size={"md"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize={"md"}>New password</FormLabel>
            <Input
              type={"password"}
              placeholder={"New password"}
              size={"md"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </FormControl>

          <FormControl>
            <Button
              type={"submit"}
              colorScheme={"red"}
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
      <Flex flexDir={"column"} gap={"20px"}>
        <ChangePassword />
      </Flex>
    </TabPanel>
  );
}
