import { makeAttack } from "./makeAttack";
import { isCharacterOnCooldown } from "../character/isCharacterOnCooldown";
import { AttackResult } from "./AttackResult";
import { setCharacterCooldown } from "../character/setCharacterCooldown";

export const playerAttack = (
  attackerId: string,
  defenderId: string
): AttackResult | { outcome: "cooldown" } | void => {
  if (isCharacterOnCooldown(attackerId, "attack")) {
    return { outcome: "cooldown" };
  }
  const result = makeAttack(attackerId, defenderId);
  if (!result) return;
  setCharacterCooldown(attackerId, "attack");
  return result;
};
