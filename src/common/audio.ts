import { Sample } from "../api/api";
import { BASEPATH } from "../config";

export function audioUrl(sample: Sample): string {
  return BASEPATH + "/sample/" + sample.id + "/mp3";
}
