import { Character, Stat } from '@adventure-bot/character'
import { isStatusEffectExpired } from '@adventure-bot/store/slices/characters'

export const getStatusEffectStatModifier = (
  character: Character,
  stat: Stat
): number =>
  (character.statusEffects || [])
    .filter((x) => !isStatusEffectExpired(x))
    .reduce((acc, effect) => acc + (effect.modifiers[stat] || 0), 0)
