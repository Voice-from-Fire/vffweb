import { Box, Typography } from "@mui/material";

const color: { [key: string]: string } = {
  ok: "#98FB98", // pastel green
  invalid: "#FFB6C1", // pastel red
  skip: "#FFFFE0", // pastel yellow
};

const LabelCounts = ({
  statusCounts,
}: {
  statusCounts: { [key: string]: number };
}) => {
  return (
    <Box display="flex" gap={2} mb={2}>
      {["ok", "invalid", "skip"].map((status) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 1,
          }}
          key={status}
        >
          <Typography variant="body2" textTransform={"capitalize"}>
            {status}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
              color: "#000",
              fontWeight: "bold",
              border: "2px solid #000",
              bgcolor: color[status],
            }}
          >
            {statusCounts[status]}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default LabelCounts;
