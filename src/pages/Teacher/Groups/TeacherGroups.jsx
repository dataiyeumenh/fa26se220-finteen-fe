import TeacherGroupsContent from "./components/TeacherGroupsContent";
import useTeacherGroups from "./hooks/useTeacherGroups";
import { useSearchParams } from "react-router-dom";

export default function TeacherGroups({ groupsOnly = true }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const learnerState = useTeacherGroups({
    requestedGroupId: searchParams.get("group") || "",
  });
  return (
    <TeacherGroupsContent learnerState={{
      ...learnerState,
      selectGroup: (groupId) => {
        setSearchParams((current) => {
          const next = new URLSearchParams(current);
          next.set("group", groupId);
          return next;
        });
        return learnerState.selectGroup(groupId);
      },
    }} groupsOnly={groupsOnly} />
  );
}
