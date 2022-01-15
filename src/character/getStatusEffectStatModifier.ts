import { isStatusEffectExpired } from "../store/slices/characters";
import { Character } from "./Character";
import { Stat } from "./Stats";

export const getStatusEffectStatModifier = (
  character: Character,
  stat: Stat
): number =>
  (character.statusEffects || [])
    .filter((x) => !isStatusEffectExpired(x))
    .reduce((acc, effect) => acc + (effect.modifiers[stat] || 0), 0);
