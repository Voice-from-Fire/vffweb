import { useNavigate, useParams } from "react-router";
import { LoggedScreenWrapper } from "../components/LoggedScreenWrapper";
import React, { useEffect, useState } from "react";
import { callGuard, createSamplesApi } from "../common/service";
import { Sample } from "../api/api";
import { AudioPlayer } from "../components/AudioPlayer";
import { audioUrl } from "../common/audio";
import Grid from "@mui/material/Grid";
import { Button, Typography } from "@mui/material";
import { goToRecordings } from "../common/navigation";
import { formatDate } from "../components/RecordingsTable";

async function downloadSample(sampleId: number): Promise<Sample | null> {
  const api = createSamplesApi();
  return await callGuard(async () => {
    const result = await api.getSampleSamplesSampleIdGet(sampleId);
    return result ? result.data : null;
  });
}

async function deleteSample(sampleId: number): Promise<boolean | null> {
  const api = createSamplesApi();
  return await callGuard(async () => {
    await api.deleteSampleSamplesSampleIdDelete(sampleId);
    return true;
  });
}

function SampleDetail({
  sample,
  onDelete,
}: {
  sample: Sample;
  onDelete: () => void;
}) {
  return (
    <Grid container direction="column" alignItems="center">
      <Typography>{formatDate(sample.created_at!)}</Typography>
      <AudioPlayer url={audioUrl(sample)} mimeType={""}></AudioPlayer>
      <Button variant="contained" color="error" onClick={onDelete}>
        Delete
      </Button>
    </Grid>
  );
}

export function RecordingDetailScreen() {
  const { sampleId } = useParams();
  const [sample, setSample] = useState<Sample | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const download = async () => {
      const sample = await downloadSample(parseInt(sampleId!));
      if (sample !== null) {
        setSample(sample);
      } else {
        goToRecordings(navigate);
      }
    };
    download();
  }, [sampleId]);

  const onDelete = async () => {
    const result = await deleteSample(sample?.id!);
    if (result !== null) {
      goToRecordings(navigate);
    }
  };

  return (
    <LoggedScreenWrapper title={`Recording ${sampleId} detail`}>
      {sample === null ? (
        "Loading"
      ) : (
        <SampleDetail sample={sample} onDelete={onDelete} />
      )}
    </LoggedScreenWrapper>
  );
}
