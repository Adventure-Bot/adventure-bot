import { makeAttack } from "./makeAttack";
import { isCharacterOnCooldown } from "../character/isCharacterOnCooldown";
import { AttackResult } from "./AttackResult";
import { startCooldown } from "../character/startCooldown";

export const playerAttack = (
  attackerId: string,
  defenderId: string
): AttackResult | { outcome: "cooldown" } | void => {
  if (isCharacterOnCooldown(attackerId, "attack")) {
    return { outcome: "cooldown" };
  }
  const result = makeAttack(attackerId, defenderId);
  if (!result) return;
  startCooldown({ characterId: attackerId, cooldown: "attack" });
  return result;
};
