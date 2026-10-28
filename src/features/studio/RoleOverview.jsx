import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { studioApi } from "./studioClient";
import { useStudioResource } from "./useStudioResource";
import { ROLE_LABELS, TURN_LABEL, statusLine, turnOf } from "./chapterWork";
import { Btn, PageHeader, StateBox } from "./ui";

// Mỗi vai: một câu nói vai làm gì, việc nào là "đến lượt mình", và nút dẫn tới đúng màn.
const work = {
  GAME_EDITOR: {
    about:
      "Bạn soạn chương, chơi thử, rồi gửi đi duyệt. Chương bị trả về sẽ quay lại đây kèm góp ý.",
    mine: [0],
    open: "Mở danh sách chương",
    path: "/internal/chapters",
    empty: "Không có chương nào đang chờ bạn soạn hay sửa",
    note: "Sau khi bạn gửi, người duyệt chơi thử và chấm. Chương đạt sẽ được người phát hành đưa vào game.",
  },
  GAME_REVIEWER: {
    about:
      "Bạn chơi thử chương người khác gửi lên, rồi chấm Đạt hoặc Trả về kèm góp ý.",
    mine: [1],
    open: "Mở danh sách chờ duyệt",
    path: "/internal/reviews",
    empty: "Không có chương nào đang chờ bạn duyệt",
    note: "Bạn không duyệt được chương do chính mình sửa. Kho ảnh và kho câu hỏi chỉ để tra cứu.",
  },
  GAME_MANAGER: {
    about:
      "Bạn đưa các chương đã duyệt vào game, chọn bản game đang dùng và thu hồi bản có lỗi.",
    mine: [2, 3],
    open: "Mở màn phát hành",
    path: "/internal/releases",
    empty: "Không có chương đã duyệt nào đang chờ phát hành",
    note: "Bạn không phát hành được bản có chương do chính mình sửa.",
  },
};
const steps = [
  ["Đang soạn", ["DRAFT", "REJECTED"]],
  ["Chờ duyệt", ["SUBMITTED"]],
  ["Đã duyệt, chờ phát hành", ["APPROVED"]],
  ["Đã phát hành", ["RELEASED"]],
];
const turnAction = {
  submit: "Soạn tiếp",
  fix: "Sửa theo góp ý",
  review: "Chơi thử và chấm",
  publish: "Phát hành",
};

export default function RoleOverview({ actor, name, roles }) {
  const [chosen, setChosen] = useState(roles[0]);
  const role = roles.includes(chosen) ? chosen : roles[0];
  const config = work[role] || work.GAME_EDITOR;
  const loader = useCallback(() => studioApi.get("/api/studio/chapters"), []);
  const query = useStudioResource(loader);
  const rows = query.data || [];
  // Xem theo đúng một vai: người nhiều vai chọn vai ở trên.
  const asRole = { ...actor, roles: [role] };
  const mine = rows.filter((draft) => turnOf(asRole, draft));
  const linkFor = (draft, turn) =>
    turn === "review"
      ? "/internal/reviews"
      : turn === "publish"
        ? "/internal/releases"
        : `/internal/editor/${encodeURIComponent(draft.code)}`;
  return (
    <div className={`studio-role-overview role-${role.toLowerCase()}`}>
      <PageHeader
        title={`Chào ${name.split("@")[0]}`}
        intro={config.about}
        actions={
          roles.length > 1 && (
            <label className="sp-overview-role">
              Xem việc của vai
              <select
                value={role}
                onChange={(event) => setChosen(event.target.value)}
              >
                {roles.map((value) => (
                  <option value={value} key={value}>
                    {ROLE_LABELS[value]}
                  </option>
                ))}
              </select>
            </label>
          )
        }
      />
      {query.loading ? (
        <StateBox kind="loading">Đang tải tình hình các chương…</StateBox>
      ) : query.error ? (
        <StateBox
          kind="error"
          title="Chưa tải được tình hình các chương"
          actions={<Btn onClick={query.reload}>Thử lại</Btn>}
        >
          {query.error}
        </StateBox>
      ) : (
        <>
          <ol className="sp-pipeline" aria-label="Các chương đang ở bước nào">
            {steps.map(([label, statuses], index) => {
              const count = rows.filter((draft) =>
                statuses.includes(draft.status),
              ).length;
              const rejected =
                index === 0
                  ? rows.filter((draft) => draft.status === "REJECTED").length
                  : 0;
              return (
                <li
                  key={label}
                  className={
                    config.mine.includes(index) ? "is-mine" : undefined
                  }
                >
                  <strong>{count}</strong>
                  <span>{label}</span>
                  {rejected > 0 && <small>{rejected} bị trả về</small>}
                </li>
              );
            })}
          </ol>
          <h2 className="sp-group-title">Đến lượt bạn</h2>
          {mine.length ? (
            <ul className="sp-todo">
              {mine.map((draft) => {
                const turn = turnOf(asRole, draft);
                return (
                  <li key={draft.code}>
                    <div>
                      <strong>
                        Chương {draft.chapterNumber ?? draft.code.slice(2)}:{" "}
                        {draft.title || draft.code}
                      </strong>
                      <span>
                        {TURN_LABEL[turn]}. {statusLine(draft)}
                      </span>
                    </div>
                    <Link
                      className={`sp-btn${turn === "fix" || turn === "review" ? " is-primary" : ""}`}
                      to={linkFor(draft, turn)}
                    >
                      {turnAction[turn]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <StateBox
              title={config.empty}
              actions={
                <Link className="sp-btn" to={config.path}>
                  {config.open}
                </Link>
              }
            />
          )}
          <p className="sp-role-note">{config.note}</p>
        </>
      )}
    </div>
  );
}
