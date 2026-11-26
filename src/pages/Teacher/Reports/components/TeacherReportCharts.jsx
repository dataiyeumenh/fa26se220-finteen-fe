import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function SimpleTooltip({ active, payload, label, suffix = "em" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="class-report-chart-tooltip">
      <strong>{label}</strong>
      {payload.map((item) => (
        <span key={item.dataKey}>
          {item.name}: {item.value} {suffix}
        </span>
      ))}
    </div>
  );
}

function LearnerList({ title, learners = [] }) {
  return (
    <div className="class-report-rechart-detail">
      <strong>{title}</strong>
      {learners.length ? (
        <div>
          {learners.map((learner, index) =>
            learner?.slotId ? (
              <Link
                key={learner.slotId}
                to={`/dashboard/learners/${encodeURIComponent(learner.slotId)}`}
              >
                {learner.displayName || "Học sinh"}
              </Link>
            ) : (
              <span key={index}>{learner?.displayName || "Học sinh"}</span>
            ),
          )}
        </div>
      ) : (
        <p>Chưa có danh sách tên cho lựa chọn này.</p>
      )}
    </div>
  );
}

function ChartHelp({ children }) {
  return (
    <details className="class-report-chart-help">
      <summary aria-label="Xem giải thích biểu đồ">?</summary>
      <p>{children}</p>
    </details>
  );
}

