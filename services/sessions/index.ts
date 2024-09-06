import { Session, SessionAndUser } from '@staroverlay/sdk';

import client from '@/lib/clients/graphql';
import CreateSessionDTO from './dto/create-session.dto';
import CreateSessionMutation from './graphql/createSessionMutation';
import CreateSessionWithTwitchMutation from './graphql/createSessionWithTwitchMutation';
import GetSessionsQuery from './graphql/getSessionsQuery';
import InvalidateAllSessionsMutation from './graphql/invalidateAllSessionsMutation';
import InvalidateSessionByIDMutation from './graphql/invalidateSessionByIDMutation';
import InvalidateSessionMutation from './graphql/invalidateSessionMutation';

export async function getSessions(): Promise<Session[]> {
  const session = await client.fetch(GetSessionsQuery);
  return session as Session[];
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

export async function createSession(
  payload: CreateSessionDTO,
): Promise<SessionAndUser> {
  const session = await client.fetch(CreateSessionMutation, { payload });
  return session as SessionAndUser;
}

export async function createSessionWithTwitch(
  code: string,
): Promise<SessionAndUser> {
  const session = await client.fetch(CreateSessionWithTwitchMutation, { code });
  return session as SessionAndUser;
}
