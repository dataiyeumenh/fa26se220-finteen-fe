const C1_BASE = "/images/c1";

const characterFolderMap = {
  ti: "ti",
  bo: "bo-ti",
  me: "me-ti",
  cotu: "co-tu",
  hung: "hung",
  teo: "teo",
};

function toInternalCategory(category) {
  if (!category) return "want";
  const value = String(category).toLowerCase();
  return value.includes("need") ? "need" : "want";
}

function humanizeItemLabel(id) {
  return id.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

function inferCharacterAndExpression(spriteFilename = "") {
  const matched = spriteFilename.match(
    /^c1_(ti|bo|me|cotu|hung|teo)_(.+)\.png$/i,
  );
  if (!matched) return null;
  return {
    characterId: matched[1].toLowerCase(),
    expression: matched[2].toLowerCase(),
  };
}

function resolveAssetFolder(fileName = "") {
  const normalized = String(fileName).trim();
  if (!normalized) return "";

  const lower = normalized.toLowerCase();
  if (lower.includes("thumbnail")) return "thumbnail";
  if (lower.includes("cutscene")) return "scene";
  if (lower.includes("bg_")) return "background";
  return "background";
}

function normalizeRuntimeAssetFilename(fileName = "") {
  const normalized = String(fileName).trim();

  if (normalized === "c1_thumbnail_mission_3.png") {
    return "c1_thumbnail_mission_3_.png";
  }

  return normalized;
}

function buildSceneBackground(backgroundFile, cutsceneFile, imageFile) {
  const imageCandidate = normalizeRuntimeAssetFilename(
    imageFile || cutsceneFile,
  );
  const cutsceneCandidate = normalizeRuntimeAssetFilename(cutsceneFile);
  const backgroundCandidate = normalizeRuntimeAssetFilename(backgroundFile);

  if (imageCandidate) {
    return `${C1_BASE}/${resolveAssetFolder(imageCandidate)}/${imageCandidate}`;
  }

  if (cutsceneCandidate) {
    return `${C1_BASE}/${resolveAssetFolder(cutsceneCandidate)}/${cutsceneCandidate}`;
  }

  if (backgroundCandidate) {
    return `${C1_BASE}/${resolveAssetFolder(backgroundCandidate)}/${backgroundCandidate}`;
  }

  return "";
}

function buildCharacterFromSpriteFilename(spriteFilename) {
  const match = inferCharacterAndExpression(spriteFilename);
  if (!match) return undefined;
  return [
    { id: match.characterId, expression: match.expression, position: "left" },
  ];
}

function hasEffects(effects) {
  return Boolean(effects && Object.keys(effects).length > 0);
}

function hasText(value) {
  return Boolean(String(value || "").trim());
}

function createOutcomeScene({ id, parentScene, nextSceneId, outcome }) {
  if (!outcome) return null;

  const hasOutcomeText = hasText(outcome.text);
  const hasOutcomeCutscene = hasText(outcome.cutscene);
  const hasOutcomeSprite = hasText(outcome.sprite);
  const hasOutcomeSpeaker = hasText(outcome.speaker);
  const hasOutcomeEffects = hasEffects(outcome.effects);

  if (
    !hasOutcomeText &&
    !hasOutcomeCutscene &&
    !hasOutcomeSprite &&
    !hasOutcomeSpeaker &&
    !hasOutcomeEffects
  ) {
    return null;
  }

  if (
    hasOutcomeCutscene &&
    !hasOutcomeText &&
    !hasOutcomeSprite &&
    !hasOutcomeSpeaker
  ) {
    return {
      id,
      type: "cutscene",
      background: buildSceneBackground(
        parentScene.background,
        outcome.cutscene,
      ),
      effects: outcome.effects,
      nextSceneId,
    };
  }

  return {
    id,
    type: "dialogue",
    background: buildSceneBackground(
      parentScene.background,
      outcome.cutscene || parentScene.cutscene,
    ),
    speaker: outcome.speaker || parentScene.speaker || "He thong",
    speakerId: inferCharacterAndExpression(outcome.sprite || "")?.characterId,
    text: hasOutcomeText ? outcome.text : "...",
    effects: outcome.effects,
    nextSceneId,
    characters: buildCharacterFromSpriteFilename(outcome.sprite),
  };
}

function parseRuntimeTextToObject(rawText) {
  try {
    return JSON.parse(rawText);
  } catch {
    // Accept JS assignment form: const CHAPTER_1_RUNTIME_DATA = { ... };
    const equalIndex = rawText.indexOf("=");
    if (equalIndex === -1)
      throw new Error("Runtime file is neither JSON nor JS assignment format.");

    const objectText = rawText
      .slice(equalIndex + 1)
      .trim()
      .replace(/;\s*$/, "");
    // Trusted local authoring file in workspace.
    return new Function(`return (${objectText})`)();
  }
}

export async function loadChapter1RuntimeData() {
  let rawText = "";

  const preferredFiles = ["scene_data_runtime.js", "scene_data_runtime.json"];
  let loadedFile = "";

  for (const fileName of preferredFiles) {
    const response = await fetch(`${C1_BASE}/${fileName}`);
    if (response.ok) {
      rawText = await response.text();
      loadedFile = fileName;
      break;
    }
  }

  if (!rawText) {
    throw new Error("Không thể đọc runtime data trong /public/images/c1.");
  }

  const runtime = parseRuntimeTextToObject(rawText);
  return adaptChapter1Runtime(runtime, loadedFile);
}

export function adaptChapter1Runtime(
  runtime,
  sourceFile = "scene_data_runtime.json",
) {
  const spriteMap = {};

  Object.entries(runtime.assets?.sprites || {}).forEach(
    ([characterId, expressions]) => {
      const folder = characterFolderMap[characterId] || characterId;
      spriteMap[characterId] = {};

      Object.entries(expressions || {}).forEach(([expression, fileName]) => {
        spriteMap[characterId][expression] = `${C1_BASE}/${folder}/${fileName}`;
      });
    },
  );

  const miniGameItemsById = {};
  (runtime.assets?.minigame_items || []).forEach((item) => {
    miniGameItemsById[item.id] = {
      id: item.id,
      label: item.name || humanizeItemLabel(item.id),
      image: `${C1_BASE}/mini-game/${item.src}`,
      category: toInternalCategory(item.category),
    };
  });

  const scenes = [];

  (runtime.scenes || []).forEach((scene) => {
    if (scene.type === "minigame_drag_drop") {
      const passSceneId = `${scene.id}__pass`;
      const failSceneId = `${scene.id}__fail`;
      const passOutcomeScene = createOutcomeScene({
        id: passSceneId,
        parentScene: scene,
        nextSceneId: scene.onCorrect?.nextScene,
        outcome: scene.onCorrect,
      });
      const failOutcomeScene = createOutcomeScene({
        id: failSceneId,
        parentScene: scene,
        nextSceneId: scene.onWrong?.nextScene,
        outcome: scene.onWrong,
      });

      scenes.push({
        id: scene.id,
        type: "minigame",
        prompt: scene.title || "Kéo thả item vào 2 vùng Cần và Muốn.",
        onPassSceneId: passOutcomeScene
          ? passSceneId
          : scene.onCorrect?.nextScene,
        onFailSceneId: failOutcomeScene
          ? failSceneId
          : scene.onWrong?.nextScene,
        game: {
          id: scene.gameType || "NEEDS_VS_WANTS",
          zones: ["inventory", "need", "want"],
          items: (scene.items || [])
            .map((itemId) => miniGameItemsById[itemId])
            .filter(Boolean),
        },
      });

      if (passOutcomeScene) scenes.push(passOutcomeScene);
      if (failOutcomeScene) scenes.push(failOutcomeScene);
      return;
    }

    if (scene.type === "conditional_branch") {
      scenes.push({
        id: scene.id,
        type: "conditional",
        condition: scene.condition,
        ifTrueSceneId: scene.ifTrue,
        ifFalseSceneId: scene.ifFalse,
      });
      return;
    }

    if (scene.type === "chapter_summary") {
      const lastScene = scenes[scenes.length - 1];

      if (lastScene && lastScene.nextSceneId === scene.id) {
        lastScene.type = "summary";
        lastScene.title = scene.title;
        lastScene.nextChapter = scene.nextChapter;
        delete lastScene.nextSceneId;
      } else {
        scenes.push({
          id: scene.id,
          type: "summary",
          title: scene.title,
          nextChapter: scene.nextChapter,
        });
      }
      return;
    }

    if (scene.type === "cutscene" || scene.type === "scene") {
      scenes.push({
        id: scene.id,
        type: "cutscene",
        background: buildSceneBackground(
          scene.background,
          scene.cutscene,
          scene.image,
        ),
        nextSceneId: scene.nextScene,
      });
      return;
    }

    const character = inferCharacterAndExpression(scene.sprite);
    const background = buildSceneBackground(
      scene.background,
      scene.cutscene,
      scene.image,
    );
    const options = (scene.choices || []).map((choice, index) => {
      const outcomeSceneId = `${scene.id}__choice_${index + 1}`;
      const outcomePayload = {
        speaker: choice.dialogue?.speaker,
        sprite: choice.dialogue?.sprite,
        text: choice.dialogue?.text,
        effects: choice.effects,
        cutscene: choice.cutscene,
      };

      const outcomeScene = createOutcomeScene({
        id: outcomeSceneId,
        parentScene: scene,
        nextSceneId: choice.nextScene,
        outcome: outcomePayload,
      });

      if (outcomeScene) {
        scenes.push(outcomeScene);
      }

      return {
        id: `${scene.id}-choice-${index + 1}`,
        label: choice.text,
        effects: undefined,
        nextSceneId: outcomeScene ? outcomeSceneId : choice.nextScene,
      };
    });

    scenes.push({
      id: scene.id,
      type: "dialogue",
      background,
      speaker: scene.speaker,
      speakerId: character?.characterId,
      text: scene.text,
      effects: scene.effects,
      nextSceneId: scene.nextScene,
      options,
      characters: character
        ? [
            {
              id: character.characterId,
              expression: character.expression,
              position: "left",
            },
          ]
        : undefined,
    });
  });

  return {
    id: runtime.chapterId,
    title: runtime.title,
    subtitle: runtime.context || `Runtime data from ${sourceFile}`,
    initialStats: runtime.initialStats || {},
    sprites: spriteMap,
    scenes,
  };
}
