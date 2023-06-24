import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AudioStatus, LabelCreate, LabelType, Sample } from "../api/api";
import { audioUrl } from "../common/audio";
import {
  callGuard,
  createLabelsApi,
  createSamplesApi,
} from "../common/service";
import { AudioPlayer } from "../components/AudioPlayer";
import { LoadingWrapper } from "../components/LoadingWrapper";
import { LoggedScreenWrapper } from "../components/LoggedScreenWrapper";
import { SuccessButton } from "../components/SuccessButton";

enum Status {
  Loading,
  Loaded,
}

type FeedbackState = {
  status: Status;
  sample: Sample | null;
};

const genderLabels: { [value: number]: string } = {
  0: "Female 3/3",
  1: "Female 2/3",
  2: "Female 1/3",
  3: "Neutral",
  4: "Male 1/3",
  5: "Male 2/3",
  6: "Male 3/3",
};

const naturalLabels: { [value: number]: string } = {
  0: "0/4",
  1: "1/4",
  2: "2/4",
  3: "3/4",
  4: "4/4",
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

async function submitLabel(sampleId: number, labelCreate: LabelCreate) {
  const api = createLabelsApi();
  await callGuard(async () => {
    await api.createLabelSamplesSampleIdLabelPost(sampleId, labelCreate);
  });
}

export function FeedbackScreen() {
  const [state, setState] = useState<FeedbackState>({
    status: Status.Loading,
    sample: null,
  });
  const [audioStatus, setAudioStatus] = useState<AudioStatus>(AudioStatus.Ok);
  const [genderSliderValue, setGenderSliderValue] = useState<number>(3);
  const [naturalSliderValue, setNaturalSliderValue] = useState<number>(2);
  const [uploading, setUploading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    getNextSample(setState);
  }, []);

  const handleStateChange = (event: SelectChangeEvent<AudioStatus>) => {
    setAudioStatus(event.target.value as AudioStatus);
    setSuccess(false);
  };

  const handleGenderSliderChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setGenderSliderValue(newValue as number);
    setSuccess(false);
  };

  const handleNaturalSliderChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setNaturalSliderValue(newValue as number);
    setSuccess(false);
  };

  const resetForm = () => {
    setAudioStatus(AudioStatus.Ok);
    setGenderSliderValue(3);
    setNaturalSliderValue(2);
  };

  const handleSubmit = async () => {
    setUploading(true);
    setSuccess(false);
    const labelCreate = {
      status: audioStatus,
      values: [
        {
          label_type: LabelType.G,
          label_value: genderSliderValue,
        },
        {
          label_type: LabelType.T,
          label_value: naturalSliderValue,
        },
      ],
    };
    await submitLabel(state!.sample!.id, labelCreate);
    resetForm();
    setUploading(false);
    setSuccess(true);
    getNextSample(setState);
  };

  return (
    <LoggedScreenWrapper title="My recordings">
      <LoadingWrapper loaded={state.status !== Status.Loading}>
        {state.sample === null && (
          <div>You have labelled all recordings you can. Thank you!</div>
        )}
        {state.sample !== null && (
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 40,
              maxWidth: 400,
              margin: "0 auto",
            }}
          >
            <Box>Sample Id: {state.sample.id}</Box>

            <AudioPlayer url={audioUrl(state.sample)} mimeType={""} />

            <FormControl>
              <InputLabel id="state-select-label">State</InputLabel>
              <Select
                labelId="state-select-label"
                label="State"
                id="state-select"
                value={audioStatus}
                onChange={handleStateChange}
              >
                <MenuItem value={AudioStatus.Ok}>{AudioStatus.Ok}</MenuItem>
                <MenuItem value={AudioStatus.Invalid}>
                  {AudioStatus.Invalid}
                </MenuItem>
                <MenuItem value={AudioStatus.Skip}>{AudioStatus.Skip}</MenuItem>
              </Select>
            </FormControl>

            {audioStatus === AudioStatus.Ok && (
              <>
                <FormControl>
                  <InputLabel id="gender-slider-label">Gender</InputLabel>
                  <Slider
                    id="gender-slider"
                    min={0}
                    max={6}
                    step={1}
                    value={genderSliderValue}
                    onChange={handleGenderSliderChange}
                    valueLabelDisplay="on"
                    valueLabelFormat={(value) => genderLabels[value]}
                    marks
                  />
                </FormControl>
                <FormControl>
                  <InputLabel id="natural-slider-label">Natural</InputLabel>
                  <Slider
                    id="natural-slider"
                    min={0}
                    max={4}
                    step={1}
                    value={naturalSliderValue}
                    onChange={handleNaturalSliderChange}
                    valueLabelDisplay="on"
                    valueLabelFormat={(value) => naturalLabels[value]}
                    marks
                  />
                </FormControl>
              </>
            )}
            <SuccessButton
              success={success}
              loading={uploading}
              color="primary"
              handleButtonClick={handleSubmit}
            >
              Save & Next
            </SuccessButton>
          </Box>
        )}
      </LoadingWrapper>
    </LoggedScreenWrapper>
  );
}
