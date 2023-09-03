import FieldRendererMedia, {
  FieldRendererMediaProps,
} from './FieldRendererMedia';

export default function FieldRendererMediaVideo(
  props: FieldRendererMediaProps,
) {
  return <FieldRendererMedia {...props} filter="video" />;
}
