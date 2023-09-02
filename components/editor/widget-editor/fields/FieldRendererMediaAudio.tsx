import FieldRendererMedia, {
  FieldRendererMediaProps,
} from "./FieldRendererMedia";

export default function FieldRendererMediaAudio(
  props: FieldRendererMediaProps
) {
  return <FieldRendererMedia {...props} filter="audio" />;
}
