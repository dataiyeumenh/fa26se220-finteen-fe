import AdminDashboardContent from "./components/AdminDashboardContent";
import useAdminDashboard from "./hooks/useAdminDashboard";

export default function AdminDashboard() {
  const { actor, loading, error } = useAdminDashboard();

  if (loading) {
    return <p role="status">Đang tải trang quản trị...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return <AdminDashboardContent actor={actor} />;
}
