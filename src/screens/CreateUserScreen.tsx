import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { callGuard, createUsersApi } from "../common/service";
import { addInfo } from "../common/info";
import { useNavigate } from "react-router";


async function createAccount(code: string, name: string, password: string, email: string): Promise<boolean> {
    let api = createUsersApi();
    let customErrors = new Map();
    customErrors.set(401, "Invalid invitation code")
    customErrors.set(409, "User already exists")

    let userCreate = {
        name, invitation_code: code, password, email: email.length > 1 ? email : undefined,
    };

    let r = await callGuard(async () => await api.createUserUsersPost(userCreate), customErrors);
    return r !== null;
}

type Err = {
    name?: string,
    password?: string,
}

export function CreateUserScreen() {
    const [err, setErr] = useState<Err>({});
    const [inProgress, setInProgress] = useState<boolean>(false);


    const navigate = useNavigate();

    const handleSubmit = (event: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const code = data.get("code")?.toString()!;
        const username = data.get("name")?.toString()!;
        const password = data.get("password")?.toString()!;
        const password2 = data.get("password2")?.toString()!;
        const email = data.get("email")?.toString()!;

        let e: Err = {};

        if (username.length < 3) {
            e.name = "Username needs at least 3 characters";
        }


        if (password.length < 8) {
            e.password = "Password needs at least 8 characters";
        } else if (password !== password2) {
            e.password = "Passwords do not match";
        }
        if (e.name !== undefined || e.password !== undefined) {
            setErr(e);
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
        })
    };

    return (<Box sx={{ flexGrow: 1 }}>

        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h3" style={{ paddingTop: 30, paddingBottom: 30 }}>
                    New account
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="User name"
                        name="name"
                        autoFocus
                        variant="standard"
                        defaultValue=""
                        error={err.name !== undefined}
                        helperText={err.name}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        variant="standard"
                        defaultValue=""
                        error={err.password !== undefined}
                        helperText={err.password}
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


    </Box>)
}