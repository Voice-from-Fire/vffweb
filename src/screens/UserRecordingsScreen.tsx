import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Sample } from "../api/api";
import { callGuard, createSamplesApi } from "../common/service";
import { LoadingWrapper } from "../components/LoadingWrapper";
import { LoggedScreenWrapper } from "../components/LoggedScreenWrapper";
import { RecordingsTable } from "../components/RecordingsTable";

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

export function UserRecordingsScreen() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<Sample[] | null>(null);

  useEffect(() => {
    if (userId === undefined || isNaN(parseInt(userId))) {
      navigate("/users");
    }

    downloadUserSamples(parseInt(userId!), setData);
  }, [userId]);

  return (
    <LoggedScreenWrapper title={"recordings of user #" + userId}>
      <LoadingWrapper loaded={data !== null}>
        <RecordingsTable data={data ? data : []} />
      </LoadingWrapper>
    </LoggedScreenWrapper>
  );
}
