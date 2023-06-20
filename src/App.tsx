import "./App.css";

import { Alert, Snackbar } from "@mui/material";
import { LoginScreen } from "./screens/LoginScreen";
import { useRecoilState } from "recoil";
import { infoState } from "./common/info";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { MyRecordingsScreen } from "./screens/MyRecordingsScreen";
import { useLoggedUser } from "./common/user";
import { NewRecordingScreen } from "./screens/NewRecordingScreen";
import { UsersScreen } from "./screens/UsersScreen";
import { CreateUserScreen } from "./screens/CreateUserScreen";
import { FeedbackScreen } from "./screens/FeedbackSceen";

//import RecorderService from './recorder/RecorderService';

function App() {
  const [info, setInfo] = useRecoilState(infoState);
  const user = useLoggedUser();

  var paths;
  if (user === null) {
    paths = [
      {
        path: "/*",
        element: <LoginScreen />,
      },
      {
        path: "/new",
        element: <CreateUserScreen />,
      },
    ];
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
      {
        path: "/feedback",
        element: <FeedbackScreen />,
      },
      {
        path: "/users",
        element: <UsersScreen />,
      },
      {
        path: "/new",
        element: <CreateUserScreen />,
      },
    ];
  }

  const router = createBrowserRouter(paths);

  const onErrorClose = () => {
    setInfo(info.slice(1));
  };

  return (
    <>
      <RouterProvider router={router} />
      <Snackbar
        open={info.length > 0}
        autoHideDuration={6000}
        onClose={onErrorClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {info.length > 0 ? (
          <Alert
            onClose={onErrorClose}
            severity={info[0]?.severity}
            sx={{ width: "100%" }}
          >
            {info[0]?.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
}

export default App;
