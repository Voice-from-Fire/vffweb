import React, { useState } from 'react';
import './App.css';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Card, Grid } from '@mui/material';




function record(setStop: (fn: () => void) => void, setUrl: (s: string) => void) {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      const audioChunks: any[] = [];

      mediaRecorder.addEventListener("dataavailable", event => {
        console.log(event.data);
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        setUrl(audioUrl);
      });

      setStop(() => {
        mediaRecorder.stop();
      });
    });
}

function App() {
  const [stopR, setStop] = useState<(() => void) | null>(null);
  const [url, setUrl] = useState<(string | null)>(null);
  console.log("ZZZ", stopR)
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Audio test
          </Typography>
          {/*<Button color="inherit">Login</Button>*/}
        </Toolbar>
      </AppBar>

      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        //justifyContent="center"
        style={{ minHeight: '100vh', paddingTop: 20 }}
      >

        <Grid item xs={3}>
          <Button disabled={stopR !== null} variant="outlined" onClick={() => record((fn) => {
            setStop(() => fn);
            setUrl(null);
          }, setUrl)}>Start recording</Button>
        </Grid>
        <Grid item xs={3}>
          <Button variant="outlined" onClick={() => {
            console.log("ABC", stopR);
            stopR!()
            setStop(null);
          }}
            disabled={stopR === null}>Stop recording</Button>
        </Grid>

        {/* <Grid item xs={3}>
          <Button variant="outlined" onClick={() => {
            console.log("ABC", stopR);
            stopR!()
            setStop(null);
          }}
            disabled={url === null}>Play recording</Button>
        </Grid> */}
        {url !== null ? <audio src={url} controls /> : null}


      </Grid>

    </Box>
  );

}

export default App;
