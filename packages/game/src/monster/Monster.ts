import { Character } from '@adventure-bot/game/character'
import { MonsterKind } from '@adventure-bot/game/monster'

export type Monster = Character & {
  kind: MonsterKind
  isMonster: true
}

export const isMonster = (character: Character): character is Monster =>
  character.isMonster ?? false
