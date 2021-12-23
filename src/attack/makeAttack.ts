import { d20 } from "../utils/dice";
import { getCharacter } from "../character/getCharacter";
import { AttackResult } from "./AttackResult";
import { getCharacterStatModified } from "../character/getCharacterStatModified";
import store from "../store";
import { attack, damage } from "../store/slices/characters";

export const makeAttack = (
  attackerId: string,
  defenderId: string
): AttackResult | void => {
  const attacker = getCharacter(attackerId);
  const defender = getCharacter(defenderId);
  if (!attacker || !defender) return;

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
    damageRoll,
    monsterDamageRoll,
    attacker,
    defender,
  };
  store.dispatch(
    attack({
      attackResult,
    })
  );

  if (hit) {
    store.dispatch(
      damage({
        characterId: defenderId,
        amount: totalDamage,
      })
    );
  }

  return attackResult;
};
