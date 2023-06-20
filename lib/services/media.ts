import client from "../graphql/client";
import GetAllMediaQuery from "../graphql/queries/getAllMediaQuery";
import IMedia from "../interfaces/media";

export async function getAllMedia() {
  const medias = await client.fetch(GetAllMediaQuery);
  return medias as IMedia[];
}
