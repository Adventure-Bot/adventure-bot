import { User } from "discord.js";
import { Character } from "../character/Character";
import { getUserCharacter } from "../character/getUserCharacter";
import { QuestId } from "./quests";
import store from "../store";
import { questProgressed } from "../store/slices/characters";

export const updateUserQuestProgess = (
  user: User,
  questId: QuestId,
  change: number
): Character => {
  store.dispatch(
    questProgressed({
      characterId: user.id,
      questId,
      amount: change,
    })
  );

  return getUserCharacter(user);
};
