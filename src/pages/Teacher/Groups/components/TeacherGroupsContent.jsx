import { Copy, KeyRound, Plus, RefreshCw, ShieldCheck, Trash2, Users, XCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SlotPersonalization } from "../../../../features/personalization/SlotPersonalization.jsx";
import {
  ActionForm,
  Empty,
  Heading,
  Modal,
} from "../../../../features/workspace/ui";
import { ContentSkeleton } from "@/components/feedback/LoadingState";

export default function TeacherGroupsContent({ learnerState, groupsOnly }) {
  const {
    group,
    groups,
    slots,
    available,
    quotaFree,
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
  if (loading) return <ContentSkeleton variant="cards" cards={3} label="Đang tải lớp học…" />;
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
          disabled={available < 5}
          onClick={() => setModal({ type: "group" })}
        >
          <Plus size={17} /> Tạo lớp học
        </button>
        {available < 5 && (
          <p className="ws-notice" role="status">
            Ví cần ít nhất 5 slot trống để tạo lớp. Hãy mua thêm slot trước khi tiếp tục.
          </p>
        )}
        {modal && (
          <Modal
            title="Tạo lớp học"
            description={`Chọn sĩ số dự kiến từ 5 đến ${available} học sinh theo số slot còn trống trong ví.`}
            onClose={() => setModal(null)}
          >
            <ActionForm
              submit="Tạo lớp"
              onSubmit={(form) => finish(actions.openGroup(form.get("name"), form.get("plannedSize")))}
            >
              <label>
                Tên lớp
                <input name="name" required maxLength={80} />
              </label>
              <label>
                Sĩ số
                <input
                  name="plannedSize"
                  type="number"
                  min="5"
                  max={available}
                  defaultValue={Math.min(40, available)}
                  required
                />
                <small>Còn {available} slot trong ví giáo viên.</small>
              </label>
            </ActionForm>
          </Modal>
        )}
      </>
    );
  if (!groupsOnly) return <TeacherLearnerList learnerState={learnerState} />;
  const targetGroup = modal?.group || group;
  const createdSlotCount = Math.max(
    Number(targetGroup.slotUsed) || 0,
    targetGroup.id === group.id ? slots.length : 0,
  );
  return (
    <>
      <Heading
        title="Quản lý lớp học"
        description={`${groups.length} lớp học · ${groups.filter((item) => !item.closedAt).length} đang mở · ${groups.filter((item) => item.closedAt).length} đã kết thúc.`}
      >
        <div className="ws-actions teacher-groups-heading-actions">
          <button
            className="ws-btn primary"
            disabled={quotaFree < 5}
            onClick={() => setModal({ type: "group" })}
          >
            <Plus size={16} /> Tạo lớp mới
          </button>
          <button className="ws-btn" onClick={() => void refresh()}>
            <RefreshCw size={16} /> Làm mới
          </button>
        </div>
      </Heading>
      {(error || message) && (
        <div className={`ws-toast ${error ? "error" : "success"}`}>
          {error || message}
        </div>
      )}
      <div className="teacher-class-list">
        {groups.map((item) => (
          <article className={`ws-card teacher-class-card${item.closedAt ? " is-closed" : ""}`} key={item.id}>
            <div className="teacher-class-card-heading">
              <div className="teacher-class-card-identity">
                <span className="teacher-class-card-icon"><Users size={22} aria-hidden="true" /></span>
                <div><h2>{item.name}</h2><p>{item.slotLimit} slot{item.slotUsed != null ? ` · ${item.slotUsed} slot đã sử dụng` : ""}</p></div>
              </div>
              <span className={`teacher-class-status ${item.closedAt ? "is-closed" : "is-open"}`}>
                {item.closedAt ? <XCircle size={16} aria-hidden="true" /> : <ShieldCheck size={16} aria-hidden="true" />}
                {item.closedAt ? "Đã kết thúc" : "Đang mở"}
              </span>
            </div>
            <p className="teacher-class-card-description">{item.closedAt
              ? "Lớp đã kết thúc. Bạn vẫn có thể xem học sinh và báo cáo của lớp."
              : item.consentConfirmed ? "Đã xác nhận sự đồng ý của phụ huynh." : "Chưa xác nhận sự đồng ý của phụ huynh."}</p>
            <div className="ws-actions">
              <Link className="ws-btn" to={`/dashboard/learners?group=${encodeURIComponent(item.id)}`}>{item.closedAt ? "Xem học sinh" : "Quản lý học sinh"}</Link>
              <Link className="ws-btn" to={`/dashboard/reports?group=${encodeURIComponent(item.id)}`}>Xem báo cáo</Link>
              {!item.closedAt && <>
                <Link className="ws-btn" to={`/dashboard/quiz-management?group=${encodeURIComponent(item.id)}`}>Quản lý Quiz</Link>
                {!item.consentConfirmed && <button className="ws-btn" onClick={() => setModal({ type: "consent", group: item })}><ShieldCheck size={16} /> Xác nhận đồng ý</button>}
                <button className="ws-btn" onClick={() => setModal({ type: "size", group: item })}>Sửa sĩ số</button>
                <button className="ws-btn danger" onClick={() => setModal({ type: "close", group: item })}><XCircle size={16} /> Kết thúc lớp</button>
              </>}
            </div>
          </article>
        ))}
      </div>
      {modal && (
        <Modal
          title={
            modal.type === "group"
              ? "Tạo lớp học"
              : modal.type === "size"
                ? "Sửa sĩ số lớp"
                : modal.type === "consent"
                  ? "Xác nhận sự đồng ý"
                  : "Kết thúc lớp"
          }
          description={modal.type === "group" ? `Ví còn ${quotaFree} slot; mỗi lớp cần ít nhất 5.` : `Lớp: ${targetGroup.name}`}
          onClose={() => setModal(null)}
        >
          <ActionForm
            submit={modal.type === "group" ? "Tạo lớp" : "Xác nhận"}
            onSubmit={(form) => finish(
              modal.type === "group"
                ? actions.openGroup(form.get("name"), form.get("plannedSize"))
                : modal.type === "size"
                  ? actions.updatePlannedSize(form.get("plannedSize"), targetGroup.id)
                  : modal.type === "consent"
                    ? actions.confirmConsent(targetGroup.id)
                    : actions.closeGroup(targetGroup.id),
            )}
          >
            {modal.type === "group" && (
              <>
                <label>
                  Tên lớp
                  <input name="name" required maxLength={80} />
                </label>
                <label>
                  Sĩ số
                  <input name="plannedSize" type="number" min="5" max={quotaFree} defaultValue={Math.min(40, quotaFree)} required />
                </label>
              </>
            )}
            {modal.type === "size" && (
              <label>
                Sĩ số mới
                <input
                  name="plannedSize"
                  type="number"
                  min={Math.max(5, createdSlotCount)}
                  max={Number(targetGroup.slotLimit) + quotaFree}
                  defaultValue={targetGroup.slotLimit}
                  required
                />
              </label>
            )}
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

function ClassSelect({ groups, group, selectGroup }) {
  return <label>
    <span className="sr-only">Chọn lớp đang quản lý</span>
    <select className="ws-btn" value={group.id} onChange={(event) => void selectGroup(event.target.value)}>
      {groups.map((item) => <option value={item.id} key={item.id}>{item.name}{item.closedAt ? " (đã kết thúc)" : ""}</option>)}
    </select>
  </label>;
}

function TeacherLearnerList({ learnerState }) {
  const {
    group,
    groups,
    selectGroup,
    active,
    inactive,
    available,
    error,
    message,
    refresh,
    actions,
    setMessage,
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
        description={`${group.name} · ${active.length}/${group.slotLimit} đang hoạt động · ${available ?? "Chưa xác định số"} slot trống trong lớp.`}
      >
        <div className="ws-actions teacher-learners-heading-actions">
          <ClassSelect groups={groups} group={group} selectGroup={selectGroup} />
          <button className="ws-btn" onClick={() => void refresh()}>
            <RefreshCw size={16} /> Làm mới
          </button>
        </div>
      </Heading>
      {group.closedAt && <p className="ws-notice">Lớp đã kết thúc. Danh sách dưới đây được giữ để tra cứu; không thể tạo hoặc sửa hồ sơ trong lớp này.</p>}
      {(error || message) && (
        <div className={`ws-toast ${error ? "error" : "success"}`}>
          {error || message}
        </div>
      )}
      <div className="ws-toolbar ws-teacher-learners-toolbar">
        <div className="ws-tabs ws-teacher-learners-tabs">
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
        <button
          className="ws-btn primary"
          disabled={group.closedAt || available == null || available === 0}
          aria-describedby={available === 0 ? "teacher-capacity-notice" : undefined}
          onClick={() => setModal({ type: "create" })}
        >
          <Plus size={16} /> Tạo học sinh
        </button>
      </div>
      {available === 0 && !group.closedAt && (
        <p className="ws-notice" id="teacher-capacity-notice" role="status">
          Lớp đã hết slot trống. Vào mục Nhóm học sinh để kiểm tra và tăng sĩ số nếu ví còn slot khả dụng.
        </p>
      )}
      {rows.length ? (
        <div className="ws-grid three">
          {rows.map((slot) => (
            <article
              className={`ws-card ws-slot ${slot.status === "ACTIVE" ? "" : "inactive"}`}
              key={slot.id}
            >
              <Users className="ws-slot-icon" />
              <h2>{slot.displayName || "Đã xóa dữ liệu"}</h2>
              {!group.closedAt && slot.status !== "WIPED" && <SlotPersonalization slot={slot} />}
              {slot.code && (
                <div className="ws-code">
                  <code>{slot.code}</code>
                  <button
                    aria-label="Sao chép mã"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(slot.code);
                        setMessage("Đã sao chép mã đăng nhập.");
                      } catch {
                        setMessage(`Mã đăng nhập: ${slot.code}`);
                      }
                    }}
                  >
                    <Copy size={17} />
                  </button>
                </div>
              )}
              <div className="ws-actions ws-learner-actions">
                <Link className="ws-btn" to={`/dashboard/learners/${slot.id}`}>
                  Xem tiến độ
                </Link>
                {!group.closedAt && slot.status === "ACTIVE" && (
                  <>
                    <button
                      className="ws-btn"
                      onClick={() => setModal({ type: "pin", slot })}
                    >
                      <KeyRound size={15} /> Sửa hồ sơ
                    </button>
                  </>
                )}{" "}
                {!group.closedAt && slot.status !== "WIPED" && (
                  <button
                    className="ws-btn danger"
                    onClick={() => setModal({ type: "wipe", slot })}
                  >
                    <Trash2 size={15} /> Xóa dữ liệu
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
            {
              create: "Tạo hồ sơ học sinh",
              pin: "Sửa tên và mã PIN",
              wipe: "Xóa dữ liệu học sinh",
            }[modal.type]
          }
          description={
            modal.type === "pin"
              ? `Đang cập nhật hồ sơ của ${modal.slot.displayName}. Để trống PIN nếu chỉ đổi tên.`
              : modal.type === "wipe"
              ? "Thao tác này xóa tên, PIN và cá nhân hóa. Kết quả học tập được giữ ẩn danh, nhưng slot đã xóa sẽ không được hoàn lại vào ví."
              : undefined
          }
          onClose={() => setModal(null)}
        >
          <ActionForm
            submit={modal.type === "wipe" ? "Xóa hồ sơ và mất 1 slot" : "Xác nhận"}
            onSubmit={(form) =>
              finish(
                modal.type === "create"
                  ? actions.openSlot({
                      displayName: form.get("name"),
                      pin: form.get("pin"),
                    })
                  : modal.type === "pin"
                    ? actions.changeSlotPin(modal.slot.id, form.get("name"), form.get("pin"))
                    : actions.wipeSlot(modal.slot.id),
              )
            }
          >
            {modal.type === "wipe" && (
              <p className="ws-notice danger" role="alert">
                Xóa là mất 1 slot vĩnh viễn, không trả lại ví. Không thể khôi phục tên, PIN hoặc cá nhân hóa.
              </p>
            )}
            {["create", "pin"].includes(modal.type) && (
                <label>
                  Tên học sinh
                  <input name="name" required maxLength={40} defaultValue={modal.slot?.displayName || ""} />
                </label>
            )}
            {["create", "pin"].includes(modal.type) && (
                <label>
                  PIN 6 chữ số
                  <input
                    name="pin"
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    minLength={6}
                    maxLength={6}
                    required={modal.type === "create"}
                  />
                </label>
            )}
            {modal.type === "wipe" && (
              <label>
                Nhập XOA để xác nhận xóa vĩnh viễn
                <input name="confirm" pattern="XOA" required />
              </label>
            )}
          </ActionForm>
        </Modal>
      )}
    </>
  );
}
