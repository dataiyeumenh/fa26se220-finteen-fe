// Cấu trúc mạch truyện cho trình soạn: chèn / xoá / nhân đôi cảnh mà không làm đứt mạch,
// tìm chỗ cần sửa (gom theo gốc), đọc điều kiện thành câu và tính điều kiện khi chơi thử.
// Hàm thuần — không đụng React, nhận mảng cảnh và trả mảng mới (không sửa mảng cũ).

export const REF_KEYS = [
  "nextSceneId",
  "onPassSceneId",
  "ifTrueSceneId",
  "ifFalseSceneId",
];
const TYPE_ALIASES = { scene: "inspect", activity: "reflection" };
export const typeOf = (scene) => TYPE_ALIASES[scene?.type] || scene?.type;
export const TYPE_LABEL = {
  dialogue: "Lời thoại",
  choice: "Câu hỏi lựa chọn",
  inspect: "Bấm để xem",
  minigame: "Mini-game",
  conditional: "Rẽ nhánh tự động",
  reflection: "Câu hỏi suy ngẫm",
  summary: "Tổng kết",
  cutscene: "Cảnh chuyển",
  ending: "Kết chương",
};
export const sceneLabel = (scene) =>
  scene?.title ||
  String(
    scene?.text ||
      scene?.prompt ||
      scene?.inspect?.buttonText ||
      scene?.game?.title ||
      "",
  ).slice(0, 60) ||
  TYPE_LABEL[typeOf(scene)] ||
  "Cảnh";

/** cảnh một đường: đi tiếp bằng đúng một cảnh kế (không phải câu hỏi, rẽ nhánh, kết) */
export const isLinear = (scene) =>
  !["choice", "conditional", "ending"].includes(typeOf(scene));
export const nextKeyOf = (scene) =>
  scene.onPassSceneId && !scene.nextSceneId ? "onPassSceneId" : "nextSceneId";

export function exitsOf(scene) {
  const type = typeOf(scene);
  if (type === "choice")
    return (scene.options || [])
      .map((option) => option.nextSceneId)
      .filter(Boolean);
  if (type === "conditional")
    return [scene.ifTrueSceneId, scene.ifFalseSceneId].filter(Boolean);
  if (type === "ending") return [];
  return [scene[nextKeyOf(scene)]].filter(Boolean);
}

/** cảnh này biến mất thì mạch đi tiếp tới đâu: cảnh kế, hoặc điểm các nhánh nhập lại */
export function continuation(scenes, scene) {
  const outs = [...new Set(exitsOf(scene))];
  if (outs.length <= 1) return outs[0] || null;
  const byId = new Map(scenes.map((item) => [item.id, item]));
  const walk = (start) => {
    const order = [],
      seen = new Set([scene.id]),
      queue = [start];
    while (queue.length) {
      const id = queue.shift();
      if (seen.has(id) || !byId.has(id)) continue;
      seen.add(id);
      order.push(id);
      queue.push(...exitsOf(byId.get(id)));
    }
    return order;
  };
  const others = outs.slice(1).map((id) => new Set(walk(id)));
  return walk(outs[0]).find((id) => others.every((set) => set.has(id))) || null;
}

const cloneScenes = (scenes) =>
  scenes.map((scene) => ({
    ...scene,
    ...(scene.options
      ? { options: scene.options.map((option) => ({ ...option })) }
      : {}),
  }));

/** mọi chỗ trỏ tới fromId chuyển sang toId (toId rỗng = gỡ); không tạo vòng tự trỏ */
function relink(scenes, fromId, toId, skipId) {
  for (const scene of scenes) {
    if (scene.id === skipId) continue;
    for (const key of REF_KEYS)
      if (scene[key] === fromId) {
        if (toId && toId !== scene.id) scene[key] = toId;
        else delete scene[key];
      }
    for (const option of scene.options || [])
      if (option.nextSceneId === fromId) {
        if (toId && toId !== scene.id) option.nextSceneId = toId;
        else delete option.nextSceneId;
      }
  }
}

