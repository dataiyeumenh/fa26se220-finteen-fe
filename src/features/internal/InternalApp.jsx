import { Navigate, useLocation } from "react-router-dom";
import { useWorkspace } from "../workspace/useWorkspace";
import AdminDashboard from "../../pages/Admin/Dashboard/AdminDashboard";

import { hasInternalAccess } from "./access";
import "@/components/public/public.css";
import StudioWorkspace from "./StudioWorkspace";
import NotFoundPage from "@/pages/NotFoundPage";
import { PageLoader } from "@/components/feedback/LoadingState";

export default function InternalApp() {
  const { pathname } = useLocation();
  const { actor, loading } = useWorkspace();
  if (loading) return <PageLoader label="Đang kiểm tra quyền truy cập…" />;
  if (!actor) return <Navigate to="/internal/login" replace />;
  if (!hasInternalAccess(actor))
    return <Navigate to="/internal/login" replace />;
  if (!actor.roles.includes("ADMIN")) return <StudioWorkspace actor={actor} />;
  const knownStudioPath =
    pathname === "/internal" ||
    pathname === "/internal/" ||
    pathname === "/internal/admin" ||
    ["/internal/chapters", "/internal/reviews", "/internal/releases", "/internal/history", "/internal/assets", "/internal/questions"].includes(pathname) ||
    /^\/internal\/editor\/CH\d{2}$/.test(pathname);
  if (!knownStudioPath) return <NotFoundPage internal />;
  if (
    pathname !== "/internal" &&
    pathname !== "/internal/" &&
    pathname !== "/internal/admin"
  )
    return <StudioWorkspace actor={actor} />;
  return <AdminDashboard />;
}
