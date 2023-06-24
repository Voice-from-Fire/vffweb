import { IconButton } from "@mui/material";
import { Sample } from "../api/api";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { useState } from "react";
import { createAudioFilesApi } from "../common/service";
import { useLoggedUser } from "../common/user";

export function QuickPlayer(props: { sample: Sample }) {
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [audio, setAudio] = useState<AudioBufferSourceNode | null>(null);

  const userToken = useLoggedUser()?.token;
  const start = () => {
    setAudioPlaying(true);

    const api = createAudioFilesApi();
    api
      .getAudioAudioFilesFilenameGet(props.sample.audio_files[0].path, {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        const audioCtx = new AudioContext();
        const source = audioCtx.createBufferSource();
        source.connect(audioCtx.destination);
        setAudio(source);

        audioCtx.decodeAudioData(
          response.data,
          (buffer) => {
            source.buffer = buffer;
            source.start(0);
            source.addEventListener("ended", () => setAudioPlaying(false));
          },
          (error) => {
            console.error(error);
          }
        );
      });
  };

  const stop = () => {
    setAudioPlaying(false);
    audio?.stop();
  };

  return (
    <IconButton
      onClick={() => {
        audioPlaying ? stop() : start();
      }}
    >
      {audioPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
    </IconButton>
  );
}
