import { Box, Button, Checkbox, Container, FormControlLabel, Grid, TextField, Typography } from "@mui/material";
import logo from '../assets/images/logo.png';
import React, { useEffect } from "react";
import { UsersApi, UsersApiAxiosParamCreator, UsersApiFp } from "../api/api";
import { Configuration } from "../api/configuration";
import { callGuard, createUsersApi } from "../common/service";
import { addInfo } from "../common/info";
import axios, { Axios, AxiosError } from "axios";
import { NavigateFunction, useLocation, useNavigate } from "react-router";
import { setLoggedUser } from "../common/user";


async function doLogin(navigate: NavigateFunction, location: string, username: string, password: string): Promise<void> {
    let api = createUsersApi();
    let customErrors = new Map();
    customErrors.set(401, "Invalid username or password")
    let r = await callGuard(async () => await api.loginAuthTokenPost(username, password), customErrors);
    if (r === null) {
        return
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

    let user = {
        name: r.data["user"]["name"],
        role: r.data["user"]["role"],
        token: r.data["access_token"]
    }
    console.log(user);
    setLoggedUser(user);
    navigate(location)
}

export function LoginScreen() {
    const navigate = useNavigate();
    const location = useLocation().pathname;

    const handleLogin = (event: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get("name")?.toString();
        const password = data.get("password")?.toString();
        if (username != null && password != null) {
            doLogin(navigate, location, username, password)
        }
    };
    useEffect(() => {
        doLogin(navigate, location, "testadmin", "pass")
    }, []);
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
                <img src={logo} alt="logo" width="200" style={{ padding: 10 }} />
                <Typography component="h1" variant="h3" style={{ paddingTop: 30, paddingBottom: 30 }}>
                    Voice From Fire
                </Typography>
                <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="User name"
                        name="name"
                        autoFocus
                        variant="standard"
                        defaultValue="testadmin"
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
                        defaultValue="pass"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Create new account
                    </Button>
                </Box>
            </Box>
        </Container>


    </Box>)
}