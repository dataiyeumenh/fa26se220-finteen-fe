import {
  Navigate,
  Outlet,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useWorkspace } from "./useWorkspace";
import { canAccessChapter } from "./model";
import WorkspaceLayout from "./WorkspaceLayout";
import { Empty } from "./ui";
import { auth } from "../../api/auth.api";
import { useKidPlayState } from "../../pages/Kid/Dashboard/hooks/useKidPlayState.js";
import { canPlayJourneyChapter, resumeJourneyChapter } from "../../pages/Kid/Dashboard/api/kidJourneyProgress.js";

export function RequireAccount({ kind, roles, plans }) {
  const { actor, loading, authError } = useWorkspace();
  if (loading) return <Empty>Đang kiểm tra phiên đăng nhập…</Empty>;
  if (authError && auth.hasSession())
    return (
      <Empty>
        {authError}{" "}
        <button onClick={() => void auth.refresh().catch(() => {})}>
          Thử lại
        </button>{" "}
        <button onClick={() => auth.logout()}>Đăng nhập lại</button>
      </Empty>
    );
  if (!actor) return <Navigate to="/login" replace />;
  const home = actor.role === "kid" ? "/dashboard/kid" : "/dashboard";
  if (kind && actor.kind !== kind) return <Navigate to={home} replace />;
  if (roles && !roles.includes(actor.role)) {
    return (
      <Navigate
        to={actor.role === "guest" ? "/dashboard/plans" : home}
        replace
      />
    );
  }
  if (plans && !plans.includes(actor.plan))
    return <Navigate to={home} replace />;
  return <Outlet />;
}

export function Shell() {
  return (
    <WorkspaceLayout>
      <Outlet />
    </WorkspaceLayout>
  );
}

export function AccountHome() {
  const { actor } = useWorkspace();
  return (
    <Navigate
      to={
        !actor
          ? "/login"
          : actor.role === "kid"
            ? "/dashboard/kid"
            : "/dashboard"
      }
      replace
    />
  );
}

// Hỗ trợ link bản đồ cũ, bao gồm nút thoát nằm trong player hiện tại.
export function LessonsEntry() {
  const { actor } = useWorkspace();
  const destination =
    actor?.role === "kid"
      ? "/dashboard/kid/lessons"
      : actor?.role === "guest"
        ? "/dashboard/demo"
        : "/dashboard";
  return <Navigate to={destination} replace />;
}

export function LegacyGameEntry() {
  const { actor } = useWorkspace();
  const { search } = useLocation();
  const destination =
    actor?.role === "kid"
      ? `/dashboard/kid/play${search}`
      : actor?.role === "guest"
        ? `/dashboard/demo/play${search}`
        : "/dashboard";
  return <Navigate to={destination} replace />;
}

export function ChapterGuard({ children }) {
  const { actor } = useWorkspace();
  const [params] = useSearchParams();
  const resume = actor?.role === "kid" && !params.get("chapter");
  const chapter = Number(params.get("chapter") || 1);
  const entitled = canAccessChapter(actor, chapter);
  const progress = useKidPlayState({ enabled: actor?.role === "kid" && entitled, refreshKey: resume ? "resume" : chapter });
  if (!entitled) {
    return (
      <Navigate
        to={
          actor?.role === "kid" ? "/dashboard/kid/lessons" : "/dashboard/plans"
        }
        replace
      />
    );
  }
  if (actor.role === "kid") {
    if (progress.loading) return <Empty><p role="status">Đang kiểm tra tiến trình học…</p></Empty>;
    if (progress.error) return <Empty>
      <p role="alert">{progress.error}</p>
      <button className="ws-btn" onClick={progress.retry}>Thử lại</button>
    </Empty>;
    if (resume) {
      const next = resumeJourneyChapter(progress.state);
      if (next === null) return <Navigate to="/dashboard/kid/lessons" replace />;
      const search = new URLSearchParams(params);
      search.set("chapter", String(next));
      return <Navigate to={`/dashboard/kid/play?${search}`} replace />;
    }
    if (!canPlayJourneyChapter(progress.state, chapter)) return <Navigate to="/dashboard/kid/lessons" replace />;
  }
  return children;
}

export function NotFound() {
  return (
    <WorkspaceLayout>
      <Empty>
        Trang này chưa có trong luồng hiện tại. Hãy chọn một mục trên thanh điều
        hướng.
      </Empty>
    </WorkspaceLayout>
  );
}
