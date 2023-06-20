import { atom } from "recoil";
import { getRecoil, setRecoil } from "recoil-nexus";

export type Severity = "error" | "success";

export type InfoMessage = {
  severity: Severity;
  message: string;
};

export const infoState = atom<InfoMessage[]>({
  key: "infoState",
  default: [],
});

export function addInfo(severity: Severity, message: string) {
  const info = getRecoil(infoState);
  setRecoil(infoState, [...info, { severity, message }]);
}
