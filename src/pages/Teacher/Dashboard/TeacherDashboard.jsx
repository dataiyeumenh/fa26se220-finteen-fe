import { useWorkspace } from "../../../features/workspace/useWorkspace";
import TeacherDashboardContent from "./components/TeacherDashboardContent";
import useTeacherDashboard from "./hooks/useTeacherDashboard";

export default function TeacherDashboard() {
  const { actor } = useWorkspace();
  const dashboardState = useTeacherDashboard();
  return (
    <TeacherDashboardContent actor={actor} dashboardState={dashboardState} />
  );
}