export function CourseOverviewCharts({ report }) {
  const chapters = useMemo(() => report?.chapters || [], [report?.chapters]);
  const distribution = useMemo(
    () => report?.postTest?.distribution || [],
    [report?.postTest?.distribution],
  );
  const { topics, waitingTopics } = useMemo(() => {
    const allTopics = report?.topics || [];
    return {
      topics: allTopics
        .filter((topic) => topic.hasEnoughData)
        .slice()
        .sort(
          (left, right) =>
            (Number(left.correctRate) || 0) -
            (Number(right.correctRate) || 0),
        ),
      waitingTopics: allTopics.filter((topic) => !topic.hasEnoughData),
    };
  }, [report?.topics]);
  const chapterData = useMemo(
    () =>
      chapters.map((chapter) => ({
        ch: `CH${chapter.number}`,
        finished: Number(chapter.finished) || 0,
        submitted: Number(chapter.submitted) || 0,
      })),
    [chapters],
  );
  const average = report?.postTest?.average;
  return (
    <section className="class-report-course-charts">
      <article>
        <header>
          <h3>Mức độ làm đúng bài trắc nghiệm sau chương</h3>
          <p>
            Mỗi học sinh chỉ nằm trong một cột · Dựa trên{" "}
            {report?.postTest?.basedOn || 0} em đã nộp
            {average
              ? ` · Trung bình ${average.correct}/${average.total} câu`
              : ""}
          </p>
        </header>
        <div className="class-report-chart-axis-note">
          <span>Trục dọc: Số học sinh</span>
          <span>Trục ngang: Tỷ lệ câu làm đúng</span>
        </div>
        <div className="class-report-rechart-canvas">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={distribution}
              margin={{ top: 24, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="#e4e9e6" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#738078", fontSize: 10 }}
              />
              <YAxis
                width={30}
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#738078", fontSize: 10 }}
              />
              <Tooltip
                content={<SimpleTooltip suffix="em" />}
                cursor={{ fill: "var(--role-soft, #f2f5f3)" }}
              />
              <Bar
                dataKey="count"
                name="Học sinh"
                fill="var(--report-green, #246b4f)"
                radius={[3, 3, 0, 0]}
                maxBarSize={54}
              >
                <LabelList
                  dataKey="count"
                  position="top"
                  formatter={(value) => `${value} em`}
                  fill="#53645b"
                  fontSize={10}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
      <article>
        <header>
          <div className="class-report-chart-title">
            <h3>Hoàn thành theo chương</h3>
            <ChartHelp>
              Mỗi chương có hai cột. Khoảng cách giữa hai cột cho biết còn bao
              nhiêu em đã học xong nhưng chưa nộp bài.
            </ChartHelp>
          </div>
          <p>
            So sánh số em đã xong chương với số em đã nộp bài trắc nghiệm sau
            chương.
          </p>
        </header>
        <div className="class-report-chart-axis-note">
          <span>Trục dọc: Số học sinh</span>
          <span>Trục ngang: Từng chương</span>
        </div>
        <div className="class-report-rechart-canvas">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chapterData}
              margin={{ top: 22, right: 8, left: 0, bottom: 0 }}
              barGap={3}
            >
              <CartesianGrid vertical={false} stroke="#e4e9e6" />
              <XAxis
                dataKey="ch"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#738078", fontSize: 11 }}
              />
              <YAxis
                width={30}
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#738078", fontSize: 10 }}
              />
              <Tooltip
                content={<SimpleTooltip suffix="em" />}
                cursor={{ fill: "var(--role-soft, #f2f5f3)" }}
              />
              <Bar
                dataKey="finished"
                name="Xong chương"
                fill="var(--role-color, #7ea291)"
                radius={[3, 3, 0, 0]}
                maxBarSize={30}
              >
                <LabelList
                  dataKey="finished"
                  position="top"
                  formatter={(value) => `${value} em`}
                  fill="#6d7d75"
                  fontSize={9}
                />
              </Bar>
              <Bar
                dataKey="submitted"
                name="Đã nộp bài sau chương"
                fill="var(--report-green, #246b4f)"
                radius={[3, 3, 0, 0]}
                maxBarSize={30}
              >
                <LabelList
                  dataKey="submitted"
                  position="top"
                  formatter={(value) => `${value} em`}
                  fill="var(--report-green, #355d4d)"
                  fontSize={9}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="class-report-rechart-key">
          <span>
            <i style={{ background: "var(--role-color, #7ea291)" }} />
            Xong chương
          </span>
          <span>
            <i style={{ background: "var(--report-green, #246b4f)" }} />
            Đã nộp bài trắc nghiệm sau chương
          </span>
        </div>
      </article>
      {(topics.length > 0 || waitingTopics.length > 0) && (
        <article className="is-wide">
          <header>
            <div className="class-report-chart-title">
              <h3>Kết quả theo chủ đề</h3>
              <ChartHelp>
                Thanh càng dài, lớp làm đúng chủ đề đó càng nhiều. Chủ đề có tỷ
                lệ thấp được ưu tiên ôn lại.
              </ChartHelp>
            </div>
            <p>
              Tổng hợp từ tất cả chương · Chủ đề cần xem lại được xếp trước.
            </p>
          </header>
          {topics.length > 0 && <>
            <div className="class-report-chart-axis-note">
              <span>Tên bên trái: Chủ đề học</span>
              <span>Số bên phải: Tỷ lệ câu làm đúng</span>
            </div>
            <div className="class-report-rechart-canvas is-topics">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={topics}
                  margin={{ top: 4, right: 34, left: 8, bottom: 0 }}
                >
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={170}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#53645b", fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Câu đúng"]}
                    cursor={{ fill: "var(--role-soft, #f2f5f3)" }}
                  />
                  <Bar
                    dataKey="correctRate"
                    name="Câu đúng"
                    fill="var(--report-green, #246b4f)"
                    radius={[0, 5, 5, 0]}
                    maxBarSize={16}
                  >
                    <LabelList
                      dataKey="correctRate"
                      position="right"
                      formatter={(value) => `${value}%`}
                      fill="#53645b"
                      fontSize={10}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>}
          {waitingTopics.length > 0 && (
            <p className="class-report-concept-waiting">
              <strong>Chưa đủ dữ liệu:</strong>{" "}
              {waitingTopics.map((topic) => topic.name || "Chủ đề học").join(", ")}.
            </p>
          )}
        </article>
      )}
    </section>
  );
}

export function StoryChoiceChart({ decisions = [], active = 0 }) {
  const [selected, setSelected] = useState(null);
  return (
    <div className="class-report-story-recharts">
      {decisions.map((decision, decisionIndex) => {
        const options = decision.options || [];
        const total =
          Number(decision.reachedLearners) ||
          options.reduce((sum, option) => sum + (Number(option.count) || 0), 0);
        const maxCount = Math.max(
          0,
          ...options.map((option) => Number(option.count) || 0),
        );
        return (
          <article key={`${decision.question || "decision"}-${decisionIndex}`}>
            <h4>
              Tình huống {decisionIndex + 1}:{" "}
              {decision.question || "Lựa chọn trong cốt truyện"}
            </h4>
            <p>
              Dựa trên {total}/{decision.classSize || active || total} em đã đi
              qua tình huống này
            </p>
            <div className="class-report-story-options">
              {options.map((option, optionIndex) => {
                const count = Number(option.count) || 0;
                const letter =
                  option.key || String.fromCharCode(65 + optionIndex);
                const names = option.learners || [];
                return (
                  <button
                    type="button"
                    className={
                      count === maxCount && count > 0
                        ? "is-top"
                        : count === 0
                          ? "is-zero"
                          : ""
                    }
                    key={option.key || optionIndex}
                    aria-pressed={
                      selected?.decisionIndex === decisionIndex &&
                      selected?.optionIndex === optionIndex
                    }
                    onClick={() =>
                      setSelected({ decisionIndex, optionIndex, option })
                    }
                  >
                    <span className="class-report-story-letter">{letter}</span>
                    <span className="class-report-story-copy">
                      <strong>
                        {option.label || `Lựa chọn ${optionIndex + 1}`}
                      </strong>
                      <small>
                        {names.length
                          ? `${names
                              .slice(0, 3)
                              .map((item) => item.displayName || "Học sinh")
                              .join(
                                ", ",
                              )}${names.length > 3 ? `, +${names.length - 3}` : ""}`
                          : "Chưa có em nào"}
                      </small>
                    </span>
                    <span className="class-report-story-mini-chart" aria-hidden="true">
                      <i style={{ width: `${total > 0 ? Math.min(100, (count / total) * 100) : 0}%` }} />
                    </span>
                    <span className="class-report-story-count">
                      {count} em
                      {option.rate != null ? ` · ${option.rate}%` : ""}
                    </span>
                  </button>
                );
              })}
            </div>
            {selected?.decisionIndex === decisionIndex && (
              <LearnerList
                title={
                  selected.option?.label || "Học sinh đã chọn phương án này"
                }
                learners={selected.option?.learners}
              />
            )}
          </article>
        );
      })}
    </div>
  );
}
