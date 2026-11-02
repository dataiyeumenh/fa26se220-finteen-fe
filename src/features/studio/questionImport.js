// No bulk endpoint is assumed: use the same create contract as QuestionForm.
export async function importQuestionRows(api, questions, metadata, start, onSaved) {
  for (let index = start; index < questions.length; index++) {
    const { stem, options, correctIndex } = questions[index];
    await api.post("/api/studio/questions", {
      stem, options, correctIndex,
      pool: metadata.pool.trim(),
      chapter: metadata.chapter || null,
      standard: null, concept: null, source: null, license: null,
      externalId: null, replacesId: null,
    });
    onSaved(index + 1);
  }
}
