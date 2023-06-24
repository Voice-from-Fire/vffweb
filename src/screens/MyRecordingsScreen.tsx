import { useEffect, useState } from "react";
import { LoggedScreenWrapper } from "../components/LoggedScreenWrapper";
import { callGuard, createSamplesApi } from "../common/service";
import { Sample } from "../api/api";
import { LoadingWrapper } from "../components/LoadingWrapper";
import { RecordingsTable } from "../components/RecordingsTable";
import CenteredBox from "../components/CenteredBox";

async function downloadMySamples(setData: (d: Sample[]) => void) {
  const api = createSamplesApi();
  const data = await callGuard(async () => {
    const result = await api.getOwnSamplesSamplesGet();
    return result ? result.data : [];
  });
  setData(data ? data : []);
}

export function MyRecordingsScreen() {
  const [data, setData] = useState<Sample[] | null>(null);
  useEffect(() => {
    downloadMySamples(setData);
  }, []);

  return (
    <LoggedScreenWrapper title="My recordings">
      <LoadingWrapper loaded={data !== null}>
        <CenteredBox>
          <RecordingsTable data={data ? data : []} />
        </CenteredBox>
      </LoadingWrapper>
    </LoggedScreenWrapper>
  );
}
