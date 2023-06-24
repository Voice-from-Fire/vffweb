import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { ReactNode, useState } from "react";
import { MainDrawer } from "./MainDrawer";
import { useNavigate } from "react-router";

export function LoggedScreenWrapper(props: {
  title: string;
  children: ReactNode;
  parentRoute?: string;
}) {
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <MainDrawer open={openDrawer} setOpen={setOpenDrawer} />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpenDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          {props.parentRoute && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="back"
              sx={{ mr: 2 }}
              onClick={() => navigate(props.parentRoute!)}
            >
              <ArrowBack></ArrowBack>
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {props.title}
          </Typography>
          {/*<Button color="inherit">Login</Button>*/}
        </Toolbar>
      </AppBar>
      <div style={{ textAlign: "center", paddingTop: 20 }}>
        {props.children}
      </div>
    </Box>
  );
}
