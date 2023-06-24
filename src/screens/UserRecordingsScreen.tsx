import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Role, Sample } from "../api/api";
import { callGuard, createSamplesApi, createUsersApi } from "../common/service";
import { LoadingWrapper } from "../components/LoadingWrapper";
import { LoggedScreenWrapper } from "../components/LoggedScreenWrapper";
import { RecordingsTable } from "../components/RecordingsTable";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CenteredBox from "../components/CenteredBox";

async function downloadUserSamples(
  userId: number,
  setData: (d: Sample[]) => void
) {
  const api = createSamplesApi();
  const data = await callGuard(async () => {
    const result = await api.getSamplesOfUserSamplesOwnerUserIdGet(userId);
    return result ? result.data : [];
  });
  setData(data ? data : []);
}

async function getUserRole(userId: number) {
  const api = createUsersApi();
  const data = await callGuard(async () => {
    // const result = await api.getUserRoleUserIdGet(userId);
    const results = await api.getAllUsersUsersGet();
    const user = results.data.find((user) => user.id === userId);
    return user?.role;
  });
  return data ?? undefined;
}

async function changeUserRole(userId: number, role: Role) {
  const api = createUsersApi();
  const data = await callGuard(async () => {
    await api.updateRoleUsersRoleUpdatePatch({ id: userId, role });
  });
  return data;
}

const userRoles = Object.values(Role);

export function UserRecordingsScreen() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<Sample[] | null>(null);
  const [role, setRole] = useState<Role | undefined>(undefined); // for user role

  useEffect(() => {
    if (userId === undefined || isNaN(parseInt(userId))) {
      navigate("/users");
    }

    const numericUserId = parseInt(userId!);

    downloadUserSamples(numericUserId, setData);
    getUserRole(numericUserId).then((role) =>
      role ? setRole(role as Role) : undefined
    );
  }, [userId]);

  const handleChange = (event: SelectChangeEvent<Role>) => {
    setRole(event.target.value as Role);
    changeUserRole(parseInt(userId!), event.target.value as Role);
  };

  return (
    <LoggedScreenWrapper
      title={"recordings of user #" + userId}
      parentRoute="/users"
    >
      <LoadingWrapper loaded={data !== null}>
        <CenteredBox>
          <Select
            value={role}
            onChange={handleChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            {userRoles.map((role, index) => (
              <MenuItem key={index} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
          <RecordingsTable data={data ? data : []} />
        </CenteredBox>
      </LoadingWrapper>
    </LoggedScreenWrapper>
  );
}
