import { useState } from "react";

export const Preferences = {
  Language: "pref-language",
  AudioInput: "pref-audio-input",
};

export function useStoredPreference<T>(
  pref: keyof typeof Preferences,
  defaultValue: T
): [T, (value: T) => void] {
  const key = Preferences[pref];
  const storedValue = localStorage.getItem(key);

  let value: T = defaultValue;
  if (storedValue !== null) {
    try {
      value = JSON.parse(storedValue);
    } catch (e) {
      console.error(`Cannot deserialize cookie '${pref}': ${e}`);
    }
  }

  const [hookValue, setHookValue] = useState<T>(value);
  return [
    hookValue,
    (newValue: T) => {
      localStorage.setItem(key, JSON.stringify(newValue));
      setHookValue(newValue);
    },
  ];
}
