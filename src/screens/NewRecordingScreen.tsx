
import { useEffect, useState } from "react";
import { LoggedScreenWrapper } from "../components/LoggedScreenWrapper";
import { useRecoilValue } from "recoil";
import { useLoggedUser } from "../common/user";
import { callGuard, createSamplesApi } from "../common/service";
import { Language, Sample } from "../api/api";
import { LoadingBar, LoadingWrapper } from "../components/LoadingWrapper";
import { RecordingsTable } from "../components/RecordingsTable";
import { Avatar, Box, Button, Fab, Grid, IconButton, LinearProgress, Stack, Typography } from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import PauseIcon from '@mui/icons-material/Pause';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import RecorderService from "../recorder/RecorderService";
import { addInfo } from "../common/info";
import axios from "axios";


type Recording = {
    blobUrl: string,
    mimeType: string,
    duration: number
}

enum RecordingState {
    Recording,
    Replay,
    Uploading,
}

const micFabStyle = {
    width: 80,
    height: 80,
    backgroundColor: 'primary.main',
};

const pauseFabStyle = {
    width: 80,
    height: 80,
    backgroundColor: '#dd8080',
};

const iconStyle = {
    width: 30,
    height: 30,
};

function Recorder(props: { setRecording: (r: Recording) => void }) {
    let [service, setService] = useState<RecorderService | null>(null);
    let [handler, setHandler] = useState<NodeJS.Timer | null>(null);
    //let [startTime, setStartTime] = useState<number>(0);
    let [time, setTime] = useState<number>(0);

    useEffect(() => () => {
        if (handler !== null) {
            clearInterval(handler);
        }
    }, [handler]);

    const initing = service !== null && handler === null;

    const startRecording = () => {
        const rec = new RecorderService();
        rec.em.addEventListener('error', (evt) => {
            console.log(evt);
        });
        setService(rec);
        rec.startRecording()?.catch((e) => {
            console.log(e);
            addInfo("error", "Microphone initialization failed");
            setService(null);
        }).then(() => {
            const startTime = new Date().getTime();
            const handler = setInterval(() => {
                setTime(new Date().getTime() - startTime)
            }, 100);
            //setStartTime(startTime);

            rec.em.addEventListener('recording', (evt) => {
                setService(null);
                clearInterval(handler);
                setHandler(null);
                const endTime = new Date().getTime();
                let event = evt as any;
                console.log(event);
                props.setRecording({
                    blobUrl: event.detail.recording.blobUrl,
                    mimeType: event.detail.recording.mimeType,
                    duration: (endTime - startTime) / 1000,
                });
            });

            setHandler(handler);
        });
    }

    return <Grid container direction="column" spacing="10">
        <Grid item>
            {handler ? <Fab sx={pauseFabStyle} onClick={() => {
                clearInterval(handler!);
                setHandler(null);
                service?.stopRecording();
            }}>
                <PauseIcon sx={iconStyle} />
            </Fab> : <Fab sx={micFabStyle} onClick={startRecording}>
                <MicIcon sx={iconStyle} />
            </Fab>}
            {/* </IconButton> */}
        </Grid>
        <Grid item>
            <Typography>{initing ? "Initing" : (handler === null ? "Ready to record" : `Recording ... ${(time / 1000).toFixed(1)}s`)}</Typography>
        </Grid>
    </Grid >
}

function Replay(props: { recording: Recording, onUpload: () => void, onDiscard: () => void }) {
    return (
        <Grid container direction="column" spacing="10">
            <Grid item>
                <audio controls>
                    <source src={props.recording.blobUrl} type={props.recording.mimeType} />
                    Your browser does not support the audio tag.
                </audio>
            </Grid>

            <Grid item>
                <Button variant="contained" onClick={props.onUpload} sx={{ width: 145, margin: 0.5 }}>
                    <UploadIcon sx={{ margin: 1.5 }} />
                    Upload recording
                </Button>
                <Button variant="contained" onClick={props.onDiscard} sx={{
                    width: 145, backgroundColor: "gray", margin: 0.5, "&:hover": {
                        backgroundColor: "#444 !important"
                    }
                }}>
                    <DeleteIcon sx={{ margin: 1.5 }} />
                    Discard recording
                </Button>
            </Grid>
        </Grid>)
}


export function NewRecordingScreen() {
    let [state, setState] = useState<RecordingState>(RecordingState.Recording);
    let [recording, setRecording] = useState<Recording | null>(null);

    useEffect(() => () => {
        if (recording !== null) {
            URL.revokeObjectURL(recording.blobUrl);
        }
    }, [recording]);

    const onNewRecording = (recording: Recording) => {
        if (recording.duration < 0.05 /* TODO 1.5 */) {
            URL.revokeObjectURL(recording.blobUrl);
            addInfo("error", "Recording is too short. It has to be at least 1.5s");
            return;
        }
        setRecording(recording);
        setState(RecordingState.Replay);
    }

    const onDiscard = () => {
        if (recording) {
            URL.revokeObjectURL(recording.blobUrl);
            setRecording(null);
            setState(RecordingState.Recording);
        }
    }

    const onUpload = async () => {
        const api = createSamplesApi();
        const result = await axios({
            url: recording?.blobUrl,
            method: 'GET',
            responseType: 'blob'
        });
        const file = new File([result.data], "");

        setState(RecordingState.Uploading);

        const data = await callGuard(async () => {
            return await api.uploadSampleSamplesPost("en", file);
        });

        if (data) {
            // Upload ok
            addInfo("success", "Recording uploaded")
            setState(RecordingState.Recording);

        } else {
            // Upload fail, error info provided by guard
            setState(RecordingState.Replay);
        }
    }

    const build_body = () => {
        switch (state) {
            case RecordingState.Recording:
                return <Recorder setRecording={onNewRecording} />
            case RecordingState.Replay:
                return <Replay recording={recording!} onDiscard={onDiscard} onUpload={onUpload} />
            case RecordingState.Uploading:
                return <LoadingBar />
        }
    }

    return <LoggedScreenWrapper title="New recording">
        {build_body()}
        {/* <Stack>
            <IconButton>
                <MicIcon style={iconStyle} />
            </IconButton>
            <Typography>Read to record</Typography>
        </Stack> */}
    </LoggedScreenWrapper>
}