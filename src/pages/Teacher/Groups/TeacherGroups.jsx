import TeacherGroupsContent from "./components/TeacherGroupsContent";
import useTeacherGroups from "./hooks/useTeacherGroups";
import { useSearchParams } from "react-router-dom";

export default function TeacherGroups({ groupsOnly = true }) {
  const [searchParams] = useSearchParams();
  const learnerState = useTeacherGroups({
    requestedGroupId: searchParams.get("group") || "",
  });
  return (
    <TeacherGroupsContent learnerState={learnerState} groupsOnly={groupsOnly} />
  );
}
