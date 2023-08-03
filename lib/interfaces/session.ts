import { IntegrationType } from "./integration";

export default interface ISession {
  _id: string;
  device: string;
  date: string;
  method?: IntegrationType;
}
