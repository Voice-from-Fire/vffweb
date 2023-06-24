import Cookies from "js-cookie";
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
  const storedValue = Cookies.get(key);

  let value: T = defaultValue;
  if (storedValue !== undefined) {
    try {
      value = JSON.parse(storedValue);
    } catch (e) {
      console.error(`Cannot deserialize cookie '${pref}'`);
    }
  }

  const [hookValue, setHookValue] = useState<T>(value);
  return [
    hookValue,
    (newValue: T) => {
      Cookies.set(key, JSON.stringify(newValue), {
        expires: 365, // Persist for a year
      });
      setHookValue(newValue);
    },
  ];
}
