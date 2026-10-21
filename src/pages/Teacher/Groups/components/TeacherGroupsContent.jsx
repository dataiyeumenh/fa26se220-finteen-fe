import { Plus, RefreshCw, ShieldCheck, Users, XCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ActionForm,
  Empty,
  Heading,
  Modal,
} from "../../../../features/workspace/ui";

export default function TeacherGroupsContent({ learnerState, groupsOnly }) {
  const {
    group,
    groups,
    active,
    available,
    loading,
    message,
    error,
    refresh,
    actions,
  } = learnerState;
  const [modal, setModal] = useState(null);
  const finish = (promise) =>
    promise.then((result) => {
      setModal(null);
      return result;
    });
  if (loading) return <Empty>Đang tải lớp học…</Empty>;
  if (!group)
    return (
      <>
        <Heading
          title="Lớp học của bạn"
          description="Bạn chưa có lớp đang mở."
        />
        {error && (
          <p className="ws-notice" role="alert">
            {error}
          </p>
        )}
        <button
          className="ws-btn primary"
          onClick={() => setModal({ type: "group" })}
        >
          <Plus size={17} /> Tạo lớp học
        </button>
        {modal && (
          <Modal
            title="Tạo lớp học"
            description="Lớp có tối đa 40 học sinh."
            onClose={() => setModal(null)}
          >
            <ActionForm
              submit="Tạo lớp"
              onSubmit={(form) => finish(actions.openGroup(form.get("name")))}
            >
              <label>
                Tên lớp
                <input name="name" required maxLength={80} />
              </label>
            </ActionForm>
          </Modal>
        )}
      </>
    );
  if (!groupsOnly) return <TeacherLearnerList learnerState={learnerState} />;
  const closed = groups.filter((item) => item.closedAt);
  return (
    <>
      <Heading
        title="Quản lý lớp học"
        description={`${group.name} · ${active.length}/${group.slotLimit} học sinh.`}
      >
        <button className="ws-btn" onClick={() => void refresh()}>
          <RefreshCw size={16} /> Làm mới
        </button>
      </Heading>
      {(error || message) && (
        <div className={`ws-toast ${error ? "error" : "success"}`}>
          {error || message}
        </div>
      )}
      <section className="ws-card">
        <Users />
        <h2>{group.name}</h2>
        <p>
          {group.consentConfirmed
            ? "Đã xác nhận đồng ý của phụ huynh."
            : "Chưa xác nhận đồng ý của phụ huynh."}
        </p>
        <p>
          {available} chỗ trống trên tổng số {group.slotLimit}.
        </p>
        <label className="ws-post-test-toggle">
          <input
            type="checkbox"
            checked={Boolean(group.postTestEnabled)}
            onChange={(event) =>
              void actions.setPostTest(event.target.checked).catch(() => {})
            }
          />
          <span>
            <strong>Kiểm tra hậu trắc</strong>
            <small>Tự mở hậu trắc sau khi học sinh hoàn thành chương.</small>
          </span>
        </label>
        <div className="ws-actions">
          {!group.consentConfirmed && (
            <button
              className="ws-btn primary"
              onClick={() => setModal({ type: "consent" })}
            >
              <ShieldCheck size={16} /> Xác nhận đồng ý
            </button>
          )}
          <Link className="ws-btn" to="/dashboard/learners">
            Quản lý học sinh
          </Link>
          <Link className="ws-btn" to="/dashboard/quiz-management">
            Quản lý Quiz
          </Link>
          <button
            className="ws-btn danger"
            onClick={() => setModal({ type: "close" })}
          >
            <XCircle size={16} /> Kết thúc lớp
          </button>
        </div>
      </section>
      {closed.length > 0 && (
        <section className="ws-card">
          <h2>Lớp đã kết thúc</h2>
          {closed.map((item) => (
            <div className="ws-list-row" key={item.id}>
              <strong>{item.name}</strong>
              <Link
                className="ws-btn"
                to={`/dashboard/reports?group=${item.id}`}
              >
                Xem báo cáo
              </Link>
            </div>
          ))}
        </section>
      )}
      {modal && (
        <Modal
          title={
            modal.type === "consent" ? "Xác nhận sự đồng ý" : "Kết thúc lớp"
          }
          onClose={() => setModal(null)}
        >
          <ActionForm
            submit="Xác nhận"
            onSubmit={() =>
              finish(
                modal.type === "consent"
                  ? actions.confirmConsent()
                  : actions.closeGroup(),
              )
            }
          >
            {modal.type === "close" && (
              <label>
                Nhập DONG để xác nhận
                <input name="confirm" pattern="DONG" required />
              </label>
            )}
          </ActionForm>
        </Modal>
      )}
    </>
  );
}

