import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  chapter1V2GameData as ch1, chapter2V2GameData as ch2,
  chapter3V2GameData as ch3, chapter5V2GameData as ch5,
  chapter6V2GameData as ch6,
} from "./fixtures/content/index.mjs";

test("mini-game frames read JSON copy and preserve legacy fallbacks without changing scoring inputs", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
  try {
    const base = "/src/pages/Kid/Dashboard/components/game/";
    const { MINI_GAME_FRAMES } = await server.ssrLoadModule(base + "miniGameFrames.js");
    const { ChapterFivePlanSummary, InspectCardsDialog } = await server.ssrLoadModule(base + "ChapterFiveActivities.jsx");
    const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));
    const gameOf = (chapter, kind) => structuredClone(chapter.scenes.find(scene => scene.game?.kind === kind).game);
    const renderGame = (game) => render(MINI_GAME_FRAMES[game.kind], { game });

    const need = gameOf(ch1, "NEED_WANT");
    assert.match(renderGame(need), /Cần hay Muốn\?/);
    need.texts = { heading: "TEST NEED", intro: "TEST INTRO", tip: "TEST TIP" };
    for (const value of Object.values(need.texts)) assert.ok(renderGame(need).includes(value));
    need.texts.heading = "";
    assert.doesNotMatch(renderGame(need), /<h2>Cần hay Muốn/);

    const savings = gameOf(ch2, "SAVINGS_RACE");
    assert.match(renderGame(savings), /Hứng từng đồng tiền để dành mua laptop nhé!/);
    savings.durationSeconds = 17;
    savings.expenses = savings.expenses?.slice(0, 1) || [{ label: "Vé xem phim", image: "/ticket.webp", value: -1 }];
    savings.expenses[0].label = "Vé xem phim";
    savings.texts = {
      heading: "TEST SAVINGS", eyebrow: "TEST EYEBROW", goalLabel: "xe đạp",
      intro: "Tránh {avoid}; gom cho {goal} trong {duration} giây.",
      howto: "TEST HOWTO {avoid} {duration}", readyFeedback: "TEST READY {goal}", tagline: "TEST TAGLINE",
    };
    savings.basketImage = "/basket-custom.webp";
    const race = renderGame(savings);
    for (const value of ["TEST SAVINGS", "TEST EYEBROW", "TEST TAGLINE", "TEST READY xe đạp", "Tránh vé xem phim; gom cho xe đạp trong 17 giây.", "/basket-custom.webp", "TEST HOWTO vé xem phim 17"])
      assert.ok(race.includes(value), value);
    assert.doesNotMatch(race, /mua laptop|tránh trò chơi/);

    const budget = gameOf(ch2, "BUDGET_BUILDER");
    assert.match(renderGame(budget), /Chia phong bì thật hợp lý/);
    budget.texts = { heading: "TEST BUDGET", boardTitle: "TEST BOARD" };
    assert.match(renderGame(budget), /TEST BUDGET/);
    assert.match(renderGame(budget), /TEST BOARD/);

    const career = gameOf(ch3, "CAREER_MATCH");
    assert.match(renderGame(career), /Quỹ thời gian của An/);
    career.texts = { steps: ["TEST STEP 1", "TEST STEP 2"], name: "Bình", fitIntro: "TEST FIT {name}: {hours}", timeLabel: "TEST TIME {name}: {hours}", disclaimer: "TEST DISCLAIMER" };
    const jobs = renderGame(career);
    for (const value of ["TEST STEP 1", "TEST STEP 2", `TEST FIT Bình: ${career.weeklyLimit}`, `TEST TIME Bình: ${career.weeklyLimit}`, "TEST DISCLAIMER"])
      assert.ok(jobs.includes(value), value);

    const oldSummary = render(ChapterFivePlanSummary, { scene: { planSummary: true }, flags: { account_choice_A: true } });
    assert.match(oldSummary, /B: 1\.005\.000đ theo lãi rút sớm, đủ học phí\./);
    const scene = { planSummary: {
      title: "TEST PLAN",
      cases: [
        { flag: "first", text: "TEST FIRST {amount}", values: { amount: 2345000 } },
        { flag: "second", text: "TEST SECOND {gap}", values: { gap: 9500 } },
        { text: "TEST DEFAULT {amount}", values: { amount: 700000 } },
      ],
      provider: { flag: "checked", yes: "TEST CHECKED", no: "TEST UNCHECKED" },
      note: { text: "TEST WALLET {wallet}", values: { wallet: 4000000 } },
    } };
    const plan = render(ChapterFivePlanSummary, { scene, flags: { first: true, second: true, checked: true } });
    for (const value of ["TEST PLAN", "TEST FIRST 2.345.000đ", "TEST CHECKED", "TEST WALLET 4.000.000đ"]) assert.ok(plan.includes(value));
    assert.doesNotMatch(plan, /TEST SECOND|TEST DEFAULT|1\.000\.000đ/);
    assert.match(render(ChapterFivePlanSummary, { scene, flags: { second: true } }), /TEST SECOND 9\.500đ/);
    assert.match(render(ChapterFivePlanSummary, { scene, flags: {} }), /TEST DEFAULT 700\.000đ/);

    const inspect = structuredClone(ch6.scenes.find(scene => scene.inspect?.cashflows).inspect);
    inspect.eyebrow = "TEST NOTEBOOK";
    inspect.subtitle = "TEST SUBTITLE";
    inspect.takeaway = "TEST TAKEAWAY";
    inspect.cashflows = [{ id: "new", label: "TEST MONTH", income: 4200000, essentials: 2300000, repayment: 800000 }];
    const cards = render(InspectCardsDialog, { inspect, onClose() {} });
    for (const value of ["TEST NOTEBOOK", "TEST SUBTITLE", "TEST TAKEAWAY", "4.200.000đ", "2.300.000đ", "800.000đ", "1.100.000đ"]) assert.ok(cards.includes(value));
    assert.match(renderGame(gameOf(ch5, "COMPOUND_TIMELINE")), /<section/);
  } finally { await server.close(); }
});
