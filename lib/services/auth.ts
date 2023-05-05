import client from "../graphql/client";
import getCurrentUserQuery from "../graphql/queries/getCurrentUserQuery";
import User from "../interfaces/user";

export async function getCurrentUser(): Promise<User> {
  const user = await client.fetch(getCurrentUserQuery);
  return user as User;
}
