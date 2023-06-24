import Cookies from "js-cookie";
import { atom, useRecoilValue } from "recoil";
import { getRecoil, setRecoil } from "recoil-nexus";

const LOGGED_USER: string = "loggedUser";

const ROLES: { [role: string]: number } = {
  user: 0,
  reviewer: 1,
  moderator: 2,
  admin: 3,
};

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

export function hasRequiredRole(role: string) {
  const user = getLoggedUser();
  if (!user) {
    return false;
  }

  return ROLES[user.role] >= ROLES[role];
}
