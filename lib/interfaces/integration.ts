export type IntegrationType = "kick" | "twitch" | "youtube";

export default interface IIntegration {
  _id: string;
  avatar: string;
  integrationId: string;
  username: string;
  type: IntegrationType;
}
