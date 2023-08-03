import client from "../graphql/client";
import CreateUserMutation from "../graphql/mutations/createUserMutation";
import CreateUserWithTwitchMutation from "../graphql/mutations/createUserWithTwitchMutation";
import UpdateUserMutation from "../graphql/mutations/updateUserMutation";
import VerifyEmailMutation from "../graphql/mutations/verifyEmailMutation";
import getCurrentUserQuery from "../graphql/queries/getCurrentUserQuery";

import IUser from "../interfaces/user";

export async function getCurrentUser(): Promise<IUser> {
  const user = await client.fetch(getCurrentUserQuery);
  return user as IUser;
}

export async function createUser(payload: {
  username: string;
  email: string;
  password: string;
}): Promise<IUser> {
  const user = await client.fetch(CreateUserMutation, { payload });
  return user as IUser;
}

export async function createUserWithTwitch(code: string): Promise<IUser> {
  const user = await client.fetch(CreateUserWithTwitchMutation, { code });
  return user as IUser;
}

export async function verifyEmail(code: string): Promise<IUser> {
  const user = await client.fetch(VerifyEmailMutation, { code });
  return user as IUser;
}

export async function updateUser(payload: {
  username?: string;
  email?: string;
  password?: string;
}): Promise<IUser> {
  const user = await client.fetch(UpdateUserMutation, { payload });
  return user as IUser;
}
