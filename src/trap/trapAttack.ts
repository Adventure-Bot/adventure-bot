import { getCharacterStatModified } from "../character/getCharacterStatModified";
import { d20, d6 } from "../utils/dice";
import { TrapResult } from "./TrapResult";
import { getCharacter } from "../character/getCharacter";
import store from "../store";
import { damaged } from "../store/slices/characters";

export const trapAttack = (
  characterId: string,
  attackBonus = 1
): TrapResult | void => {
  const defender = getCharacter(characterId);
  if (!defender) return;
  const attackRoll = d20();
  const damage = d6();
  if (attackRoll + attackBonus > getCharacterStatModified(defender, "ac")) {
    store.dispatch(
      damaged({
        characterId,
        amount: damage,
      })
    );
    return { outcome: "hit", attackRoll, attackBonus, damage, defender };
  }
  return { outcome: "miss", attackRoll, attackBonus, damage, defender };
};
