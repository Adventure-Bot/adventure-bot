import { Character } from "../character/Character";
import { QuestId, quests } from "./quests";

/**
 * @deprecated Use `grantQuest` from slices instead.
 * @param character
 * @param questId
 * @returns
 */
export const grantQuest = (character: Character, questId: QuestId): Character =>
  character.quests[questId]
    ? character
    : {
        ...character,
        quests: { ...character.quests, [questId]: { ...quests[questId] } },
      };
