import { d20 } from "../utils/dice";
import { getCharacter } from "../character/getCharacter";
import { AttackResult } from "./AttackResult";
import { getCharacterStatModified } from "../character/getCharacterStatModified";
import store from "../store";
import { attacked, damaged } from "../store/slices/characters";
import { selectEncounterById } from "../store/selectors";

export const makeAttack = (
  attackerId: string,
  defenderId: string,
  encounterId?: string
): AttackResult | void => {
  const attacker = getCharacter(attackerId);
  const defender = getCharacter(defenderId);
  if (!attacker || !defender) return;
  const encounter = encounterId
    ? selectEncounterById(store.getState(), encounterId)
    : undefined;

  const attackBonus = getCharacterStatModified(attacker, "attackBonus");
  const targetDefense = getCharacterStatModified(defender, "ac");
  const damageBonus = getCharacterStatModified(attacker, "damageBonus");

  const attackRoll = d20();
  const damageRoll = Math.ceil(
    Math.random() * getCharacterStatModified(attacker, "damageMax")
  );
  const monsterDamageRoll = defender.isMonster
    ? Math.ceil(
        Math.random() * getCharacterStatModified(attacker, "monsterDamageMax")
      )
    : 0;

  const totalDamage = damageRoll + monsterDamageRoll + damageBonus;
  const hit = attackRoll + attackBonus >= targetDefense;

  const attackResult: AttackResult = {
    outcome: hit ? "hit" : "miss",
    attackRoll,
    damage: totalDamage,
    damageBonus,
    damageRoll,
    monsterDamageRoll,
    attacker,
    defender,
  };
  store.dispatch(
    attacked({
      attackResult,
      encounter,
    })
  );

  if (hit) {
    store.dispatch(
      damaged({
        characterId: defenderId,
        amount: totalDamage,
      })
    );
  }

  return attackResult;
};
