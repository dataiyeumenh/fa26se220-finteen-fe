import { NeedWantMiniGame } from "./NeedWantMiniGame.jsx";
import { BudgetBuilderMiniGame } from "./BudgetBuilderMiniGame.jsx";
import { SavingsRaceMiniGame } from "./SavingsRaceMiniGame.jsx";
import { CareerMatchMiniGame } from "./CareerMatchMiniGame.jsx";
import { SmartShoppingMiniGame } from "./SmartShoppingMiniGame.jsx";
import { CompoundTimelineMiniGame } from "./CompoundTimelineMiniGame.jsx";
import { LoanDetectiveMiniGame } from "./LoanDetectiveMiniGame.jsx";
import { ScamOrSafeMiniGame } from "./ScamOrSafeMiniGame.jsx";
import { FuturePlanMiniGame } from "./FuturePlanMiniGame.jsx";

// The learner player and draft preview render the same frames and JSON fields.
export const MINI_GAME_FRAMES = {
  NEED_WANT: NeedWantMiniGame,
  BUDGET_BUILDER: BudgetBuilderMiniGame,
  SAVINGS_RACE: SavingsRaceMiniGame,
  CAREER_MATCH: CareerMatchMiniGame,
  SMART_SHOPPING: SmartShoppingMiniGame,
  COMPOUND_TIMELINE: CompoundTimelineMiniGame,
  LOAN_DETECTIVE: LoanDetectiveMiniGame,
  SCAM_OR_SAFE: ScamOrSafeMiniGame,
  FUTURE_PLAN: FuturePlanMiniGame,
};
const LEGACY_KIND = {
  NEEDS_OR_WANTS_CH01: "NEED_WANT",
  BUDGET_BUILDER_CH02: "BUDGET_BUILDER",
  SAVINGS_RACE_CH02: "SAVINGS_RACE",
  CAREER_MATCH_CH03: "CAREER_MATCH",
};
export const miniGameKindOf = (game) => game?.kind || LEGACY_KIND[game?.id];
