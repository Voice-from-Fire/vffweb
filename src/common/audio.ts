import { Sample } from "../api/api";
import { BASEPATH } from "../config";

export function audioUrl(sample: Sample): string {
  return BASEPATH + "/audio_files/" + sample.audio_files[0].path;
}
