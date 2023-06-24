import { IconButton } from "@mui/material";
import { Sample } from "../api/api";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { useState } from "react";
import { audioUrl } from "../common/audio";

export function QuickPlayer(props: { sample: Sample }) {
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const start = () => {
    setAudioPlaying(true);

    const audio = new Audio();
    const source = document.createElement("source");
    source.setAttribute("src", audioUrl(props.sample));
    // TODO FIX FOR Safari
    audio.append(source);
    setAudio(audio);
    audio.addEventListener("ended", () => setAudioPlaying(false));
    audio.play();
  };

  const stop = () => {
    setAudioPlaying(false);
    audio?.pause();
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
