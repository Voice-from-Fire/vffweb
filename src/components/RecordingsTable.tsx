import {
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Sample } from "../api/api";
import { QuickPlayer } from "./QuickPlayer";

function remove_subseconds(text: string): string {
  const p = text.indexOf(".");
  if (p === -1) {
    return text;
  }
  return text.slice(0, p);
}

export function RecordingsTable(props: { data: Sample[] }) {
  return props.data.length === 0 ? (
    <Typography>No recordings</Typography>
  ) : (
    <TableContainer>
      <Table sx={{ maxWidth: 400 }}>
        <TableHead>
          <TableRow>
            <TableCell align="right">Id</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((sample) => (
            <TableRow key={sample.id}>
              <TableCell align="right">
                <Link href="#">{sample.id}</Link>
              </TableCell>
              <TableCell>{remove_subseconds(sample.created_at!)}</TableCell>
              <TableCell>{sample.duration.toFixed(1)}s</TableCell>
              <TableCell>
                <QuickPlayer sample={sample} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
