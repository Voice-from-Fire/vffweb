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
import { UploadAudioFileScreen } from "./screens/UploadAudioFileScreen";
import { UsersScreen } from "./screens/UsersScreen";
import { CreateUserScreen } from "./screens/CreateUserScreen";
import { UserDetailScreen } from "./screens/UserDetailScreen";
import { FeedbackScreen } from "./screens/FeedbackScreen";
import { NotFoundScreen } from "./screens/NotFoundScreen";
import { hasRequiredRole } from "./common/user";

//import RecorderService from './recorder/RecorderService';

function App() {
  const [info, setInfo] = useRecoilState(infoState);
  const user = useLoggedUser();

  let paths;
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
        path: "/Upload",
        element: <UploadAudioFileScreen />,
      },
      {
        path: "/myrecordings",
        element: <MyRecordingsScreen />,
      },
      {
        path: "/new",
        element: <CreateUserScreen />,
      },
      {
        path: "/*",
        element: <NotFoundScreen />,
      },
    ];

    if (hasRequiredRole("reviewer")) {
      paths.push({
        path: "/feedback",
        element: <FeedbackScreen />,
      });
    }

    if (hasRequiredRole("admin")) {
      paths.push(
        {
          path: "/users",
          element: <UsersScreen />,
        },
        {
          path: "/users/:userId",
          element: <UserDetailScreen />,
        }
      );
    }
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