/** đặt mọi lối ra của cảnh về một đích — câu hỏi mới: mọi lựa chọn về cảnh kế cũ ("rẽ rồi nhập") */
function setOut(scene, target) {
  const type = typeOf(scene);
  if (type === "choice")
    scene.options = (scene.options || []).map((option) => ({
      ...option,
      nextSceneId: target ?? null,
    }));
  else if (type === "conditional") {
    scene.ifTrueSceneId = target ?? null;
    scene.ifFalseSceneId = target ?? null;
  } else if (type !== "ending") scene[nextKeyOf(scene)] = target ?? null;
}

/**
 * Chèn cảnh mới sau cảnh index. Cảnh một đường: nối giữa cảnh đó và cảnh kế của nó.
 * Câu hỏi / rẽ nhánh / kết: chèn TRƯỚC cảnh đó (không cắt nhánh nào). Trả { scenes, index }.
 */
export function insertLinked(scenes, index, scene) {
  const copy = cloneScenes(scenes),
    fresh = { ...scene },
    base = copy[index];
  if (!base) {
    copy.push(fresh);
    return { scenes: copy, index: copy.length - 1 };
  }
  if (isLinear(base)) {
    setOut(fresh, base[nextKeyOf(base)] || null);
    base[nextKeyOf(base)] = fresh.id;
    copy.splice(index + 1, 0, fresh);
    return { scenes: copy, index: index + 1 };
  }
  relink(copy, base.id, fresh.id);
  setOut(fresh, base.id);
  copy.splice(index, 0, fresh);
  return { scenes: copy, index };
}

/** xoá cảnh: mọi chỗ dẫn tới nó nối thẳng sang cảnh đi tiếp; xoá cảnh đầu thì cảnh đi tiếp lên đầu */
export function removeLinked(scenes, index) {
  const copy = cloneScenes(scenes),
    scene = copy[index];
  if (!scene) return { scenes: copy, index: 0, to: null };
  const to = continuation(copy, scene);
  relink(copy, scene.id, to, scene.id);
  copy.splice(index, 1);
  if (index === 0 && to) {
    const k = copy.findIndex((item) => item.id === to);
    if (k > 0) copy.unshift(...copy.splice(k, 1));
  }
  const at = to ? copy.findIndex((item) => item.id === to) : index - 1;
  return {
    scenes: copy,
    index: Math.max(0, Math.min(at, copy.length - 1)),
    to,
  };
}

/** nhân đôi: cảnh một đường thì bản sao đứng ngay sau; câu hỏi thì bản sao đứng trước, mọi lựa chọn về câu gốc */
export function duplicateLinked(scenes, index, id) {
  const source = scenes[index],
    copy = structuredClone(source);
  copy.id = id;
  delete copy.voiceUrl;
  delete copy.onFailSceneId;
  copy.title = `${source.title || "Cảnh"} (bản sao)`;
  if (copy.options)
    copy.options = copy.options.map((option, k) => ({
      ...option,
      id: `${id}_OPT${k + 1}`,
    }));
  if (copy.choiceGroup) copy.choiceGroup = id;
  if (copy.inspect?.id) copy.inspect.id = `${id}_INS`;
  if (copy.game?.id) copy.game.id = `${id}_GAME`;
  return insertLinked(scenes, index, copy);
}

/**
 * Chỗ cần sửa trước khi gửi duyệt, bằng lời thường, GỐC ĐỨNG ĐẦU: lỗi từng cảnh trước,
 * hệ quả đường đi (cảnh không tới được / không tới Kết) gom thành một dòng. Phần tử: { index, text }.
 */
