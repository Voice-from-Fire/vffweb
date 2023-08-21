import { Box, Button, ButtonProps, CircularProgress } from "@mui/material";
import { green } from "@mui/material/colors";

export function SuccessButton(
  props: {
    children: React.ReactNode;
    success?: boolean;
    loading: boolean;
    handleButtonClick?: () => void;
  } & ButtonProps
) {
  const buttonSx = {
    ...(props.success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };

  return (
    <Box sx={{ mv: 1, position: "relative" }}>
      <Button
        {...props}
        variant="contained"
        sx={buttonSx}
        disabled={props.loading}
        onClick={props.handleButtonClick}
      >
        {props.success ? "Success!" : props.children}
      </Button>
      {props.loading && (
        <CircularProgress
          size={24}
          sx={{
            color: green[500],
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-12px",
            marginLeft: "-12px",
          }}
        />
      )}
    </Box>
  );
}
