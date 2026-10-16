# Chapter 5 · Ngân hàng và lãi

Source: [FINTEEN_CH05_CODEX_SPEC.md](FINTEEN_CH05_CODEX_SPEC.md).

## Existing architecture and integration

The repository contains `chapter4V2VisualNovel.js`, not the V3 filename mentioned in the spec. Its `dialogue`, `scene`, `choice`, `conditional`, `minigame` and `ending` records feed `VisualNovelPlayer`. The player applies Money through identified transaction events and clamps stat deltas to 0–100. `choiceGroup` replaces the effective choice and reverses its previous deltas. Mini-game results replace the prior result for the same scene. Ending evaluation checks C before A before B; evidence and reflection scores are separate from gameplay stats. Smart Shopping supplies the workflow reference; its content and Chapter 1–4 data are unchanged.

The active loader imports `chapter5V2GameData` directly from `chapter5V2VisualNovel.js`, matching the existing chapter naming convention. All Chapter 5 content lives in that file; no separate V3 module or compatibility wrapper is needed. Chapter 5 adds optional card-based Inspect and activity scenes for structured reflection. These extensions do not change the existing scene API. Normalized scoring is enabled only by `endingReport.choiceGroupMaxima`; legacy ending expressions retain their current inputs.

## Play and verify

Run `npm run dev`, sign in as a demo Guest and open `/dashboard/demo/play?chapter=5` (or use the Chapter 5 card). Kid access continues to follow the existing plan guard.

Run `node --test tests/chapter-five.test.mjs tests/game-v2.test.mjs tests/mini-game-rules.test.mjs`, `npm run build` and `npm run lint`.

Browser harness (no account/API needed): with Vite running, open `/tests/fixtures/chapter-five-browser.html?route=goal`. Other routes: `topup`, `pending`, `providerRecover`, `miniRetry`, `reflectionRetry`, `revise`. It executes the real player, fills all four rounds, checks Money every step, final stats, Ending and horizontal overflow. Inspect `#ch5-browser-result` for PASS/FAIL. `/tests/fixtures/chapter-five-mobile.html` runs the revision route in a true 360px iframe, independent of the minimum desktop Chrome window size.

## Validation results

- Build passed; Vite warns that the main JavaScript chunk exceeds 500 kB.
- Targeted ESLint passed for all Chapter 5 modules, the loader, player and browser harness.
- 30 related Node tests passed, including seven Chapter 5 acceptance tests and existing mini-game, hotspot, workspace and chapter-four-story tests.
- Seven Chrome browser runs passed: Goal Achieved; verified top-up; pending source / Recovery; provider recovery / Balanced; incorrect submitted mini-game answer remains locked with explanatory feedback; revising C to A at 360px; and returning from Ending Balanced to revise reflection and achieve A. They check unchanged Money, exact final stat deltas, first-attempt retention and horizontal overflow. No JavaScript errors were captured.
- Whole-repository lint still reports 15 existing errors outside these changed modules, mainly unused variables and the existing `button.jsx` Fast Refresh export warning.
- `tests/game-v2.test.mjs` has three existing Chapter 4 failures: it expects the purchase event on `options[0]`, the former `questions[]` mini-game schema, and an earlier ending interpretation. These tests import unchanged Chapter 4 data directly; no Chapter 5/player code participates in those failing assertions. Chapter 4 content was not modified to satisfy stale assertions.
- Browser checks use an isolated player fixture. Live account/API and published-content overrides, physical touch devices, and a complete physical-keyboard-only pass were not exercised.

## Rules and deliberate additions

- Money is 1,000,000 VND throughout. No Chapter 5 transaction events exist. Forecasts remain separate text.
- Compound Timeline has four stages and 12 graded challenges, with answers, attempt counts, first/final correctness, inspected items and three competency summaries. Each round is submitted once. Submitted inputs are disabled, grading ignores replacement answers, and progress is checkpointed in the player immediately. Returning to the scene restores the locked answers. The recap has no mini-game replay action.
- Provider and account choices each have a six-point maximum. Choice percentage uses a fixed 12-point denominator. Learning score uses choices 60%, mini-game 30%, reflection 10%. Ending A requires both normalized scores >=75%, correct core calculations and completed reflection. The initial account-A selection can be completed by a verified top-up decision; this is a forward step, not a return to choose a different account.
- Provider decisions are final. There is no recovery/re-check choice that changes an earlier provider decision.
- The optional top-up card is explicitly a **supplementary simulated budget**, not a GDD fact or a real balance: 10,000 VND of unspent planned entertainment, 7,500 VND reduction, check at end of month 1. It is available only through the explicit additional-card branch; inspection plus confirmation is required. A promise alone remains pending.
- Reflection uses information selection, a calculation method, an action and a follow-up date, with I/C/P scores 0–2 per activity. It does not change the account plan implicitly. It is a structured rubric activity, not automatic grading of free-form prose.
- Unsupported expressions use an existing neutral sprite. No generated art or new external dependencies.

Current gameplay override: B early withdrawal is 2%/year per user revision (superseding the original spec). Over three months on 1,000,000 VND, interest is 5,000 VND and forecast balance is 1,005,000 VND. Actual Money is unchanged.

Current UI revision: account A (flexible withdrawal) and account B (12-month term) are the two comparison cards. The course payment deadline is a separate reference panel, not a third selectable account card. An's age is not included in chapter content or metadata. The latest targeted suite has 17 passing tests; Chrome checked the locked incorrect-answer path, correct path and 360px revision path. The legacy browser route name `miniRetry` now tests refusal to retry.

Latest decision-flow revision: Chapter 5 sets `metadata.lockDecisions`, disables scene-back navigation, and guards submitted choice scenes against repeat selection. Account/provider repair branches and the ending repair button were removed. The recap has only Continue to reflection. Each substantive choice now displays projected consequences, exact stat deltas, unchanged Money, learning evidence and Ending implications after submission. Reflection explicitly affects learning/Ending only, not stats or the recorded account choice. Five Chrome runs verified B success, verified A top-up, pending top-up / Recovery, unchecked provider / Balanced and account mismatch / Recovery at 360px. Historical route names `revise` and `providerRecover` now exercise final unrevised decisions.

Latest branching revision: the first account screen now has two neutral navigation options (A flexible / B 12-month term), with no stats, evidence or outcome feedback. B leads to a timing decision: withdraw at month 3 (existing feasible result) or retain to maturity at month 12 (forecast 1,060,000 VND at month 12, no confirmed tuition source at month 3; GOAL -3, evidence I2/C2/P0 and Recovery). A leads to its funding/interest-assumption decisions, retaining the verified-source and pending-source consequences. All final plan decisions use the same CH05_PLAN evidence group. No branch returns to change the account or final decision. Five Chrome flows passed for these branches; targeted lint, build and eight Chapter 5 tests passed.
