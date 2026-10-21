import { Copy, KeyRound, Plus, RefreshCw, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ActionForm,
  Empty,
  Heading,
  Modal,
} from "../../../../features/workspace/ui";

export default function ParentLearnersContent({ learnerState }) {
  const {
    group,
    active,
    inactive,
    available,
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
      `${item.displayName || ""} ${item.code || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const finish = (promise) =>
    promise.then((result) => {
      setModal(null);
      return result;
    });
  if (loading) return <Empty>Đang tải không gian gia đình…</Empty>;
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
        description={`${active.length}/${group.slotLimit} hồ sơ đang hoạt động · ${available} chỗ trống.`}
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
      <div className="ws-toolbar">
        <label>
          Tìm hồ sơ
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
        {available > 0 && (
          <button
            className="ws-btn primary"
            onClick={() => setModal({ type: "create" })}
          >
            <Plus size={17} /> Tạo hồ sơ trẻ
          </button>
        )}
      </div>
      {rows.length ? (
        <div className="ws-grid three">
          {rows.map((slot) => (
            <article
              className={`ws-card ws-slot ${slot.status === "ACTIVE" ? "" : "inactive"}`}
              key={slot.id}
            >
              <Users className="ws-slot-icon" />
              <h2>{slot.displayName || "Đã xóa dữ liệu"}</h2>
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
              <div className="ws-actions">
                <Link className="ws-btn" to={`/dashboard/learners/${slot.id}`}>
                  Xem tiến độ
                </Link>
                {slot.status === "ACTIVE" && (
                  <>
                    <button
                      className="ws-btn"
                      onClick={() => setModal({ type: "pin", slot })}
                    >
                      <KeyRound size={15} /> Đổi PIN
                    </button>
                    <button
                      className="ws-btn warning"
                      onClick={() => setModal({ type: "return", slot })}
                    >
                      Thu hồi
                    </button>
                  </>
                )}{" "}
                {slot.status !== "WIPED" && (
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
        <Empty>Không có hồ sơ phù hợp.</Empty>
      )}
      {modal && modal.type !== "group" && (
        <Modal
          title={
            {
              create: "Tạo hồ sơ cho trẻ",
              pin: "Đổi mã PIN",
              return: "Thu hồi hồ sơ",
              wipe: "Xóa dữ liệu",
            }[modal.type]
          }
          onClose={() => setModal(null)}
        >
          <ActionForm
            submit="Xác nhận"
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
                  actions.changeSlotPin(modal.slot.id, form.get("pin")),
                );
              if (modal.type === "return")
                return finish(actions.returnSlot(modal.slot.id));
              return finish(actions.wipeSlot(modal.slot.id));
            }}
          >
            {modal.type === "create" && (
              <label>
                Tên trẻ
                <input name="name" required maxLength={40} />
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
                  required
                />
              </label>
            )}
            {modal.type === "wipe" && (
              <label>
                Nhập XOA để xác nhận
                <input name="confirm" pattern="XOA" required />
              </label>
            )}
          </ActionForm>
        </Modal>
      )}
    </>
  );
}
