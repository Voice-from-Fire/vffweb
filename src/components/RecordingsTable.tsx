import { Typography } from "@mui/material";
import { Sample } from "../api/api";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { LanguageDisplay } from "./LanguageDisplay";
import { QuickPlayer } from "./QuickPlayer";
import { Link } from "react-router-dom";

export function formatDate(text: string): string {
  const date = new Date(text);
  return format(date, "dd. MM. yyyy HH:mm");
}

type Row = {
  id: number;
  date: string;
  language: string;
  duration: string;
  audio: Sample;
};

export function RecordingsTable(props: { data: Sample[] }) {
  const columns: GridColDef<Row>[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      renderCell: (params) => (
        <Link to={`/recording/${params.value}`}>{params.value}</Link>
      ),
    },
    { field: "date", headerName: "Date", width: 150 },
    {
      field: "language",
      headerName: "Language",
      width: 90,
      renderCell: (params) => <LanguageDisplay language={params.value} />,
    },
    { field: "duration", headerName: "Duration", width: 90 },
    {
      field: "audio",
      headerName: "Play",
      width: 90,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => <QuickPlayer sample={params.value} />,
    },
  ];
  const rows: Row[] = props.data.map((sample) => ({
    id: sample.id,
    date: formatDate(sample.created_at!),
    language: sample.language,
    duration: `${sample.duration.toFixed(1)}s`,
    audio: sample,
  }));

  return props.data.length === 0 ? (
    <Typography>No recordings</Typography>
  ) : (
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{
        sorting: {
          sortModel: [{ field: "id", sort: "desc" }],
        },
      }}
      rowSelection={false}
    ></DataGrid>
  );
}
