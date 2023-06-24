import React, { useEffect, useState } from "react";
import { LoggedScreenWrapper } from "../components/LoggedScreenWrapper";
import { callGuard, createSamplesApi } from "../common/service";
import { LoadingBar } from "../components/LoadingWrapper";
import {
  Button,
  Fab,
  Grid,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import PauseIcon from "@mui/icons-material/Pause";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import RecorderService from "../recorder/RecorderService";
import { addInfo } from "../common/info";
import axios from "axios";
import { AudioPlayer } from "../components/AudioPlayer";
import { Language } from "../api/api";
import { LanguageDisplay } from "../components/LanguageDisplay";

type Recording = {
  blobUrl: string;
  mimeType: string;
  duration: number;
};

type RecordingMetadata = {
  language: string;
};

enum RecordingState {
  Recording,
  Replay,
  Uploading,
}

const micFabStyle = {
  width: 80,
  height: 80,
  backgroundColor: "primary.main",
};

const pauseFabStyle = {
  width: 80,
  height: 80,
  backgroundColor: "#dd8080",
};

const iconStyle = {
  width: 30,
  height: 30,
};

function Recorder(props: { setRecording: (r: Recording) => void }) {
  const [service, setService] = useState<RecorderService | null>(null);
  const [handler, setHandler] = useState<NodeJS.Timer | null>(null);
  //let [startTime, setStartTime] = useState<number>(0);
  const [time, setTime] = useState<number>(0);

  useEffect(
    () => () => {
      if (handler !== null) {
        clearInterval(handler);
      }
    },
    [handler]
  );

  const initing = service !== null && handler === null;

  const startRecording = () => {
    const rec = new RecorderService();
    rec.em.addEventListener("error", (evt) => {
      console.log(evt);
    });
    setService(rec);
    rec
      .startRecording()
      ?.catch((e) => {
        console.log(e);
        addInfo("error", "Microphone initialization failed");
        setService(null);
      })
      .then(() => {
        const startTime = new Date().getTime();
        const handler = setInterval(() => {
          setTime(new Date().getTime() - startTime);
        }, 100);
        //setStartTime(startTime);

        rec.em.addEventListener("recording", (evt) => {
          setService(null);
          clearInterval(handler);
          setHandler(null);
          const endTime = new Date().getTime();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const event = evt as any;
          console.log(event);
          props.setRecording({
            blobUrl: event.detail.recording.blobUrl,
            mimeType: event.detail.recording.mimeType,
            duration: (endTime - startTime) / 1000,
          });
        });

        setHandler(handler);
      });
  };

  return (
    <Grid container direction="column" spacing="10">
      <Grid item>
        {handler ? (
          <Fab
            sx={pauseFabStyle}
            onClick={() => {
              clearInterval(handler!);
              setHandler(null);
              service?.stopRecording();
            }}
          >
            <PauseIcon sx={iconStyle} />
          </Fab>
        ) : (
          <Fab sx={micFabStyle} onClick={startRecording}>
            <MicIcon sx={iconStyle} />
          </Fab>
        )}
        {/* </IconButton> */}
      </Grid>
      <Grid item>
        <Typography>
          {
            /* eslint-disable */
            initing
              ? "Initing"
              : handler === null
              ? "Ready to record"
              : `Recording ... ${(time / 1000).toFixed(1)}s`
            /* eslint-enable */
          }
        </Typography>
      </Grid>
    </Grid>
  );
}

function Replay(props: {
  recording: Recording;
  onUpload: (metadata: RecordingMetadata) => void;
  onDiscard: () => void;
}) {
  const [language, setLanguage] = React.useState<string>("en");

  return (
    <Grid container direction="column" spacing="10">
      <Grid item>
        <AudioPlayer
          url={props.recording.blobUrl}
          mimeType={props.recording.mimeType}
        />
      </Grid>

      <Grid mt="10px">
        <FormControl variant="filled">
          <InputLabel>Language</InputLabel>
          <Select
            label="Language"
            value={language}
            onChange={(event: SelectChangeEvent) =>
              setLanguage(event.target.value)
            }
          >
            <MenuItem value={Language.En}>
              <LanguageDisplay language={Language.En} />
            </MenuItem>
            <MenuItem value={Language.Cs}>
              <LanguageDisplay language={Language.Cs} />
            </MenuItem>
            <MenuItem value={Language.Nv}>
              <LanguageDisplay language={Language.Nv} />
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          onClick={() => props.onUpload({ language })}
          sx={{ width: 145, margin: 0.5 }}
        >
          <UploadIcon sx={{ margin: 1.5 }} />
          Upload recording
        </Button>
        <Button
          variant="contained"
          onClick={props.onDiscard}
          sx={{
            width: 145,
            backgroundColor: "gray",
            margin: 0.5,
            "&:hover": {
              backgroundColor: "#444 !important",
            },
          }}
        >
          <DeleteIcon sx={{ margin: 1.5 }} />
          Discard recording
        </Button>
      </Grid>
    </Grid>
  );
}

export function NewRecordingScreen() {
  const [state, setState] = useState<RecordingState>(RecordingState.Recording);
  const [recording, setRecording] = useState<Recording | null>(null);

  useEffect(
    () => () => {
      if (recording !== null) {
        URL.revokeObjectURL(recording.blobUrl);
      }
    },
    [recording]
  );

  const onNewRecording = (recording: Recording) => {
    if (recording.duration < 0.05 /* TODO 1.5 */) {
      URL.revokeObjectURL(recording.blobUrl);
      addInfo("error", "Recording is too short. It has to be at least 1.5s");
      return;
    }
    setRecording(recording);
    setState(RecordingState.Replay);
  };

  const onDiscard = () => {
    if (recording) {
      URL.revokeObjectURL(recording.blobUrl);
      setRecording(null);
      setState(RecordingState.Recording);
    }
  };

  const onUpload = async (metadata: RecordingMetadata) => {
    const api = createSamplesApi();
    const result = await axios({
      url: recording?.blobUrl,
      method: "GET",
      responseType: "blob",
    });
    const file = new File([result.data], "");

    setState(RecordingState.Uploading);

    const data = await callGuard(async () => {
      return await api.uploadSampleSamplesPost(metadata.language, file);
    });

    if (data) {
      // Upload ok
      addInfo("success", "Recording uploaded");
      setState(RecordingState.Recording);
    } else {
      // Upload fail, error info provided by guard
      setState(RecordingState.Replay);
    }
  };

  const build_body = () => {
    switch (state) {
      case RecordingState.Recording:
        return <Recorder setRecording={onNewRecording} />;
      case RecordingState.Replay:
        return (
          <Replay
            recording={recording!}
            onDiscard={onDiscard}
            onUpload={onUpload}
          />
        );
      case RecordingState.Uploading:
        return <LoadingBar />;
    }
  };

  return (
    <LoggedScreenWrapper title="New recording">
      {build_body()}
    </LoggedScreenWrapper>
  );
}
