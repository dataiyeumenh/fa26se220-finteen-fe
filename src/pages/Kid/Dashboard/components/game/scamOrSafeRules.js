import { chapterMiniGameSummary } from "./miniGameRules.js";
// Dữ liệu mini-game (giấy tờ, tin nhắn, hành động, đáp án) nằm trong JSON chương: game.config (khung SCAM_OR_SAFE).
// Màn 0: hai mục chấm (tiền + hồ sơ); màn 1: mỗi tin một mục; màn 2: mỗi hành động trong `response.grading` một mục.
export const safetyTasks = ({ inbox, response }) => [
  { id: "insurancePayment", round: 0 },
  { id: "insurancePacket", round: 0 },
  ...inbox.messages.map((message) => ({ id: message.id, round: 1 })),
  ...response.grading.map(({ id }) => ({
    id: `response_${id}`,
    round: 2,
  })),
];
export function createSafetyState(rounds) {
  return {
    round: rounds[0],
    payment: null,
    documents: [],
    messages: {},
    activeMessage: 0,
    response: [],
    submittedRounds: {},
    history: {},
    feedback: "",
  };
}
export function applySafetyAction(config, state, action) {
  const { insurance, inbox, response } = config;
  const messages = inbox.messages;
  if (action.type === "ROUND")
    return state.submittedRounds[state.round] &&
      action.round === state.round + 1
      ? { ...state, round: action.round, feedback: "" }
      : state;
  // Reading another inbox card remains possible after submission; answers stay locked.
  if (
    action.type === "MESSAGE" &&
    state.round === 1 &&
    Number.isInteger(action.index) &&
    action.index >= 0 &&
    action.index < messages.length
  )
    return { ...state, activeMessage: action.index };
  if (state.submittedRounds[state.round]) return state;
  const next = { ...state, feedback: "" };
  const grade = (id, correct) => {
    next.history = {
      ...next.history,
      [id]: {
        firstAttemptCorrect: correct,
        finalCorrect: correct,
        attemptCount: 1,
      },
    };
  };
  const submit = () => {
    next.submittedRounds = { ...state.submittedRounds, [state.round]: true };
  };
  if (
    action.type === "PAYMENT" &&
    state.round === 0 &&
    insurance.payments.includes(action.amount)
  )
    next.payment = action.amount;
  else if (
    action.type === "DOCUMENT" &&
    state.round === 0 &&
    insurance.documents.some((item) => item.id === action.id)
  )
    next.documents = state.documents.includes(action.id)
      ? state.documents.filter((id) => id !== action.id)
      : [...state.documents, action.id];
  else if (
    action.type === "SUBMIT_INSURANCE" &&
    state.round === 0 &&
    insurance.payments.includes(state.payment)
  ) {
    grade("insurancePayment", state.payment === insurance.correctPayment);
    grade(
      "insurancePacket",
      state.documents.length === insurance.requiredDocuments.length &&
        insurance.requiredDocuments.every((id) => state.documents.includes(id)),
    );
    submit();
    next.feedback = insurance.feedback;
  } else if (
    action.type === "ANSWER_MESSAGE" &&
    state.round === 1 &&
    messages.some((item) => item.id === action.id) &&
    inbox.answerOrder.includes(action.answer)
  ) {
    next.messages = { ...state.messages, [action.id]: action.answer };
    next.activeMessage = Math.min(messages.length - 1, state.activeMessage + 1);
  } else if (
    action.type === "SUBMIT_MESSAGES" &&
    state.round === 1 &&
    messages.every((item) => state.messages[item.id])
  ) {
    for (const message of messages)
      grade(message.id, state.messages[message.id] === message.answer);
    submit();
    next.feedback = inbox.feedback;
  } else if (
    action.type === "ADD_RESPONSE" &&
    state.round === 2 &&
    state.response.length < response.slots &&
    response.actions.some((item) => item.id === action.id) &&
    !state.response.includes(action.id)
  )
    next.response = [...state.response, action.id];
  else if (action.type === "REMOVE_RESPONSE" && state.round === 2)
    next.response = state.response.filter((id) => id !== action.id);
  else if (
    action.type === "SUBMIT_RESPONSE" &&
    state.round === 2 &&
    state.response.length === response.slots
  ) {
    for (const { id, positions } of response.grading)
      grade(`response_${id}`, positions.includes(state.response.indexOf(id)));
    submit();
    next.feedback = response.feedback;
  } else return state;
  return next;
}
export function safetyResult(config, history, rounds) {
  const tasks = safetyTasks(config).filter((task) =>
    rounds.includes(task.round),
  );
  const score = tasks.filter((task) => history[task.id]?.finalCorrect).length;
  return {
    score,
    total: tasks.length,
    completed: tasks.every((task) => Boolean(history[task.id])),
    passed: score === tasks.length,
    firstPercent: Math.round((score * 100) / tasks.length),
    answers: history,
    revised: false,
  };
}
export function chapterSevenLearning(ledger, results, config) {
  const groups = Object.entries(config.choiceGroupMaxima);
  const sum = (entry) =>
    Object.values(entry || {}).reduce((total, value) => total + value, 0);
  const max = groups.reduce((total, [, value]) => total + value, 0);
  const choicePercent =
    (groups.reduce(
      (total, [id]) => total + sum(ledger[id]?.evidenceScores),
      0,
    ) *
      100) /
    max;
  const firstPercent =
    (groups.reduce(
      (total, [id]) =>
        total +
        sum(ledger[id]?.firstEvidenceScores || ledger[id]?.evidenceScores),
      0,
    ) *
      100) /
    max;
  const miniGames = chapterMiniGameSummary(results, config);
  const { miniPercent } = miniGames;
  return {
    ...miniGames,
    choicePercent,
    firstPercent,
    miniPercent,
    reflectionPercent: null,
    learningScore:
      choicePercent * config.weights.choices +
      miniPercent * config.weights.miniGame,
  };
}
