import Cookies from "js-cookie";
import { atom, useRecoilValue } from "recoil";
import { getRecoil, setRecoil } from "recoil-nexus";

const LOGGED_USER: string = "loggedUser";

export type LoggedUser = {
  name: string;
  token: string;
  role: string;
};

const loggedUser = atom<LoggedUser | null>({
  key: LOGGED_USER,
  default: Cookies.get(LOGGED_USER)
    ? JSON.parse(Cookies.get(LOGGED_USER) as string)
    : null,
});

export function setLoggedUser(user: LoggedUser | null) {
  setRecoil(loggedUser, user);
  Cookies.set(LOGGED_USER, JSON.stringify(user));
}

export function useLoggedUser(): LoggedUser | null {
  return useRecoilValue(loggedUser);
}

export function getLoggedUser(): LoggedUser | null {
  return getRecoil(loggedUser);
}
