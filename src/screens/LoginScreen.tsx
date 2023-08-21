import { Box, Button, Container, TextField, Typography } from "@mui/material";
import logo from "../assets/images/logo.png";
import { useEffect, useState } from "react";
import { callGuard, createUsersApi } from "../common/service";
import { NavigateFunction, useLocation, useNavigate } from "react-router";
import { setLoggedUser } from "../common/user";
import { autoLoginEnabled, autoLoginName, autoLoginPassword } from "../config";
import { SuccessButton } from "../components/SuccessButton";

async function doLogin(
  navigate: NavigateFunction,
  location: string,
  username: string,
  password: string
): Promise<void> {
  const api = createUsersApi();
  const customErrors = new Map();
  customErrors.set(401, "Invalid username or password");
  const r = await callGuard(
    async () => await api.loginAuthTokenPost(username, password),
    customErrors
  );
  if (r === null) {
    return;
  }
  // try {
  //     r = ;
  // } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //         const e = error as AxiosError;
  //         if (e.response?.status === 401) {
  //             addInfo("error", "Invalid username or password");
  //         } else {
  //             addInfo("error", e.message);
  //         }
  //     } else {
  //         addInfo("error", "Unknown error");
  //         console.log(error);
  //     }
  //     return;
  // }

  const user = {
    name: r.data["user"]["name"],
    role: r.data["user"]["role"],
    token: r.data["access_token"],
  };
  setLoggedUser(user);
  navigate(location);
}

export function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("name")?.toString()!;
    const password = data.get("password")?.toString()!;
    if (password.length === 0 || username.length === 0) {
      return;
    }
    setLoading(true);
    if (username != null && password != null) {
      await doLogin(navigate, location, username, password);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (autoLoginEnabled) {
      setLoading(true);
      doLogin(navigate, location, autoLoginName, autoLoginPassword);
    }
  }, [location, navigate]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={logo} alt="logo" width="200" style={{ padding: 10 }} />

          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="User name"
              name="name"
              autoFocus
              variant="standard"
              defaultValue=""
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="standard"
              defaultValue=""
            />
            <SuccessButton
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              loading={loading}
              color="primary"
              type="submit"
            >
              Login
            </SuccessButton>
            <Button
              onClick={() => navigate("/new")}
              fullWidth
              variant="text"
              color="secondary"
              sx={{ mt: 3, mb: 2 }}
            >
              Create new account
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
<Typography
  component="h1"
  variant="h3"
  style={{ paddingTop: 30, paddingBottom: 30 }}
>
  Voice From Fire
</Typography>;
