import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LoggedScreenWrapper } from "../components/LoggedScreenWrapper";
import { callGuard, createSamplesApi } from "../common/service";
import { Sample } from "../api/api";
import { LoadingWrapper } from "../components/LoadingWrapper";
import { Grid } from "@mui/material";
import { AudioPlayer } from "../components/AudioPlayer";
import { audioUrl } from "../common/audio";

enum Status {
  Loading,
  Loaded,
}

type FeedbackState = {
  status: Status;
  sample: Sample | null;
};

async function getNextSample(
  setState: Dispatch<SetStateAction<FeedbackState>>
) {
  const api = createSamplesApi();
  await callGuard(async () => {
    const result = await api.getNextSampleForLabellingSamplesNextGet();
    setState({ status: Status.Loaded, sample: result.data });
  });
}

export function FeedbackScreen() {
  const [state, setState] = useState<FeedbackState>({
    status: Status.Loading,
    sample: null,
  });
  useEffect(() => {
    getNextSample(setState);
  }, []);

  return (
    <LoggedScreenWrapper title="My recordings">
      <LoadingWrapper loaded={state.status !== Status.Loading}>
        {state.sample === null && (
          <div>You have labelled all recordings you can. Thank you!</div>
        )}
        {state.sample !== null && (
          <Grid container justifyContent="center">
            <Grid item xs={12}>
              Sample Id: {state.sample.id}
            </Grid>
            <Grid item xs={12}>
              <AudioPlayer url={audioUrl(state.sample)} mimeType={""} />
            </Grid>
          </Grid>
        )}
      </LoadingWrapper>
    </LoggedScreenWrapper>
  );
}
