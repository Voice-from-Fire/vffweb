import { Language } from "../api/api";

export function LanguageDisplay({ language }: { language: string }) {
  const stringified = {
    [Language.Cs]: "Czech",
    [Language.En]: "English",
    [Language.Nv]: "Nonverbal",
  }[language];
  return <span>{stringified}</span>;
}
