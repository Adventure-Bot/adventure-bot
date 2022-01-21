import { Character } from '@adventure-bot/character/Character'

export const isHealer = (character: Character): boolean =>
  (character.statusEffects?.filter((effect) => effect.name === 'Healer')
    .length ?? 0) > 0
