import { Box, LinearProgress } from "@mui/material";
import { ReactNode } from "react";

export function LoadingWrapper(props: { loaded: boolean, children: ReactNode }) {
    if (props.loaded) {
        return <>{props.children}</>
    } else {
        return (<Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            margin={2}
        >
            <LinearProgress style={{ width: 300 }} />
        </Box >)
    }
}