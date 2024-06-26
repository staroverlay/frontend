import ITemplateField, {
  TemplateFieldType,
} from '@/services/template-versions/template-field';

import FieldRendererArray from './FieldRendererArray';
import FieldRendererBoolean from './FieldRendererBoolean';
import FieldRendererEnum from './FieldRendererEnum';
import FieldRendererMap from './FieldRendererMap';
import FieldRendererMedia from './FieldRendererMedia';
import FieldRendererMediaAudio from './FieldRendererMediaAudio';
import FieldRendererMediaImage from './FieldRendererMediaImage';
import FieldRendererMediaVideo from './FieldRendererMediaVideo';
import FieldRendererNumber from './FieldRendererNumber';
import FieldRendererString from './FieldRendererString';
import FieldRendererTwitchReward from './FieldRendererTwitchReward';

export interface FieldRendererProps {
  field: ITemplateField;
  value: any;
  setValue: (value: any) => void;
}

export const RENDER_MAP: {
  [k in TemplateFieldType]: (props: FieldRendererProps) => JSX.Element;
} = {
  string: FieldRendererString,
  number: FieldRendererNumber,
  boolean: FieldRendererBoolean,
  array: FieldRendererArray,
  map: FieldRendererMap,
  enum: FieldRendererEnum,
  'platform:media': FieldRendererMedia,
  'platform:media.audio': FieldRendererMediaAudio,
  'platform:media.image': FieldRendererMediaImage,
  'platform:media.video': FieldRendererMediaVideo,
  'twitch:reward': FieldRendererTwitchReward,
};

export default function FieldRenderer({
  field,
  value,
  setValue,
}: FieldRendererProps) {
  const Renderer = RENDER_MAP[field.type];
  if (Renderer != null) {
    return <Renderer field={field} value={value} setValue={setValue} />;
  }

  return <></>;
}
