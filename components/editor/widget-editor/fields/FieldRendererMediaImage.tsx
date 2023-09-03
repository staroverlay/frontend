import FieldRendererMedia, {
  FieldRendererMediaProps,
} from './FieldRendererMedia';

export default function FieldRendererMediaImage(
  props: FieldRendererMediaProps,
) {
  return <FieldRendererMedia {...props} filter="image" />;
}
