import { Typography } from "@mui/material";
import { Sample } from "../api/api";
import { format } from "date-fns";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { LanguageDisplay } from "./LanguageDisplay";
import { QuickPlayer } from "./QuickPlayer";
import { Link } from "react-router-dom";

export function formatDate(text: string, small = false): string {
  const date = new Date(text);
  return format(date, small ? "dd.MM. HH:mm" : "dd. MM. yyyy HH:mm");
}

type Row = {
  id: number;
  date: string;
  language: string;
  duration: string;
  audio: Sample;
};

export function RecordingsTable(props: { data: Sample[] }) {
  const small = window.innerWidth < 600;
  const columns: GridColDef<Row>[] = [
    {
      field: "id",
      headerName: "ID",
      width: 55,
      renderCell: (params) => (
        <Link to={`/recording/${params.value}`}>{params.value}</Link>
      ),
      hideSortIcons: small,
    },
    {
      field: "date",
      headerName: "Date",
      width: small ? 100 : 150,
      hideSortIcons: small,
    },
    {
      field: "language",
      headerName: "Language",
      width: 90,
      renderCell: (params) => <LanguageDisplay language={params.value} />,
      hideSortIcons: small,
    },
    {
      field: "duration",
      headerName: "Duration",
      width: small ? 80 : 90,
      hideSortIcons: small,
    },
    {
      field: "audio",
      headerName: "Play",
      width: 60,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => <QuickPlayer sample={params.value} />,
    },
  ];
  const rows: Row[] = props.data.map((sample) => ({
    id: sample.id,
    date: formatDate(sample.created_at!, small),
    language: sample.language,
    duration: `${sample.duration.toFixed(1)} s`,
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
      style={{ overflowX: "auto" }}
    ></DataGrid>
  );
}
