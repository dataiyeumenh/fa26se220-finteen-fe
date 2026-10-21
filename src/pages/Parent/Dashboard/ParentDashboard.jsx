import { useWorkspace } from "../../../features/workspace/useWorkspace";
import ParentDashboardContent from "./components/ParentDashboardContent";
import useParentDashboard from "./hooks/useParentDashboard";

export default function ParentDashboard() {
  const { actor } = useWorkspace();
  const dashboardState = useParentDashboard();
  return (
    <ParentDashboardContent actor={actor} dashboardState={dashboardState} />
  );
}
