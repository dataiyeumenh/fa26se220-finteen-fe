export async function loadTeacherDashboard(api) {
  const groups = ((await api.listGroups()) || [])
    .filter((group) => group.context === "CLASS")
    .sort((a, b) => Number(Boolean(a.closedAt)) - Number(Boolean(b.closedAt)));
  const results = await Promise.all(groups.map(async (group) => {
    const [report, quizzes] = await Promise.allSettled([
      api.getGroupReport(group.id),
      api.listQuizzes(group.id),
    ]);
    return { report, quizzes };
  }));
  const reportsComplete = results.every(({ report }) =>
    report.status === "fulfilled" && Number.isFinite(report.value?.summary?.learners),
  );
  const quizzesComplete = results.every(({ quizzes }) =>
    quizzes.status === "fulfilled" && Array.isArray(quizzes.value),
  );
  const studentCount = reportsComplete
    ? results.reduce((sum, { report }) => sum + report.value.summary.learners, 0)
    : null;
  const quizStatsComplete = results.every(({ report }) =>
    report.status === "fulfilled" &&
    Number.isFinite(report.value?.summary?.quizAssigned) &&
    Number.isFinite(report.value?.summary?.quizSubmitted),
  );
  const quizAssigned = quizStatsComplete
    ? results.reduce((sum, { report }) => sum + report.value.summary.quizAssigned, 0)
    : null;
  const quizSubmitted = quizStatsComplete
    ? results.reduce((sum, { report }) => sum + report.value.summary.quizSubmitted, 0)
    : null;
  const scoredSubmissions = quizStatsComplete
    ? results.filter(({ report }) =>
        report.value.summary.quizSubmitted > 0 &&
        Number.isFinite(report.value.summary.averageScore),
      )
    : [];
  const averageScore = quizStatsComplete && quizSubmitted > 0 &&
    scoredSubmissions.reduce((sum, { report }) => sum + report.value.summary.quizSubmitted, 0) === quizSubmitted
    ? scoredSubmissions.reduce(
        (sum, { report }) => sum + report.value.summary.averageScore * report.value.summary.quizSubmitted,
        0,
      ) / quizSubmitted
    : null;
  const quizzes = new Set();
  if (quizzesComplete) {
    for (const { quizzes: result } of results) {
      for (const quiz of result.value) quizzes.add(quiz.id);
    }
  }
  const warnings = [];
  if (!reportsComplete) warnings.push("Chưa tải đầy đủ số học sinh trên tất cả lớp.");
  if (!quizzesComplete) warnings.push("Chưa tải đầy đủ số bài quiz đang quản lý.");
  return {
    group: groups[0] || null,
    report: results[0]?.report.status === "fulfilled" ? results[0].report.value : null,
    groupCount: groups.length,
    activeGroupCount: groups.filter((group) => !group.closedAt).length,
    studentCount,
    quizCount: quizzesComplete ? quizzes.size : null,
    quizAssigned,
    quizSubmitted,
    averageScore,
    warning: warnings.join(" "),
  };
}