export function storyIssues(scenes) {
  const out = [],
    ids = new Set(scenes.map((scene) => scene.id)),
    byId = new Map(scenes.map((scene) => [scene.id, scene]));
  scenes.forEach((scene, index) => {
    const type = typeOf(scene),
      name = `Cảnh ${index + 1}`;
    if (type === "dialogue" && !String(scene.text || "").trim())
      out.push({ index, text: `${name}: chưa có lời thoại` });
    for (const key of REF_KEYS)
      if (scene[key] && !ids.has(scene[key]))
        out.push({
          index,
          text: `${name}: dẫn tới một cảnh không còn — chọn lại cảnh tiếp theo`,
        });
    if (
      type === "conditional" &&
      (!scene.ifTrueSceneId || !scene.ifFalseSceneId)
    )
      out.push({ index, text: `${name}: rẽ nhánh chưa chọn đủ hai hướng` });
    if (isLinear(scene) && !scene[nextKeyOf(scene)])
      out.push({ index, text: `${name}: chưa chọn cảnh tiếp theo` });
    if (type === "choice") {
      if (!scene.options?.length)
        out.push({ index, text: `${name}: câu hỏi chưa có lựa chọn nào` });
      (scene.options || []).forEach((option, k) => {
        if (!String(option.text || option.label || "").trim())
          out.push({ index, text: `${name}: lựa chọn ${k + 1} chưa có chữ` });
        if (!option.nextSceneId)
          out.push({
            index,
            text: `${name}: lựa chọn ${k + 1} chưa chọn “bấm xong thì sang”`,
          });
        else if (!ids.has(option.nextSceneId))
          out.push({
            index,
            text: `${name}: lựa chọn ${k + 1} dẫn tới cảnh không còn`,
          });
        if (
          isStructured(option.condition) &&
          !String(option.lockedReason || "").trim()
        )
          out.push({
            index,
            text: `${name}: lựa chọn ${k + 1} bị khoá nhưng chưa có câu nhắn cho trẻ`,
          });
      });
    }
  });
  if (!scenes.length) return out;
  if (!scenes.some((scene) => typeOf(scene) === "ending"))
    out.push({ index: scenes.length - 1, text: "Chương chưa có cảnh Kết" });
  const reach = (starts, next) => {
    const seen = new Set(),
      queue = [...starts];
    while (queue.length) {
      const id = queue.pop();
      if (seen.has(id) || !byId.has(id)) continue;
      seen.add(id);
      queue.push(...next(id));
    }
    return seen;
  };
  const back = {};
  scenes.forEach((scene) =>
    exitsOf(scene).forEach((id) => (back[id] ||= []).push(scene.id)),
  );
  const fromStart = reach([scenes[0].id], (id) => exitsOf(byId.get(id)));
  const toEnd = reach(
    scenes
      .filter((scene) => typeOf(scene) === "ending")
      .map((scene) => scene.id),
    (id) => back[id] || [],
  );
  const lost = [],
    stuck = [];
  scenes.forEach((scene, index) => {
    if (!fromStart.has(scene.id)) lost.push(index);
    else if (!toEnd.has(scene.id)) stuck.push(index);
  });
  const list = (xs) =>
    xs
      .slice(0, 6)
      .map((i) => i + 1)
      .join(", ") + (xs.length > 6 ? "…" : "");
  if (lost.length)
    out.push({
      index: lost[0],
      text: `${lost.length} cảnh không có đường nào đi tới (cảnh ${list(lost)}) — nối một cảnh hoặc lựa chọn vào đó, hoặc xoá cảnh thừa`,
      group: true,
    });
  if (stuck.length && !out.some((item) => !item.group))
    out.push({
      index: stuck[0],
      text: `Từ ${stuck.length} cảnh không đi tới được Kết (cảnh ${list(stuck)})`,
      group: true,
    });
  return out;
}

/* ---------- điều kiện: đọc thành câu, tính khi chơi thử ---------- */
export const OP_LABEL = {
  ">=": "ít nhất",
  "<=": "nhiều nhất",
  ">": "nhiều hơn",
  "<": "ít hơn",
  "==": "bằng",
  "!=": "khác",
};
export const vnd = (value) => `${Number(value || 0).toLocaleString("vi-VN")}đ`;
export const isStructured = (condition) =>
  !!condition &&
  typeof condition === "object" &&
  ("all" in condition || "any" in condition || "var" in condition);

/** nhóm câu hỏi (choice:<nhóm>) → { scene, options } */
export function questionsOf(scenes) {
  const groups = {};
  for (const scene of scenes)
    if (typeOf(scene) === "choice")
      (groups[scene.choiceGroup || scene.id] ||= {
        scene,
        options: [],
      }).options.push(...(scene.options || []));
  return groups;
}

