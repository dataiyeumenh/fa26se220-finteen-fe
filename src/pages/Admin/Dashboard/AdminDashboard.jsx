import AdminDashboardContent from "./components/AdminDashboardContent";
import useAdminDashboard from "./hooks/useAdminDashboard";
import { PageLoader } from "@/components/feedback/LoadingState";

export default function AdminDashboard() {
  const { actor, loading, error } = useAdminDashboard();

  if (loading) {
    return <PageLoader label="Đang tải trang quản trị…" />;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return <AdminDashboardContent actor={actor} />;
}
