import { Character, Stat } from '@adventure-bot/game/character'
import { isStatusEffectExpired } from '@adventure-bot/game/statusEffects'
import { selectCharacterEffects } from '@adventure-bot/game/store/selectors'

export const getStatusEffectStatModifier = (
  character: Character, // TODO: pass characterId: string instead
  stat: Stat
): number =>
  selectCharacterEffects(character.id)
    .filter((x) => !isStatusEffectExpired(x))
    .reduce((acc, effect) => acc + (effect.modifiers?.[stat] || 0), 0)
