import useAuth from "@/hooks/useAuth";
import { updateUser } from "@/lib/services/user-service";
import { hideEmail } from "@/lib/utils/strings";
import { toastError, toastSuccess } from "@/lib/utils/toasts";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  TabPanel,
} from "@chakra-ui/react";
import { useState } from "react";

export default function OverviewTab() {
  const { user, setUser } = useAuth();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  const [displayEmail, setDisplayEmail] = useState(false);

  const isModified = username !== user?.username || email !== user?.email;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isModified) return;

    const payload: { username?: string; email?: string } = {};

    if (username !== user?.username) {
      payload.username = username;
    }

    if (email !== user?.email) {
      payload.email = email;
    }

    const newUser = await updateUser(payload).catch((e) => {
      toastError(e.message);
      return null;
    });

    if (newUser) {
      setUser(newUser);
      toastSuccess("User updated successfully");
    }
  };

  return (
    <TabPanel>
      <form onSubmit={handleSubmit}>
        <Flex flexDir={"column"} gap={"20px"}>
          <FormControl>
            <FormLabel fontSize={"md"}>Username</FormLabel>
            <Input
              placeholder={"Username"}
              size={"md"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormControl>

          <FormControl>
            <Flex alignItems={"center"} gap={"7px"} mb={"5px"}>
              <FormLabel fontSize="md" m={"0"}>
                Email
              </FormLabel>

              <Button
                variant={"outline"}
                size={"sm"}
                fontSize={"12px"}
                onClick={() => {
                  if (displayEmail) {
                    setEmail(user?.email || "");
                  }
                  setDisplayEmail(!displayEmail);
                }}
              >
                {displayEmail ? "Discard" : "Edit"}
              </Button>
            </Flex>

            <Input
              placeholder={"john@doe.com"}
              size={"md"}
              type={"email"}
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
