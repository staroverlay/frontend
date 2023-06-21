import client from "../graphql/client";
import DeleteMediaMutation from "../graphql/mutations/deleteMediaMutation";
import GetAllMediaQuery from "../graphql/queries/getAllMediaQuery";
import IMedia from "../interfaces/media";

export async function getAllMedia() {
  const medias = await client.fetch(GetAllMediaQuery);
  return medias as IMedia[];
}

export async function deleteMedia(media: IMedia) {
  const id = media._id;
  return await client.fetch(DeleteMediaMutation, { id });
}
