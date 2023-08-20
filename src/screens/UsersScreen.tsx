import { useEffect, useState } from "react";
import { UserSummary } from "../api/api";
import { callGuard, createUsersApi } from "../common/service";
import { LoggedScreenWrapper } from "../components/LoggedScreenWrapper";
import { LoadingWrapper } from "../components/LoadingWrapper";
import { Link } from "react-router-dom";
import CenteredBox from "../components/CenteredBox";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

async function downloadUsers(setData: (d: UserSummary[]) => void) {
  const api = createUsersApi();
  const data = await callGuard(async () => {
    const result = await api.getAllUserSummariesUsersSummariesGet();
    return result ? result.data : [];
  });
  setData(data ? data : []);
}

type Row = {
  id: number;
  name: string;
  role: string;
  samples_count: number;
};

export function UsersScreen() {
  const [data, setData] = useState<UserSummary[] | null>(null);
  useEffect(() => {
    downloadUsers(setData);
  }, []);

  const small = window.innerWidth < 600;

  const columns: GridColDef<Row>[] = [
    {
      field: "id",
      headerName: "Id",
      width: 55,
      renderCell: (params) => (
        <Link to={params.value.toString()}>{params.value}</Link>
      ),
      hideSortIcons: small,
    },
    {
      field: "name",
      headerName: "Name",
      hideSortIcons: small,
    },
    {
      field: "role",
      headerName: "Role",
      hideSortIcons: small,
    },
    {
      field: "samples_count",
      headerName: small ? "#" : "# recordings",
      width: small ? 50 : 90,
      align: "right",
      headerAlign: "right",
      hideSortIcons: small,
    },
  ];

  const rows =
    data?.map((userSummary) => ({
      id: userSummary.user.id,
      name: userSummary.user.name,
      role: userSummary.user.role,
      samples_count: userSummary.samples_count,
    })) || [];

  return (
    <LoggedScreenWrapper title="Users">
      <LoadingWrapper loaded={data !== null}>
        <CenteredBox>
          <DataGrid rows={rows} columns={columns} autoHeight hideFooter />
        </CenteredBox>
      </LoadingWrapper>
    </LoggedScreenWrapper>
  );
}
