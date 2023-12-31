import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slide,
  SlideProps,
  Slider,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { AudioStatus, LabelCreate, Sample } from "../api/api";
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
import { genderLabels, naturalLabels } from "../common/labels.const";

const ANIMATION_DURATION = 500;

enum Status {
  Loading,
  Loaded,
}

enum SlideDirection {
  In,
  Out,
}

type FeedbackState = {
  status: Status;
  sample: Sample | null;
};

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
  const [genderSliderValue, setGenderSliderValue] = useState<number>(2);
  const [naturalSliderValue, setNaturalSliderValue] = useState<number>(2);
  const [uploading, setUploading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [slideDirection, setSlideDirection] = useState<SlideDirection>(
    SlideDirection.In
  );

  const getNextSample = useCallback(async () => {
    const api = createSamplesApi();
    setState({
      status: Status.Loading,
      sample: null,
    });
    await callGuard(async () => {
      const result = await api.getNextSampleForLabellingSamplesNextGet();
      setState({
        status: Status.Loaded,
        sample: result.data,
      });
      setSlideDirection(SlideDirection.Out);
      setSuccess(false);
    });
  }, []);

  useEffect(() => {
    getNextSample();
  }, []);

  useEffect(() => {
    if (slideDirection === SlideDirection.Out) {
      const timer = setTimeout(() => {
        getNextSample();
      }, 2 * ANIMATION_DURATION); // Wait for 1s, which is the duration of the slide-out animation

      return () => clearTimeout(timer);
    }
  }, [slideDirection]);

  useEffect(() => {
    if (state.status === Status.Loaded && state.sample) {
      setSlideDirection(SlideDirection.In);
    }
  }, [state.status, state.sample]);

  const handleStateChange = (event: SelectChangeEvent<AudioStatus>) => {
    setAudioStatus(event.target.value as AudioStatus);
  };

  const handleGenderSliderChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setGenderSliderValue(newValue as number);
  };

  const handleNaturalSliderChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setNaturalSliderValue(newValue as number);
  };

  const resetForm = () => {
    setAudioStatus(AudioStatus.Ok);
    setGenderSliderValue(2);
    setNaturalSliderValue(2);
  };

  const handleSubmit = async () => {
    setUploading(true);
    setSuccess(false);
    const labelCreate = {
      status: audioStatus,
      version: 0,
      values: [
        {
          label_type: "g",
          label_value: genderSliderValue,
        },
        {
          label_type: "n",
          label_value: naturalSliderValue,
        },
      ],
    };
    await submitLabel(state!.sample!.id, labelCreate);
    resetForm();
    setUploading(false);
    setSuccess(true);
    setSlideDirection(SlideDirection.Out);
  };

  const slideProps: Partial<SlideProps & { key?: number }> = {
    direction: slideDirection === SlideDirection.In ? "left" : "right",
    in: slideDirection === SlideDirection.In,
    key: state.sample?.id,
    timeout: { enter: ANIMATION_DURATION, exit: ANIMATION_DURATION },
    mountOnEnter: true,
    unmountOnExit: true,
  };

  return (
    <LoggedScreenWrapper title="My recordings">
      <LoadingWrapper loaded={state.status !== Status.Loading}>
        {state.sample === null && (
          <div>You have labelled all recordings you can. Thank you!</div>
        )}
        {state.sample !== null && (
          <Slide {...slideProps}>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 40,
                maxWidth: 400,
                margin: "0 auto",
              }}
            >
              <Typography component="h1" variant="h5">
                Sample Id: {state.sample.id}
              </Typography>
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
                  <MenuItem value={AudioStatus.Skip}>
                    {AudioStatus.Skip}
                  </MenuItem>
                </Select>
              </FormControl>

              {audioStatus === AudioStatus.Ok && (
                <>
                  <FormControl>
                    <InputLabel id="gender-slider-label">Gender</InputLabel>
                    <Slider
                      id="gender-slider"
                      min={0}
                      max={4}
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
          </Slide>
        )}
      </LoadingWrapper>
    </LoggedScreenWrapper>
  );
}
