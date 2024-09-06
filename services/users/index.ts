import { User } from '@staroverlay/sdk';

import client from '@/lib/clients/graphql';
import CreateUserDTO from './dto/create-user.dto';
import UpdatePasswordDTO from './dto/update-password.dto';
import UpdateUserDTO from './dto/update-user.dto';
import CreateUserMutation from './graphql/createUserMutation';
import CreateUserWithTwitchMutation from './graphql/createUserWithTwitchMutation';
import getCurrentUserQuery from './graphql/getCurrentUserQuery';
import UpdatePasswordMutation from './graphql/updatePasswordMutation';
import UpdateUserMutation from './graphql/updateUserMutation';
import VerifyEmailMutation from './graphql/verifyEmailMutation';

export async function getCurrentUser(): Promise<User> {
  const user = await client.fetch(getCurrentUserQuery);
  return user as User;
}

export async function createUser(payload: CreateUserDTO): Promise<User> {
  const user = await client.fetch(CreateUserMutation, { payload });
  return user as User;
}

export async function createUserWithTwitch(code: string): Promise<User> {
  const user = await client.fetch(CreateUserWithTwitchMutation, { code });
  return user as User;
}

export async function verifyEmail(code: string): Promise<User> {
  const user = await client.fetch(VerifyEmailMutation, { code });
  return user as User;
}

export async function updateUser(payload: UpdateUserDTO): Promise<User> {
  const user = await client.fetch(UpdateUserMutation, { payload });
  return user as User;
}

export async function updatePassword(
  payload: UpdatePasswordDTO,
): Promise<boolean> {
  const user = await client.fetch(UpdatePasswordMutation, { payload });
  return user != null;
}
