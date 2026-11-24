import { useCallback, useEffect, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  Users,
  Layers,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  Package,
  Gamepad2,
  MapPinned,
  Award,
  Play,
  AlertTriangle,
  Bell,
  ChevronDown,
  UserRound,
  CheckCircle2,
} from "lucide-react";
import { useWorkspace } from "./useWorkspace";
import { auth } from "../../api/auth.api";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/shared/Footer";
import ResponsiveSidebar from "@/components/shared/ResponsiveSidebar";
import "./workspace.css";
import "./workspace-header.css";
import "./workspace-visuals.css";
import "./role-theme.css";
import "./workspace-design-system.css";
import "./quiz.css";
import {
  currentEntitlements,
  formatPlanDate,
  PLAN_LIMIT,
  PLAN_NAME,
} from "./entitlements";
import { notificationTarget, notificationsApi } from "./api/notificationsApi.js";

const notificationTime = (value) => value
  ? new Date(value).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })
  : "";

export default function WorkspaceLayout({ children }) {
  const { actor, entitlements, entitlementsLoading, learnerDashboard } =
    useWorkspace();
  const navigate = useNavigate();
  const location = useLocation();
  const learner = actor?.role === "kid";
  const navigationPath = !learner && /^\/dashboard\/learners\/[^/]+\/?$/.test(location.pathname)
    ? "/dashboard/reports"
    : location.pathname.replace(/\/+$/, "") || "/";
  const familyChild = learner && (actor?.learnerRole === "child" || actor?.plan === "parent");
  const teacher = actor?.role === "teacher";
  const paid = actor?.role === "parent" || teacher;
  const dualContext =
    actor?.plans?.includes("parent") && actor?.plans?.includes("teacher");
  const activeEntitlements = currentEntitlements(actor, entitlements);
  // Gói FinTeen hiện được mua một lần và sử dụng vĩnh viễn, không cảnh báo gia hạn.
  const expiringEntitlements = [];
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  const notificationsEnabled = !learner && ["parent", "teacher"].includes(actor?.role);
  const refreshUnreadCount = useCallback(async () => {
    if (!notificationsEnabled) return;
    try {
      const result = await notificationsApi.unreadCount();
      setUnreadCount(Math.max(0, Number(result?.unreadCount) || 0));
    } catch {
      // Keep the last known badge during a transient polling failure.
    }
  }, [notificationsEnabled]);
  const loadNotifications = useCallback(async () => {
    if (!notificationsEnabled) return;
    setNotificationsLoading(true);
    setNotificationsError("");
    try {
      const result = await notificationsApi.list();
      setNotifications(Array.isArray(result?.items) ? result.items : []);
      setUnreadCount(Math.max(0, Number(result?.unreadCount) || 0));
    } catch (error) {
      setNotificationsError(error.message || "Không tải được thông báo.");
    } finally {
      setNotificationsLoading(false);
    }
  }, [notificationsEnabled]);
  useEffect(() => {
    if (learner) void auth.ensureLearnerDashboard().catch(() => {});
    else void auth.ensureEntitlements().catch(() => {});
  }, [learner]);
  useEffect(() => {
    if (!notificationsEnabled) return undefined;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUnreadCount();
    const poll = () => {
      if (document.visibilityState === "visible") void refreshUnreadCount();
    };
    const timer = window.setInterval(poll, 60_000);
    document.addEventListener("visibilitychange", poll);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", poll);
    };
  }, [notificationsEnabled, refreshUnreadCount]);
  const learnerType =
    actor?.learnerRole === "student" ? "Học sinh" : "Con trong gia đình";
  const learnerGroup = learnerDashboard?.learner?.groupName;
  const label = learner
    ? `${learnerType}${learnerGroup ? ` · ${learnerGroup}` : ""}`
    : teacher
      ? "Giáo viên"
      : paid
        ? "Phụ huynh"
        : "Khách · dùng thử";
  const links = learner
    ? [
        ["/dashboard/kid", "Trang chủ", Home],
        ["/dashboard/kid/lessons", "Hành trình", MapPinned],
        ["/dashboard/kid/games", "Trò chơi", Gamepad2],
        ["/dashboard/kid/quiz", familyChild ? "Hậu trắc" : "Quiz", ClipboardList],
        ["/dashboard/kid/achievements", "Thành tích", Award],
      ]
    : [
        ["/dashboard", "Tổng quan", Home],
        ["/dashboard/plans", "Gói học tập", Package],
        ...(actor?.role === "guest"
          ? [["/dashboard/demo", "Dùng thử chương 1", Play]]
          : []),
        ...(paid
          ? [
              [
                "/dashboard/learners",
                teacher ? "Học sinh" : "Các con",
                Users,
              ],
              ["/dashboard/reports", "Tiến độ & báo cáo", BarChart3],
              ...(!teacher ? [["/dashboard/quiz-management", "Quản lý Quiz", ClipboardList]] : []),
            ]
          : []),
        ...(teacher
          ? [
              ["/dashboard/groups", "Nhóm học sinh", Layers],
              ["/dashboard/quiz-management", "Quản lý Quiz", ClipboardList],
            ]
          : []),
        ["/dashboard/settings", "Tài khoản", Settings],
      ];
  const closeMenus = () => {
    setProfileOpen(false);
    setNotificationsOpen(false);
  };
  const openNotification = async (item) => {
    setNotificationsError("");
    if (!item.read) {
      try {
        const result = await notificationsApi.markRead(item.id);
        setNotifications((rows) => rows.map((row) => row.id === item.id
          ? { ...row, read: true, readAt: result?.readAt || row.readAt }
          : row));
        setUnreadCount((count) => Math.max(0, count - 1));
      } catch (error) {
        setNotificationsError(error.message || "Chưa đánh dấu được thông báo.");
        return;
      }
    }
    const target = notificationTarget(item.action);
    closeMenus();
    if (target) navigate(target);
  };
  const markAllNotificationsRead = async () => {
    setNotificationsError("");
    try {
      const result = await notificationsApi.markAllRead();
      const readAt = new Date().toISOString();
      setNotifications((rows) => rows.map((row) => row.read ? row : { ...row, read: true, readAt }));
      setUnreadCount(Math.max(0, Number(result?.unreadCount) || 0));
    } catch (error) {
      setNotificationsError(error.message || "Chưa đánh dấu được tất cả thông báo.");
    }
  };
  const pageTheme = navigationPath.includes("/plans")
    ? "packages"
    : navigationPath.includes("/learners")
      ? "children"
      : navigationPath.includes("/reports")
        ? "reports"
        : navigationPath.includes("/settings")
          ? "account"
          : navigationPath.includes("/groups")
            ? "groups"
            : navigationPath.includes("/quiz")
              ? "quiz"
              : navigationPath.includes("/games") ||
                  navigationPath.includes("/shop") ||
                  navigationPath.includes("/lessons")
                ? "learning"
                : "overview";
  return (
    <div
      className={`ws ${learner ? "ws-kid" : "ws-adult"}`}
      data-ws-role={actor?.role || "guest"}
      data-ws-learner-context={
        learner ? actor?.learnerRole || "child" : undefined
      }
      data-ws-page={pageTheme}
    >
      {!learner && (
        <ResponsiveSidebar className="ws-sidebar" scopeClass="ws ws-adult" title={teacher ? "Không gian giáo viên" : paid ? "Không gian phụ huynh" : "Không gian dùng thử"} role={actor?.role || "guest"}>
          <Link to="/" className="ws-brand">
            <img src="/brand/finteen-logo-v2.webp" alt="FinTeen" />
          </Link>
          {dualContext && (
            <div
              className="ws-context-switch"
              aria-label="Chuyển phạm vi sử dụng"
            >
              <span>Không gian làm việc</span>
              <div>
                <Button
                  type="button"
                  variant={actor.role === "parent" ? "default" : "ghost"}
                  size="sm"
                  className={
                    actor.role === "parent"
                      ? "ws-role-button active"
                      : "ws-role-button"
                  }
                  aria-pressed={actor.role === "parent"}
                  onClick={() => {
                    auth.setContext("parent");
                    navigate("/dashboard");
                  }}
                >
                  <UserRound /> Phụ huynh
                </Button>
                <Button
                  type="button"
                  variant={actor.role === "teacher" ? "default" : "ghost"}
                  size="sm"
                  className={
                    actor.role === "teacher"
                      ? "ws-role-button active"
                      : "ws-role-button"
                  }
                  aria-pressed={actor.role === "teacher"}
                  onClick={() => {
                    auth.setContext("teacher");
                    navigate("/dashboard");
                  }}
                >
                  <BookOpen /> Giáo viên
                </Button>
              </div>
            </div>
          )}
          <nav aria-label="Điều hướng dashboard">
            {links.map(([to, text, Icon]) => (
              <Link
                key={to}
                to={to}
                className={navigationPath === to ? "active" : undefined}
                aria-current={navigationPath === to ? "page" : undefined}
              >
                <Icon size={19} />
                {text}
              </Link>
            ))}
          </nav>
          <button
            className="ws-logout"
            onClick={async () => {
              await auth.signOut();
              navigate("/login");
            }}
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </ResponsiveSidebar>
      )}
      <div className="ws-main">
        <header className={learner ? "ws-top ft-learner-header" : "ws-top"}>
          {learner ? (
            <>
              <Link to="/dashboard/kid" className="ws-kid-brand">
                <img src="/brand/finteen-logo-v2.webp" alt="FinTeen" />
              </Link>
              <nav className="ft-learner-nav" aria-label="Điều hướng học tập">
                {links.map(([to, text, Icon]) => (
                  <NavLink end key={to} to={to}>
                    <Icon size={18} />
                    {text}
                  </NavLink>
                ))}
              </nav>
            </>
          ) : (
            <div className="ws-top-title">
              <strong>Không gian đồng hành</strong>
              <small>
                {teacher
                  ? "Quản lý lớp học và tiến độ học sinh"
                  : "Theo dõi hành trình học tập trong một nơi"}
              </small>
            </div>
          )}
          <div className="ws-top-actions">
            {notificationsEnabled && <div className="ws-header-menu">
              <button
                className="ws-notification-button"
                type="button"
                aria-label="Thông báo"
                aria-expanded={notificationsOpen}
                onClick={() => {
                  const opening = !notificationsOpen;
                  setNotificationsOpen(opening);
                  setProfileOpen(false);
                  if (opening) void loadNotifications();
                }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span>{unreadCount > 99 ? "99+" : unreadCount}</span>
                )}
              </button>
              {notificationsOpen && (
                <div className="ws-header-dropdown ws-notification-dropdown">
                  <div className="ws-dropdown-heading">
                    <strong>Thông báo</strong>
                    <div className="ws-notification-heading-actions">
                      <span>{unreadCount} mới</span>
                      {unreadCount > 0 && <button type="button" onClick={() => void markAllNotificationsRead()}>Đọc tất cả</button>}
                    </div>
                  </div>
                  {notificationsLoading ? (
                    <div className="ws-notification-state">Đang tải thông báo…</div>
                  ) : notificationsError ? (
                    <div className="ws-notification-state error"><span>{notificationsError}</span><button type="button" onClick={() => void loadNotifications()}>Thử lại</button></div>
                  ) : notifications.length ? (
                    notifications.map((item) => (
                      <button
                        type="button"
                        onClick={() => void openNotification(item)}
                        className={`ws-notification-item ${item.read ? "is-read" : "is-unread"}`}
                        key={item.id}
                      >
                        <span className="ws-notification-dot" aria-hidden="true" />
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.message}</p>
                          <small>{notificationTime(item.updatedAt || item.createdAt)}</small>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="ws-notification-empty">
                      <CheckCircle2 />
                      <strong>Bạn đã xem hết thông báo</strong>
                      <small>Hiện chưa có thông báo mới.</small>
                    </div>
                  )}
                </div>
              )}
            </div>}
            <div className="ws-header-menu">
              <button
                className="ws-profile-trigger"
                type="button"
                aria-expanded={profileOpen}
                onClick={() => {
                  setProfileOpen((value) => !value);
                  setNotificationsOpen(false);
                }}
              >
                <span className="ws-profile-avatar">
                  {String(actor?.name || "F")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </span>
                <span className="ws-profile-copy">
                  <strong>{actor?.name || "Tài khoản FinTeen"}</strong>
                  <small>{label}</small>
                </span>
                <ChevronDown
                  className={profileOpen ? "is-open" : ""}
                  size={18}
                />
              </button>
              {profileOpen && (
                <div className="ws-header-dropdown ws-profile-dropdown">
                  <div className="ws-profile-summary">
                    <span className="ws-profile-avatar large">
                      <UserRound size={21} />
                    </span>
                    <div>
                      <strong>{actor?.name || "Tài khoản FinTeen"}</strong>
                      <small>{label}</small>
                    </div>
                  </div>
                  {!learner && actor?.role !== "guest" && (
                    <div className="ws-dropdown-plans">
                      <div className="ws-dropdown-heading">
                        <strong>Gói đang sử dụng</strong>
                        <Package size={16} />
                      </div>
                      {entitlementsLoading && !entitlements ? (
                        <p>Đang tải thông tin gói…</p>
                      ) : activeEntitlements.length ? (
                        activeEntitlements.map((item) => (
                          <div className="ws-dropdown-plan" key={item.id}>
                            <div>
                              <strong>
                                {PLAN_NAME[item.kind] || item.kind}
                              </strong>
                              <span>Đang hoạt động</span>
                            </div>
                            <small>
                              Hạn mức {PLAN_LIMIT[item.kind] || "—"}
                            </small>
                            <small className="ws-lifetime-plan"><CheckCircle2 size={13} /> <b>Quyền sử dụng vĩnh viễn</b></small>
                          </div>
                        ))
                      ) : (
                        <p>Chưa có thông tin gói.</p>
                      )}
                    </div>
                  )}
                  <div className="ws-dropdown-links">
                    <Link to={learner ? "/dashboard/kid/personalization" : "/dashboard/settings"} onClick={closeMenus}>
                      <Settings size={17} /> {learner ? "Cá nhân hoá của em" : "Quản lý tài khoản"}
                    </Link>
                    {!learner && (
                      <Link to="/dashboard/plans" onClick={closeMenus}>
                        <Package size={17} /> Xem các gói học tập
                      </Link>
                    )}
                    <button
                      onClick={async () => {
                        await auth.signOut();
                        navigate("/login");
                      }}
                    >
                      <LogOut size={17} /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="ws-content">
          {expiringEntitlements.length > 0 && (
            <aside className="ws-expiry-alert" role="alert">
              <AlertTriangle />
              <div>
                <strong>Gói học tập sắp hết hạn</strong>
                {expiringEntitlements.map((item) => (
                  <p key={item.id}>
                    {PLAN_NAME[item.kind] || item.kind}{" "}
                    {item.daysLeft === 0
                      ? "hết hạn hôm nay"
                      : `còn ${item.daysLeft} ngày`}{" "}
                    (đến {formatPlanDate(item.expiresOn)}).{" "}
                    <Link to="/dashboard/plans">Gia hạn ngay</Link>
                  </p>
                ))}
              </div>
            </aside>
          )}
          {children}
        </main>
        {learner && <Footer />}
      </div>
      {learner && (
        <nav
          className="ws-kid-bottom-nav"
          aria-label="Điều hướng học tập trên điện thoại"
        >
          {links.map(([to, text, Icon]) => (
            <NavLink end key={to} to={to}>
              <Icon size={20} />
              <span>{text}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