function TeacherLearnerList({ learnerState }) {
  const {
    group,
    active,
    inactive,
    available,
    error,
    message,
    refresh,
    actions,
  } = learnerState;
  const [modal, setModal] = useState(null);
  const [tab, setTab] = useState("ACTIVE");
  const rows = tab === "ACTIVE" ? active : inactive;
  const finish = (promise) =>
    promise.then((result) => {
      setModal(null);
      return result;
    });
  return (
    <>
      <Heading
        title="Học sinh và hồ sơ đăng nhập"
        description={`${active.length}/${group.slotLimit} đang hoạt động · ${available} chỗ trống.`}
      >
        <button className="ws-btn" onClick={() => void refresh()}>
          <RefreshCw size={16} /> Làm mới
        </button>
      </Heading>
      {(error || message) && (
        <div className={`ws-toast ${error ? "error" : "success"}`}>
          {error || message}
        </div>
      )}
      <div className="ws-toolbar">
        <div className="ws-tabs">
          <button
            className={tab === "ACTIVE" ? "active" : ""}
            onClick={() => setTab("ACTIVE")}
          >
            Đang hoạt động ({active.length})
          </button>
          <button
            className={tab === "INACTIVE" ? "active" : ""}
            onClick={() => setTab("INACTIVE")}
          >
            Đã thu hồi ({inactive.length})
          </button>
        </div>
        {available > 0 && (
          <button
            className="ws-btn primary"
            disabled={!group.consentConfirmed}
            onClick={() => setModal({ type: "create" })}
          >
            <Plus size={16} /> Tạo học sinh
          </button>
        )}
      </div>
      {rows.length ? (
        <div className="ws-grid three">
          {rows.map((slot) => (
            <article className="ws-card ws-slot" key={slot.id}>
              <Users />
              <h2>{slot.displayName || "Đã xóa dữ liệu"}</h2>
              <code>{slot.code || "—"}</code>
              <div className="ws-actions">
                <Link className="ws-btn" to={`/dashboard/learners/${slot.id}`}>
                  Xem tiến độ
                </Link>
                {slot.status === "ACTIVE" && (
                  <button
                    className="ws-btn warning"
                    onClick={() => setModal({ type: "return", slot })}
                  >
                    Thu hồi
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty>Chưa có học sinh.</Empty>
      )}
      {modal && (
        <Modal
          title={
            modal.type === "create" ? "Tạo hồ sơ học sinh" : "Thu hồi học sinh"
          }
          onClose={() => setModal(null)}
        >
          <ActionForm
            submit="Xác nhận"
            onSubmit={(form) =>
              finish(
                modal.type === "create"
                  ? actions.openSlot({
                      displayName: form.get("name"),
                      pin: form.get("pin"),
                    })
                  : actions.returnSlot(modal.slot.id),
              )
            }
          >
            {modal.type === "create" && (
              <>
                <label>
                  Tên học sinh
                  <input name="name" required />
                </label>
                <label>
                  PIN 6 chữ số
                  <input
                    name="pin"
                    type="password"
                    pattern="[0-9]{6}"
                    required
                  />
                </label>
              </>
            )}
          </ActionForm>
        </Modal>
      )}
    </>
  );
}
