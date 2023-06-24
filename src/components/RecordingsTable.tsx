import {
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
import { LanguageDisplay } from "./LanguageDisplay";
import { format } from "date-fns";

function formatDate(text: string): string {
  const date = new Date(text);
  return format(date, "dd. MM. yyyy HH:mm");
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
            <TableCell>Language</TableCell>
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
              <TableCell>{formatDate(sample.created_at!)}</TableCell>
              <TableCell>
                <LanguageDisplay language={sample.language} />
              </TableCell>
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
