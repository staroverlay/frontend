import client from '@/lib/clients/graphql';

import Acquisition from './acquisition';
import CreateAcquisitionDTO from './dto/create-acquisition.dto';
import CreateAcquisitionMutation from './graphql/createAcquisitionMutation';
import GetAcquisitionsQuery from './graphql/getAcquisitionsQuery';

export async function createAcquisition(
  payload: CreateAcquisitionDTO,
): Promise<Acquisition> {
  const acquisition = await client.fetch(CreateAcquisitionMutation, {
    payload,
  });
  return acquisition as Acquisition;
}

export async function getAcquisitions(): Promise<Acquisition[]> {
  const acquisitions = await client.fetch(GetAcquisitionsQuery);
  return acquisitions as Acquisition[];
}
