import { IntegrationType } from '../integrations/integration';

export default interface ISession {
  _id: string;
  device: string;
  date: string;
  location: string;
  method?: IntegrationType;
}