export function conditionSentence(condition, scenes, statLabels = {}) {
  if (!condition) return "luôn luôn";
  if (!isStructured(condition))
    return "điều kiện kiểu cũ — sửa ở phần Nâng cao";
  const group = condition.all || condition.any;
  if (group)
    return (
      group
        .map((item) => conditionSentence(item, scenes, statLabels))
        .join(condition.all ? " và " : " hoặc ") || "luôn luôn"
    );
  const name = String(condition.var);
  const yes = (condition.value === false) === (condition.op === "!=");
  if (name.startsWith("flag:"))
    return `${yes ? "đã" : "chưa"} “${name.slice(5).replace(/_/g, " ")}”`;
  if (name.startsWith("inspected:")) {
    const card = scenes.find((scene) => scene.inspect?.id === name.slice(10));
    return `${yes ? "đã" : "chưa"} mở “${card?.inspect?.buttonText || name.slice(10)}”`;
  }
  if (name.startsWith("choice:")) {
    const question = questionsOf(scenes)[name.slice(7)],
      option = question?.options.find((item) => item.id === condition.value);
    return `câu “${(question?.scene.text || name.slice(7)).slice(0, 40)}” ${condition.op === "!=" ? "không chọn" : "đã chọn"} “${(option?.text || option?.label || condition.value || "").slice(0, 40)}”`;
  }
  const label =
    name === "money"
      ? "Tiền của An"
      : name === "miniGameScore"
        ? "Điểm mini-game"
        : statLabels[name] || name;
  return `${label} ${OP_LABEL[condition.op] || condition.op} ${name === "money" ? vnd(condition.value) : condition.value}`;
}

/** true / false / undefined (không tính được: biến lạ hoặc điều kiện kiểu cũ) */
export function evalCondition(condition, state) {
  if (condition == null) return true;
  if (!isStructured(condition)) return undefined;
  const group = condition.all || condition.any;
  if (group) {
    const results = group.map((item) => evalCondition(item, state));
    if (condition.all)
      return results.includes(false)
        ? false
        : results.includes(undefined)
          ? undefined
          : true;
    return results.includes(true)
      ? true
      : results.includes(undefined)
        ? undefined
        : false;
  }
  const name = String(condition.var);
  let value;
  if (name === "money") value = state.money;
  else if (name === "miniGameScore") value = state.score;
  else if (name in state.stats) value = state.stats[name];
  else if (name.startsWith("flag:")) value = !!state.flags[name.slice(5)];
  else if (name.startsWith("inspected:"))
    value = !!state.inspected[name.slice(10)];
  else if (name.startsWith("choice:"))
    value = state.choices[name.slice(7)] ?? null;
  else return undefined;
  const target = condition.value;
  return {
    "==": value == target,
    "!=": value != target,
    ">": value > target,
    ">=": value >= target,
    "<": value < target,
    "<=": value <= target,
  }[condition.op];
}

/**
 * Bản đồ truyện "rẽ rồi nhập": câu hỏi / rẽ nhánh tách thành làn, các làn gặp lại ở điểm nhập (post-dominator).
 * Trả cây khối để vẽ: node (một cảnh), run (đoạn thẳng dài, thu gọn được), branch (các làn + điểm nhập), jump (↩ quay lại / ↪ nhập vào cảnh đã vẽ).
 */
