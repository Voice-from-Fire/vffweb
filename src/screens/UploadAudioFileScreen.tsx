import React, { useEffect, useState } from "react";
import { LoggedScreenWrapper } from "../components/LoggedScreenWrapper";
import { callGuard, createSamplesApi } from "../common/service";
import { LoadingBar } from "../components/LoadingWrapper";
import {
  Button,
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import { addInfo } from "../common/info";
import axios from "axios";
import { AudioPlayer } from "../components/AudioPlayer";
import { Language } from "../api/api";
import { LanguageDisplay } from "../components/LanguageDisplay";
import { FileUploader } from "react-drag-drop-files";

type Recording = {
  blobUrl: string;
  mimeType: string;
  duration: number;
};

type RecordingMetadata = {
  language: string;
};

enum RecordingState {
  Idle,
  Replay,
  Uploading,
}

const fileTypes = ["mp3", "ogg", "webm"];

function DragDrop(props: { setRecording: (r: Recording) => void }) {
  const handleChange = (file: File) => {
    props.setRecording({
      blobUrl: URL.createObjectURL(file),
      mimeType: file.type,
      duration: file.size,
    });
  };
  return (
    <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
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

export function UploadAudioFileScreen() {
  const [state, setState] = useState<RecordingState>(RecordingState.Idle);
  const [recording, setRecording] = useState<Recording | null>(null);

  useEffect(
    () => () => {
      if (recording !== null) {
        URL.revokeObjectURL(recording.blobUrl);
      }
    },
    [recording]
  );

  const onDiscard = () => {
    if (recording) {
      URL.revokeObjectURL(recording.blobUrl);
      setRecording(null);
      setState(RecordingState.Idle);
    }
  };

  const onNewRecording = (recording: Recording) => {
    if (recording.duration < 0.05 /* TODO 1.5 */) {
      URL.revokeObjectURL(recording.blobUrl);
      addInfo("error", "Recording is too short. It has to be at least 1.5s");
      return;
    }
    setRecording(recording);
    setState(RecordingState.Replay);
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
      setState(RecordingState.Idle);
    } else {
      // Upload fail, error info provided by guard
      setState(RecordingState.Replay);
    }
  };

  const build_body = () => {
    switch (state) {
      case RecordingState.Idle:
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <DragDrop setRecording={onNewRecording} />
          </div>
        );
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
    <LoggedScreenWrapper title="Upload audio file">
      {build_body()}
    </LoggedScreenWrapper>
  );
}
