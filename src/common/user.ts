import { atom, useRecoilValue } from "recoil";
import { getRecoil, setRecoil } from "recoil-nexus";

export type LoggedUser = {
    name: string,
    token: string,
    role: string
}

const loggedUser = atom<LoggedUser | null>({
    key: "loggedUser",
    default: null
});

export function setLoggedUser(user: LoggedUser | null) {
    setRecoil(loggedUser, user);
}

export function useLoggedUser(): LoggedUser | null {
    return useRecoilValue(loggedUser);
}

export function getLoggedUser(): LoggedUser | null {
    return getRecoil(loggedUser);
}