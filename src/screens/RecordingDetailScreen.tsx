import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Label, Sample } from "../api/api";
import { audioUrl } from "../common/audio";
import { goToRecordings } from "../common/navigation";
import {
  callGuard,
  createLabelsApi,
  createSamplesApi,
} from "../common/service";
import { AudioPlayer } from "../components/AudioPlayer";
import LabelValueChart from "../components/LabelValueChart";
import { LoggedScreenWrapper } from "../components/LoggedScreenWrapper";
import { formatDate } from "../components/RecordingsTable";
import { vff_blue, vff_pink } from "../common/colors.const";
import { genderLabels, naturalLabels } from "../common/labels.const";
import LabelCounts from "../components/LabelCounts";
import DeleteButton from "../components/DeleteButton";

async function downloadSample(sampleId: number): Promise<Sample | null> {
  const api = createSamplesApi();
  return await callGuard(async () => {
    const result = await api.getSampleSamplesSampleIdGet(sampleId);
    return result ? result.data : null;
  });
}

async function getLabels(sampleId: number): Promise<Label[] | null> {
  const api = createLabelsApi();
  return await callGuard(async () => {
    const result = await api.getLabelsForSampleSamplesSampleIdLabelsGet(
      sampleId
    );
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

export interface LabelCount {
  value: number;
  count: number;
}

export interface LabelStatistics {
  statusCounts: { [status: string]: number };
  labelValueData: {
    type: string;
    counts: LabelCount[];
  }[];
}

function calculateLabelStatistics(labels: Label[] | null): LabelStatistics {
  const statusCounts: { [status: string]: number } = {
    ok: 0,
    invalid: 0,
    skip: 0,
  };

  const labelValueCounts: { [type: string]: { [value: number]: number } } = {
    g: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    t: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
  };

  labels?.forEach((label) => {
    statusCounts[label.status] += 1;

    label.values.forEach((value) => {
      labelValueCounts[value.label_type][value.label_value] += 1;
    });
  });

  const labelValueData = Object.entries(labelValueCounts).map(
    ([type, counts]) => {
      return {
        type,
        counts: Object.entries(counts).map(([value, count]) => ({
          value: parseInt(value),
          count,
        })),
      };
    }
  );

  return { statusCounts, labelValueData };
}

function SampleDetail({
  sample,
  labels,
  onDelete,
}: {
  sample: Sample;
  labels: Label[] | null;
  onDelete: () => void;
}) {
  const { statusCounts, labelValueData } = calculateLabelStatistics(labels);

  return (
    <Grid container direction="column" alignItems="center" gap={2}>
      <Typography>{formatDate(sample.created_at!)}</Typography>
      <Grid container direction="row" gap={2} justifyContent="center">
        <AudioPlayer url={audioUrl(sample)} mimeType={""}></AudioPlayer>
        <DeleteButton onDelete={onDelete} />
      </Grid>

      <LabelCounts statusCounts={statusCounts} />

      <LabelValueChart
        counts={labelValueData[0].counts}
        title={"Gender"}
        labels={genderLabels}
        getColor={(value: number) =>
          value < 3 ? vff_pink : value > 3 ? vff_blue : "gray"
        }
      />

      <LabelValueChart
        counts={labelValueData[1].counts}
        title={"Natural"}
        labels={naturalLabels}
        getColor={(value: number) =>
          ["#eeeeee", "#cccccc", "#aaaaaa", "#888888", "#666666"][value]
        }
      />
    </Grid>
  );
}

export function RecordingDetailScreen() {
  const { sampleId } = useParams();
  const [sample, setSample] = useState<Sample | null>(null);
  const [labels, setLabels] = useState<Label[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const download = async () => {
      const sample = await downloadSample(parseInt(sampleId!));
      if (sample !== null) {
        setSample(sample);
        const labels = await getLabels(sample.id!);
        setLabels(labels);
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
        <SampleDetail sample={sample} labels={labels} onDelete={onDelete} />
      )}
    </LoggedScreenWrapper>
  );
}
