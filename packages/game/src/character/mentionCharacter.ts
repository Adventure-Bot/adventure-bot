import { Character } from '@adventure-bot/game/character'

export const mentionCharacter = (character: Character): string =>
  character.isMonster ? character.name : `<@${character.id}>`
