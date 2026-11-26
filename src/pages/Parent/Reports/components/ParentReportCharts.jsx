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

function TooltipBox({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="class-report-chart-tooltip">
      <strong>{label}</strong>
      {payload.map((item) => (
        <span key={item.dataKey}>
          {item.name}: {item.value} bé
        </span>
      ))}
    </div>
  );
}

export default function ParentCourseProgressChart({ chapters = [] }) {
  const data = chapters.map((chapter) => ({
    chapter: `Ch.${chapter.number}`,
    finished: Number(chapter.finished) || 0,
    submitted: Number(chapter.submitted) || 0,
  }));
  return (
    <section className="family-report-course-chart">
      <header>
        <h2>Tiến độ theo chương</h2>
        <p>
          Mỗi chương có hai cột: số bé đã học xong và số bé đã nộp bài trắc
          nghiệm sau chương.
        </p>
      </header>
      <div className="class-report-chart-axis-note">
        <span>Trục dọc: Số bé</span>
        <span>Trục ngang: Từng chương</span>
      </div>
      <div className="family-report-course-chart-canvas">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 24, right: 8, left: 0, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid vertical={false} stroke="#e4e9e6" />
            <XAxis
              dataKey="chapter"
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
              content={<TooltipBox />}
              cursor={{ fill: "var(--role-soft, #eef8f3)" }}
            />
            <Bar
              dataKey="finished"
              name="Đã xong chương"
              fill="var(--role-color, #67dbb0)"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            >
              <LabelList
                dataKey="finished"
                position="top"
                formatter={(value) => `${value} bé`}
                fill="#53645b"
                fontSize={9}
              />
            </Bar>
            <Bar
              dataKey="submitted"
              name="Đã nộp bài sau chương"
              fill="var(--role-link, #206c53)"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            >
              <LabelList
                dataKey="submitted"
                position="top"
                formatter={(value) => `${value} bé`}
                fill="var(--role-link, #206c53)"
                fontSize={9}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="class-report-rechart-key">
        <span>
          <i style={{ background: "var(--role-color, #67dbb0)" }} />
          Đã xong chương
        </span>
        <span>
          <i style={{ background: "var(--role-link, #206c53)" }} />
          Đã nộp bài trắc nghiệm sau chương
        </span>
      </div>
    </section>
  );
}
