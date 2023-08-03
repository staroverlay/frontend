import client from "../graphql/client";
import CreateSessionMutation from "../graphql/mutations/createSessionMutation";
import CreateSessionWithTwitchMutation from "../graphql/mutations/createSessionWithTwitchMutation";
import InvalidateAllSessionsMutation from "../graphql/mutations/invalidateAllSessionsMutation";
import InvalidateSessionByIDMutation from "../graphql/mutations/invalidateSessionByIDMutation";
import InvalidateSessionMutation from "../graphql/mutations/invalidateSessionMutation";
import GetSessionsQuery from "../graphql/queries/getSessionsQuery";

import ISession from "../interfaces/session";
import ISessionAndUser from "../interfaces/session-and-user";

export async function getSessions(): Promise<ISession[]> {
  const session = await client.fetch(GetSessionsQuery);
  return session as ISession[];
}

export async function invalidateSession(): Promise<Boolean> {
  const success = await client.fetch(InvalidateSessionMutation);
  return success as Boolean;
}

export async function invalidateAllSessions(): Promise<Boolean> {
  const success = await client.fetch(InvalidateAllSessionsMutation);
  return success as Boolean;
}

export async function invalidateSessionByID(id: string): Promise<Boolean> {
  const success = await client.fetch(InvalidateSessionByIDMutation, { id });
  return success as Boolean;
}

export async function createSession(payload: {
  email: string;
  password: string;
}): Promise<ISessionAndUser> {
  const session = await client.fetch(CreateSessionMutation, { payload });
  return session as ISessionAndUser;
}

export async function createSessionWithTwitch(
  code: string
): Promise<ISessionAndUser> {
  const session = await client.fetch(CreateSessionWithTwitchMutation, { code });
  return session as ISessionAndUser;
}
