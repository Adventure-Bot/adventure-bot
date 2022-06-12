import { Character } from '@adventure-bot/game/character'
import { selectCharacterEffects } from '@adventure-bot/game/store/selectors'

export const isHealer = (character: Character): boolean =>
  (selectCharacterEffects(character.id).filter(
    (effect) => effect.name === 'Healer'
  ).length ?? 0) > 0
