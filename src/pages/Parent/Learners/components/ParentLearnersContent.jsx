import { BarChart3, Copy, KeyRound, Plus, RefreshCw, Trash2, Users } from "lucide-react";
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

const searchText = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/đ/g, "d")
  .replace(/Đ/g, "D")
  .toLowerCase();

export default function ParentLearnersContent({ learnerState }) {
  const {
    group,
    active,
    inactive,
    available,
    quota,
    loading,
    message,
    error,
    refresh,
    actions,
    setMessage,
  } = learnerState;
  const [modal, setModal] = useState(null);
  const [tab, setTab] = useState("ACTIVE");
  const [search, setSearch] = useState("");
  const rows = (tab === "ACTIVE" ? active : inactive).filter(
    (item) =>
      !search ||
      searchText(`${item.displayName || ""} ${item.code || ""}`)
        .includes(searchText(search)),
  );
  const finish = (promise) =>
    promise.then((result) => {
      setModal(null);
      return result;
    });
  if (loading) return <ContentSkeleton variant="cards" cards={3} label="Đang tải không gian gia đình…" />;
  if (!group)
    return (
      <>
        <Heading
          title="Không gian của các con"
          description="Bạn chưa có nhóm gia đình đang mở."
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
          <Plus size={17} /> Tạo không gian gia đình
        </button>
        {modal?.type === "group" && (
          <Modal
            title="Tạo không gian gia đình"
            description="Nhóm có tối đa 4 hồ sơ trẻ."
            onClose={() => setModal(null)}
          >
            <ActionForm
              submit="Tạo nhóm"
              onSubmit={(form) => finish(actions.openGroup(form.get("name")))}
            >
              <label>
                Tên nhóm
                <input name="name" required maxLength={80} />
              </label>
            </ActionForm>
          </Modal>
        )}
      </>
    );
  return (
    <>
      <Heading
        title="Không gian của các con"
        description={`${active.length} hồ sơ đang hoạt động · ${available == null ? "Chưa xác định số" : available} slot còn trống trong ví${quota?.limit != null ? ` ${quota.limit} slot` : ""}.`}
      >
        <button className="ws-btn" onClick={() => void refresh()}>
          <RefreshCw size={16} /> Làm mới
        </button>
      </Heading>
      {(error || message) && (
        <div
          className={`ws-toast ${error ? "error" : "success"}`}
          role={error ? "alert" : "status"}
        >
          {error || message}
        </div>
      )}
      <div className="ws-toolbar ws-parent-learners-toolbar">
        <label className="ws-learner-search">
          <span>Tìm hồ sơ</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tên hoặc mã đăng nhập"
          />
        </label>
        <div className="ws-tabs ws-slot-tabs">
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
            disabled={available === 0}
            aria-describedby={available === 0 ? "learner-capacity-notice" : undefined}
            onClick={() => setModal({ type: "create" })}
          >
            <Plus size={17} /> Tạo hồ sơ trẻ
          </button>
      </div>
      {available === 0 && (
        <p className="ws-notice" id="learner-capacity-notice" role="status">
          Ví slot đã hết chỗ trống. Hãy mua thêm slot để tiếp tục.
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
              {slot.status !== "WIPED" && <SlotPersonalization slot={slot} />}
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
                  <BarChart3 size={16} aria-hidden="true" /> Xem tiến độ
                </Link>
                {slot.status === "ACTIVE" && (
                  <>
                    <button
                      className="ws-btn"
                      onClick={() => setModal({ type: "pin", slot })}
                    >
                      <KeyRound size={16} aria-hidden="true" /> Sửa hồ sơ
                    </button>
                  </>
                )}{" "}
                {slot.status !== "WIPED" && (
                  <button
                    className="ws-btn danger"
                    onClick={() => setModal({ type: "wipe", slot })}
                  >
                    <Trash2 size={16} aria-hidden="true" /> Xóa dữ liệu
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty>Không có hồ sơ phù hợp.</Empty>
      )}
      {modal && modal.type !== "group" && (
        <Modal
          title={
            {
              create: "Tạo hồ sơ cho trẻ",
              pin: "Sửa tên và mã PIN",
              wipe: "Xóa dữ liệu",
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
            onSubmit={(form) => {
              if (modal.type === "create")
                return finish(
                  actions.openSlot({
                    displayName: form.get("name"),
                    pin: form.get("pin"),
                  }),
                );
              if (modal.type === "pin")
                return finish(
                  actions.changeSlotPin(modal.slot.id, form.get("name"), form.get("pin")),
                );
              return finish(actions.wipeSlot(modal.slot.id));
            }}
          >
            {modal.type === "wipe" && (
              <p className="ws-notice danger" role="alert">
                Xóa là mất 1 slot vĩnh viễn, không trả lại ví. Không thể khôi phục tên, PIN hoặc cá nhân hóa.
              </p>
            )}
            {["create", "pin"].includes(modal.type) && (
              <label>
                Tên trẻ
                <input name="name" required maxLength={40} defaultValue={modal.slot?.displayName || ""} />
              </label>
            )}
            {["create", "pin"].includes(modal.type) && (
              <label>
                Mã PIN 6 chữ số
                <input
                  name="pin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
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
