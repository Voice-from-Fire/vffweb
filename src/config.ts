export const isDevEnv: boolean =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export const autoLoginEnabled = false;
export const autoLoginName = "testadmin";
export const autoLoginPassword = "pass";

export const TARGET = "test";

export const BASEPATH: string =
  // @ts-expect-error TARGET is set manually here
  TARGET === "local"
    ? "http://localhost:8000"
    : "https://vff-service-test-beaefp5qmq-ew.a.run.app";

console.log(BASEPATH);
