import client from "../graphql/client";
import GetMyMembershipQuery from "../graphql/queries/getMyMembershipQuery";
import IMembership from "../interfaces/membership";

export async function getMyMembership(): Promise<IMembership | null> {
  const membership = await client.fetch(GetMyMembershipQuery);
  return membership as IMembership | null;
}
