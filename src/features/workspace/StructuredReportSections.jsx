const sectionTitle = {
  decisions: "Lựa chọn trong cốt truyện",
  doingWell: "Làm tốt",
  needsPractice: "Cần luyện thêm",
  tips: "Gợi ý tiếp theo",
  notEnough: "Mới làm ít câu ở các nội dung này",
};

const evidence = (item) => Number(item?.total) > 0
  ? `${Number(item.correct) || 0}/${Number(item.total) || 0} câu đúng`
  : null;

function SectionItems({ type, items }) {
  if (!Array.isArray(items) || !items.length) return null;
  return <section className={`structured-report-group is-${type}`}>
    <h4>{sectionTitle[type]}</h4>
    <ul>{items.map((item, index) => <li key={`${item?.concept || item?.option || type}-${index}`}>
      <div>
        <strong>{item?.name || item?.option || item?.text || "Nội dung học tập"}</strong>
        {type === "decisions" && item?.picked != null && item?.of != null && <span>{item.picked}/{item.of} em lựa chọn</span>}
        {type === "decisions" && item?.deliberate != null && <span>{item.deliberate ? "Đã cân nhắc" : "Cần thêm thời gian cân nhắc"}</span>}
        {type !== "decisions" && evidence(item) && <span>{evidence(item)}</span>}
      </div>
      {item?.text && item.text !== item?.name && item.text !== item?.option && <p>{item.text}</p>}
    </li>)}</ul>
  </section>;
}

export default function StructuredReportSections({ sections, fallbackText }) {
  if (!sections || typeof sections !== "object") {
    return fallbackText ? <p className="structured-report-fallback">{fallbackText}</p> : null;
  }
  return <div className="structured-report-sections">
    {sections.overview && <p className="structured-report-overview">{sections.overview}</p>}
    <SectionItems type="decisions" items={sections.decisions} />
    <SectionItems type="doingWell" items={sections.doingWell} />
    <SectionItems type="needsPractice" items={sections.needsPractice} />
    <SectionItems type="tips" items={sections.tips} />
    <SectionItems type="notEnough" items={sections.notEnough} />
  </div>;
}
