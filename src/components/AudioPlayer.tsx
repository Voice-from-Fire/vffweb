export function AudioPlayer(props: { url: string; mimeType: string }) {
  return (
    <audio controls>
      <source src={props.url} type={props.mimeType} />
      Your browser does not support the audio tag.
    </audio>
  );
}
