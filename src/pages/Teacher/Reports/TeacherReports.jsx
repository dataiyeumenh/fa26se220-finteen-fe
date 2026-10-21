import { useSearchParams } from "react-router-dom";
import TeacherReportsContent from "./components/TeacherReportsContent";
import useTeacherReports from "./hooks/useTeacherReports";

export default function TeacherReports() {
  const [searchParams] = useSearchParams();
  const reportState = useTeacherReports({
    requestedGroupId: searchParams.get("group") || "",
  });
  return <TeacherReportsContent reportState={reportState} />;
}
