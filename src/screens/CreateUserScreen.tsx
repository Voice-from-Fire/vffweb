import {
  Box,
  Button,
  Container,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { callGuard, createUsersApi } from "../common/service";
import { addInfo } from "../common/info";
import { useNavigate } from "react-router";

const USERNAME_REGEX = new RegExp("^[a-zA-Z0-9]{3,30}$");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function createAccount(
  code: string,
  name: string,
  password: string,
  email: string
): Promise<boolean> {
  const api = createUsersApi();
  const customErrors = new Map();
  customErrors.set(401, "Invalid invitation code");
  customErrors.set(409, "User already exists");

  const userCreate = {
    name,
    invitation_code: code,
    password,
    email: email.length > 1 ? email : undefined,
  };

  const r = await callGuard(
    async () => await api.createUserUsersPost(userCreate),
    customErrors
  );
  return r !== null;
}

export function CreateUserScreen() {
  const [usernameErr, setUsernameErr] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [inProgress, setInProgress] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = (event: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const code = data.get("code")?.toString()!;
    const username = data.get("name")?.toString()!;
    const password = data.get("password")?.toString()!;
    const password2 = data.get("password2")?.toString()!;
    const email = data.get("email")?.toString()!;

    if (!username) {
      setUsernameErr("Fill in username");
    }

    if (!password) {
      setPasswordErr("Fill in password");
    }

    if (password !== password2) {
      setPasswordErr("Passwords do not match");
    }

    if (password.length < 8) {
      setPasswordErr("Password needs at least 8 characters");
    }

    if (usernameErr || passwordErr) {
      return;
    }
    setInProgress(true);
    createAccount(code, username, password, email).then((done) => {
      if (done) {
        navigate("/");
        addInfo("success", "Account created");
      } else {
        setInProgress(false);
      }
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {inProgress && <LinearProgress />}
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            component="h1"
            variant="h3"
            style={{ paddingTop: 30, paddingBottom: 30 }}
          >
            New account
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="code"
              label="Invitation code"
              name="code"
              autoFocus
              variant="outlined"
              defaultValue=""
            />

            <TextField
              onChange={(event) => {
                const username = event.target.value;
                if (username.length == 0) {
                  setUsernameErr(null);
                } else if (username.length < 3) {
                  setUsernameErr("Username needs at least 3 characters");
                } else if (username.length > 30) {
                  setUsernameErr("Username can't be longer than 30 characters");
                } else if (!USERNAME_REGEX.test(username)) {
                  setUsernameErr(
                    "Username can containy only numbers and digits"
                  );
                } else {
                  setUsernameErr(null);
                }
              }}
              error={Boolean(usernameErr)}
              helperText={usernameErr}
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
              onChange={(event) => {
                const password = event.target.value;
                if (password.length < 8) {
                  setPasswordErr("Password needs at least 8 characters");
                } else {
                  setPasswordErr(null);
                }
              }}
              error={Boolean(passwordErr)}
              helperText={passwordErr}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              variant="standard"
              defaultValue=""
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Password again"
              type="password"
              id="password2"
              variant="standard"
              defaultValue=""
            />
            <TextField
              onChange={(event) => {
                const email = event.target.value;
                if (!email) {
                  setEmailErr(null);
                } else if (!EMAIL_REGEX.test(email)) {
                  setEmailErr("Invalid email");
                } else {
                  setEmailErr(null);
                }
              }}
              error={Boolean(emailErr)}
              helperText={emailErr}
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email (optional; only for password recovery)"
              type="email"
              id="email"
              variant="standard"
              defaultValue=""
            />
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  disabled={inProgress}
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Create account
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => navigate("/")}
                >
                  Back to login
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
