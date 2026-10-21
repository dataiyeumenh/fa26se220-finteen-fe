import TeacherGroupsContent from "./components/TeacherGroupsContent";
import useTeacherGroups from "./hooks/useTeacherGroups";

export default function TeacherGroups({ groupsOnly = true }) {
  const learnerState = useTeacherGroups();
  return (
    <TeacherGroupsContent learnerState={learnerState} groupsOnly={groupsOnly} />
  );
}
