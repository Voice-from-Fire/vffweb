import { AudioApi, LabelsApi, SamplesApi, UsersApi } from "../api/api";
import { Configuration } from "../api/configuration";
import { getLoggedUser } from "./user";
import { addInfo } from "./info";
import axios, { AxiosError } from "axios";
import { BASEPATH } from "../config";

function createConfig(): Configuration {
  const accessToken = getLoggedUser()?.token;
  return new Configuration({
    basePath: BASEPATH,
    accessToken,
  });
}

export function createUsersApi(): UsersApi {
  return new UsersApi(createConfig());
}

export function createSamplesApi(): SamplesApi {
  return new SamplesApi(createConfig());
}

export function createLabelsApi(): LabelsApi {
  return new LabelsApi(createConfig());
}

export function createAudioFilesApi(): AudioApi {
  return new AudioApi(createConfig());
}

export async function callGuard<T>(
  fn: () => Promise<T>,
  customErrors?: Map<number, string>
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const e = error as AxiosError;
      if (
        customErrors &&
        e.response?.status &&
        customErrors.has(e.response!.status)
      ) {
        addInfo("error", customErrors.get(e.response!.status)!);
      } else {
        addInfo("error", e.message);
      }
    } else {
      addInfo("error", "Unknown error");
      console.log(error);
    }
    return null;
  }
}
