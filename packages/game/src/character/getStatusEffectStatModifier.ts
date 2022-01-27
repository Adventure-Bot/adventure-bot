import { Character, Stat } from '@adventure-bot/game/character'
import { isStatusEffectExpired } from '@adventure-bot/game/store/slices/characters'

export const getStatusEffectStatModifier = (
  character: Character,
  stat: Stat
): number =>
  (character.statusEffects || [])
    .filter((x) => !isStatusEffectExpired(x))
    .reduce((acc, effect) => acc + (effect.modifiers[stat] || 0), 0)
