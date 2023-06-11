import { IconButton, duration } from "@mui/material";
import { Sample } from "../api/api";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { useState } from "react";
import { audioUrl } from "../common/audio";


export function QuickPlayer(props: { sample: Sample }) {
    const [startTime, setStartTime] = useState<number | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const start = () => {
        setStartTime(10);

        const audio = new Audio();
        const source = document.createElement('source');
        source.setAttribute('src', audioUrl(props.sample));
        // TODO FIX FOR Safari
        audio.append(source);
        setAudio(audio);
        audio.play()
    };

    const stop = () => {
        setStartTime(null);
        audio?.pause()
    };

    return <IconButton onClick={() => { startTime === null ? start() : stop() }}>{startTime === null ? <PlayCircleIcon /> : <PauseCircleIcon />}</IconButton>
}