export function LanguageDisplay({ language }: { language: string }) {
  const stringified = {
    cs: "Czech",
    en: "English",
    NV: "Nonverbal",
  }[language];
  return <span>{stringified}</span>;
}
