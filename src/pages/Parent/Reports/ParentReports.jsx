import { useSearchParams } from "react-router-dom";
import ParentReportsContent from "./components/ParentReportsContent";
import useParentReports from "./hooks/useParentReports";

export default function ParentReports() {
  const [searchParams] = useSearchParams();
  const reportState = useParentReports({
    requestedGroupId: searchParams.get("group") || "",
  });
  return <ParentReportsContent reportState={reportState} />;
}
