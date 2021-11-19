import { Character } from "../Character";
import { getCharacterStatModified } from "../getCharacterStatModified";
import { clamp, times } from "remeda";
import { getCharacterUpdate } from "../getCharacterUpdate";

export const hpBar = (c: Character, adjustment = 0): string => {
  const barLength = 10;
  const character = getCharacterUpdate(c);

  const maxHP = getCharacterStatModified(character, "maxHP");
  const fullPercent = character.hp / maxHP;
  const adjustPercent = adjustment / maxHP;
  const healPercent = clamp(adjustPercent, { max: 1, min: 0 });
  const damagePercent = clamp(-adjustPercent, { max: 1, min: 0 });

  const damage = clamp(Math.floor(damagePercent * barLength), {
    max: maxHP,
    min: 0,
  });

  const heal = clamp(Math.floor(healPercent * barLength), {
    max: maxHP,
    min: 0,
  });

  const full = Math.ceil((fullPercent - healPercent) * barLength);

  const empty = clamp(barLength - full - damage - heal, {
    max: maxHP,
    min: 0,
  });
  console.log(
    "hpBar",
    { full, damage, heal, empty },
    { character, adjustment }
  );
  if (full < 0) return `bug: full ${full}`;
  if (damage < 0) return `bug: damage ${damage}`;
  if (heal < 0) return `bug: heal ${heal}`;
  if (empty < 0) return `bug: empty ${empty}`;
  try {
    return (
      repeat("💚", full) +
      repeat("💔", damage) +
      repeat("🤍", heal) +
      repeat("🖤", empty)
    );
  } catch (e) {
    console.error("hp bar failed", e);
    return `hp bar failed ${e}`;
  }
};

const repeat = (str: string, num: number) => times(num, () => str).join("");
