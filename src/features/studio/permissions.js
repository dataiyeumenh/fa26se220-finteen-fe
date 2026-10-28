export const canEdit = (actor) =>
  actor?.roles?.some((role) => ["ADMIN", "GAME_EDITOR"].includes(role)) ||
  false;
export const canManage = (actor) =>
  actor?.roles?.some((role) => ["ADMIN", "GAME_MANAGER"].includes(role)) ||
  false;
export const canWriteLibrary = (actor) => canEdit(actor) || canManage(actor);
export const canReview = (actor, draft) =>
  Boolean(
    actor?.id &&
    actor.roles?.some((role) => ["ADMIN", "GAME_REVIEWER"].includes(role)) &&
    draft?.status === "SUBMITTED" &&
    draft.editorId &&
    draft.editorId !== actor.id,
  );
export const canWithdraw = (actor, draft) =>
  Boolean(
    canEdit(actor) &&
    draft?.status === "SUBMITTED" &&
    draft.editorId === actor.id,
  );
export const canPublish = (actor, plan) =>
  Boolean(
    canManage(actor) &&
    plan?.drafts?.length &&
    plan.drafts.every(
      (draft) =>
        draft.status === "APPROVED" &&
        draft.editorId &&
        draft.editorId !== actor.id,
    ),
  );
