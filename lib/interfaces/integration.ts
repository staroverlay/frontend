export type IntegrationType = "twitch";

export default interface IIntegration {
  _id: string;
  avatar: string;
  integrationId: string;
  username: string;
  type: IntegrationType;
}
