import IImage from './image';

export interface ITwitchCustomReward {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  id: string;
  title: string;
  prompt: string;
  cost: number;
  image?: IImage;
  default_image: IImage;
  background_color: string;
}
