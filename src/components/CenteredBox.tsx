import Box from "@mui/material/Box";
import { FC, ReactNode } from "react";

const CenteredBox: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      {children}
    </Box>
  );
};

export default CenteredBox;