export function buildStoryMap(scenes) {
  if (!scenes.length) return [];
  const index = new Map(scenes.map((scene, i) => [scene.id, i]));
  const exits = (id) => [
    ...new Set(
      exitsOf(scenes[index.get(id)]).filter((target) => index.has(target)),
    ),
  ];
  // đường quay lại (DFS từ cảnh đầu) bị bỏ khi tính điểm nhập
  const back = new Set(),
    color = {},
    stack = [[scenes[0].id, 0]];
  color[scenes[0].id] = 1;
  while (stack.length) {
    const top = stack[stack.length - 1],
      outs = exits(top[0]);
    if (top[1] >= outs.length) {
      color[top[0]] = 2;
      stack.pop();
      continue;
    }
    const next = outs[top[1]++];
    if (color[next] === 1) back.add(`${top[0]}>${next}`);
    else if (!color[next]) {
      color[next] = 1;
      stack.push([next, 0]);
    }
  }
  const dag = (id) =>
    exits(id).filter((target) => !back.has(`${id}>${target}`));
  const order = [],
    seen = new Set();
  for (const scene of scenes) {
    if (seen.has(scene.id)) continue;
    const walk = [[scene.id, 0]];
    seen.add(scene.id);
    while (walk.length) {
      const top = walk[walk.length - 1],
        outs = dag(top[0]);
      if (top[1] >= outs.length) {
        order.push(top[0]);
        walk.pop();
        continue;
      }
      const next = outs[top[1]++];
      if (!seen.has(next)) {
        seen.add(next);
        walk.push([next, 0]);
      }
    }
  }
  const pdom = {};
  for (const id of order) {
    const sets = dag(id).map((target) => pdom[target]);
    let inter = sets.length ? new Set(sets[0]) : new Set();
    for (const set of sets.slice(1))
      inter = new Set([...inter].filter((x) => set.has(x)));
    inter.add(id);
    pdom[id] = inter;
  }
  const joinOf = (id) => {
    const rest = [...pdom[id]].filter((x) => x !== id);
    return (
      rest.find(
        (d) =>
          pdom[d].size === rest.length && rest.every((x) => pdom[d].has(x)),
      ) || null
    );
  };
  const drawn = new Set();
  function sequence(start, stop) {
    const blocks = [];
    let id = start,
      run = [],
      guard = 0;
    const flush = () => {
      if (run.length)
        blocks.push(
          run.length <= 3
            ? { kind: "nodes", indexes: run }
            : { kind: "run", indexes: run },
        );
      run = [];
    };
    while (id && id !== stop && guard++ < 600) {
      if (!index.has(id)) break;
      if (drawn.has(id)) {
        flush();
        blocks.push({ kind: "jump", to: index.get(id), back: false });
        return blocks;
      }
      drawn.add(id);
      const scene = scenes[index.get(id)],
        type = typeOf(scene);
      const backs = exits(id).filter((target) => back.has(`${id}>${target}`));
      if (type !== "choice" && type !== "conditional") {
        run.push(index.get(id));
        if (backs.length) {
          flush();
          backs.forEach((target) =>
            blocks.push({ kind: "jump", to: index.get(target), back: true }),
          );
        }
        id = dag(id)[0];
        continue;
      }
      flush();
      const join = joinOf(id);
      const arms =
        type === "choice"
          ? (scene.options || []).map((option, k) => ({
              label: option.text || option.label || `Lựa chọn ${k + 1}`,
              to: option.nextSceneId,
              option: k,
              locked: !!option.condition,
            }))
          : [
              { label: "Nếu đúng", to: scene.ifTrueSceneId },
              { label: "Nếu không", to: scene.ifFalseSceneId },
            ];
      const used = new Set();
      const lanes = arms.map((arm) => {
        const lane = {
          label: arm.label,
          option: arm.option,
          locked: arm.locked,
        };
        if (arm.to && back.has(`${id}>${arm.to}`))
          lane.jump = { to: index.get(arm.to), back: true };
        else if (!arm.to || !index.has(arm.to)) lane.empty = "unset";
        else if (arm.to === join) lane.empty = "join";
        else if (used.has(arm.to))
          lane.jump = { to: index.get(arm.to), back: false, same: true };
        else {
          used.add(arm.to);
          lane.body = sequence(arm.to, join);
          const flat = lane.body.flatMap((block) => block.indexes || []);
          const last = flat.at(-1);
          if (
            last != null &&
            isLinear(scenes[last]) &&
            scenes[last][nextKeyOf(scenes[last])] === join
          )
            lane.last = last;
        }
        return lane;
      });
      blocks.push({
        kind: "branch",
        index: index.get(id),
        choice: type === "choice",
        join: join ? index.get(join) : null,
        sameJoinAsParent: !!join && join === stop,
        lanes,
      });
      id = join;
    }
    flush();
    return blocks;
  }
  return sequence(scenes[0].id, null);
}

/** tóm tắt nhánh của một câu hỏi: số lựa chọn, số đích khác nhau, lựa chọn đi thẳng về điểm nhập, điểm nhập */
export function branchSummary(scenes, scene) {
  const options = scene.options || [],
    targets = new Set(
      options.map((option) => option.nextSceneId).filter(Boolean),
    );
  const join = continuation(scenes, scene);
  return {
    options: options.length,
    targets: targets.size,
    straight: join
      ? options.filter((option) => option.nextSceneId === join).length
      : 0,
    join: join ? scenes.findIndex((item) => item.id === join) : null,
  };
}
