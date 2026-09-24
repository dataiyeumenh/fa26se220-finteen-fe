const C2_BASE = "/images/c2";

const characterFolderMap = {
  ti: "ti",
  hung: "hung",
  principal: "the-principal",
};

function hasText(value) {
  return Boolean(String(value || "").trim());
}

function inferSprite(spriteFilename = "") {
  const matched = spriteFilename.match(/^c2_(ti|hung|principal)_(.+)\.png$/i);
  if (!matched) return null;

  return {
    characterId: matched[1].toLowerCase(),
    expression: matched[2].toLowerCase(),
  };
}

function buildAssetPath(folder, fileName) {
  if (!fileName) return "";
  return `${C2_BASE}/${folder}/${fileName}`;
}

function buildSceneBackground(scene) {
  if (scene.cutscene_image) return buildAssetPath("scene", scene.cutscene_image);
  if (scene.background) return buildAssetPath("background", scene.background);
  return "";
}

function buildCharacter(spriteFilename) {
  const match = inferSprite(spriteFilename);
  if (!match) return undefined;

  return [{ id: match.characterId, expression: match.expression, position: "left" }];
}

function parseConditionExpression(expression) {
  const normalized = String(expression || "").trim();
  if (!normalized) return null;
  return { check: normalized };
}

function buildConditionChain(scenes, scene) {
  const conditions = scene.conditions || [];
  if (conditions.length === 0) return;

  conditions.forEach((condition, index) => {
    const nodeId = index === 0 ? scene.id : `${scene.id}__cond_${index + 1}`;
    const falseTarget =
      index === conditions.length - 1
        ? scene.default_next
        : `${scene.id}__cond_${index + 2}`;

    scenes.push({
      id: nodeId,
      type: "conditional",
      condition: parseConditionExpression(condition.check),
      ifTrueSceneId: condition.next,
      ifFalseSceneId: falseTarget,
    });
  });
}

function buildMinigame(scene, minigameAssets = {}) {
  return {
    id: scene.id,
    type: "minigame",
    prompt: scene.text || "Hoàn thành thử thách để tiếp tục.",
    onPassSceneId: scene.on_success?.next,
    onFailSceneId: scene.on_failure?.next,
    game: {
      id: scene.minigame_id,
      mode: "serve-customers",
      deskBg: buildAssetPath("mini-game", scene.config?.desk_bg),
      bubbles: {
        default: buildAssetPath("mini-game", minigameAssets.bubble_default),
        correct: buildAssetPath("mini-game", minigameAssets.bubble_correct),
        wrong: buildAssetPath("mini-game", minigameAssets.bubble_wrong),
      },
      timeLimit: scene.config?.time_limit,
      items: (scene.config?.items || []).map((item) => ({
        id: item.id,
        label: item.name,
        image: buildAssetPath("mini-game", item.sprite),
        price: item.price,
      })),
      customers: (scene.config?.customers || []).map((customer) => ({
        id: customer.id,
        order: customer.order,
        sprites: {
          ordering: buildAssetPath("mini-game", customer.sprites?.ordering),
          correct: buildAssetPath("mini-game", customer.sprites?.correct),
          wrong: buildAssetPath("mini-game", customer.sprites?.wrong),
        },
      })),
    },
  };
}

export async function loadChapter2RuntimeData() {
  const response = await fetch(`${C2_BASE}/scene_data_runtime.json`);
  if (!response.ok) {
    throw new Error("Không thể đọc runtime data chương 2 trong /public/images/c2.");
  }

  const runtime = await response.json();
  return adaptChapter2Runtime(runtime);
}

export function adaptChapter2Runtime(runtime) {
  const spriteMap = {};

  Object.entries(runtime.assets?.sprites || {}).forEach(([characterId, expressions]) => {
    const folder = characterFolderMap[characterId] || characterId;
    spriteMap[characterId] = {};

    Object.entries(expressions || {}).forEach(([expression, fileName]) => {
      spriteMap[characterId][expression] = buildAssetPath(folder, fileName);
    });
  });

  const scenes = [];

  const minigameAssets = runtime.assets?.minigame_2_1 || {};

  (runtime.scenes || []).forEach((scene) => {
    if (scene.type === "minigame") {
      scenes.push(buildMinigame(scene, minigameAssets));
      return;
    }

    if (scene.type === "choice") {
      scenes.push({
        id: scene.id,
        type: "dialogue",
        background: buildSceneBackground(scene),
        speaker: scene.speaker,
        speakerId: inferSprite(scene.sprite)?.characterId,
        text: scene.text,
        nextSceneId: null,
        options: (scene.options || []).map((option, index) => ({
          id: `${scene.id}-choice-${index + 1}`,
          label: option.text,
          effects: option.effects,
          nextSceneId: option.next,
        })),
        characters: buildCharacter(scene.sprite),
      });
      return;
    }

    if (scene.type === "cutscene") {
      scenes.push({
        id: scene.id,
        type: "cutscene",
        background: buildSceneBackground(scene),
        nextSceneId: scene.next,
      });
      return;
    }

    if (scene.type === "condition") {
      buildConditionChain(scenes, scene);
      return;
    }

    scenes.push({
      id: scene.id,
      type: "dialogue",
      background: buildSceneBackground(scene),
      speaker: scene.speaker,
      speakerId: inferSprite(scene.sprite)?.characterId,
      text: scene.text,
      nextSceneId: scene.next,
      characters: buildCharacter(scene.sprite),
    });
  });

  return {
    id: `c${runtime.chapter || 2}`,
    title: runtime.title,
    subtitle: "Chương 2 - Quản lý chi tiêu",
    initialStats: runtime.initial_state || {},
    sprites: spriteMap,
    scenes,
  };
}