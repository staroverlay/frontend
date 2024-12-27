import { Token } from '@staroverlay/sdk';

import client from '@/lib/clients/graphql';
import CreateTokenMutation from './graphql/createTokenMutation';
import DeleteAllTokensMutation from './graphql/deleteAllTokensMutation';
import DeleteTokenMutation from './graphql/deleteTokenMutatation';
import GetMyTokensQuery from './graphql/getMyTokensQuery';
import UpdateTokenMutation from './graphql/updateTokenMutation';

export interface CreateTokenDTO {
  name: string;
}

export type UpdateTokenDTO = Partial<CreateTokenDTO>;

export async function createToken(payload: CreateTokenDTO): Promise<string> {
  return (await client.fetch(CreateTokenMutation, {
    payload,
  })) as unknown as string;
}

export async function deleteAllTokens(): Promise<boolean> {
  return (await client.fetch(DeleteAllTokensMutation)) as unknown as boolean;
}

export async function deleteToken(tokenId: string): Promise<boolean> {
  return (await client.fetch(DeleteTokenMutation, {
    tokenId,
  })) as unknown as boolean;
}

export async function getMyTokens(): Promise<Token[]> {
  return (await client.fetch(GetMyTokensQuery)) as Token[];
}

export async function updateToken(tokenId: string, payload: UpdateTokenDTO) {
  return (await client.fetch(UpdateTokenMutation, {
    tokenId,
    payload,
  })) as unknown as boolean;
}
