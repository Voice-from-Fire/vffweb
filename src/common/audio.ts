import { Sample } from "../api/api";
import { BASEPATH } from "../config";

export function audioUrl(sample: Sample): string {
  const key = sample.filename.slice(0, 5);
  return `${BASEPATH}/sample/${sample.id}/${key}/mp3`;
}
