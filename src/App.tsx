import React, { useState } from 'react';
import './App.css';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Alert, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Snackbar } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import LogoutIcon from '@mui/icons-material/Logout';
import HearingIcon from '@mui/icons-material/Hearing';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import PeopleIcon from '@mui/icons-material/People';
import { LoginScreen } from './screens/LoginScreen';
import { useRecoilState } from 'recoil';
import { infoState } from './common/info';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { MyRecordingsScreen } from './screens/MyRecordingsScreen';
import { useLoggedUser } from './common/user';
import { NewRecordingScreen } from './screens/NewRecordingScreen';


//import RecorderService from './recorder/RecorderService';


function App() {
  const [info, setInfo] = useRecoilState(infoState);
  const user = useLoggedUser();

  var paths;
  if (user === null) {
    paths = [
      {
        path: "/*",
        element: <LoginScreen />
      },
    ]
  } else {
    paths = [
      {
        path: "/",
        element: <Navigate to="/myrecordings" />,
      },
      {
        path: "/record",
        element: <NewRecordingScreen />,
      },
      {
        path: "/myrecordings",
        element: <MyRecordingsScreen />,
      },

    ]
  }

  const router = createBrowserRouter(paths);

  const onErrorClose = () => {
    setInfo(info.slice(1));
  }

  return (
    <>
      <RouterProvider router={router} />
      <Snackbar open={info.length > 0} autoHideDuration={6000} onClose={onErrorClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        {info.length > 0 ? <Alert onClose={onErrorClose} severity={info[0]?.severity} sx={{ width: '100%' }}>
          {info[0]?.message}
        </Alert> : undefined}
      </Snackbar>
    </>);
}

export default App;
